from services.security import get_security_info


def recommend_distros(user_answers, all_distros):
    scored_results = []

    for distro in all_distros:
        score = 0

        category = (distro.get('category') or "").lower()
        price = (distro.get('price') or "").lower()
        image_size_str = (distro.get('image_size') or "0")
        based_on = (distro.get('based_on') or "").lower()

        def get_first_val(key):
            val = user_answers.get(key, [])
            return val[0] if isinstance(val, list) and len(val) > 0 else val

        selected_use_case = user_answers.get('use_case', [])
        if len(selected_use_case) > 0:
            if selected_use_case[0].lower() in category:
                score += 20

        exp = get_first_val('experience')
        if exp == 'Beginner' and distro.get('beginner_friendly'):
            score += 15
        elif exp == 'Intermediate' and distro.get('beginner_friendly'):
            score += 5

        pop_pref = get_first_val('popularity')
        try:
            pop_value = int(distro.get('popularity') or 999)
        except ValueError:
            pop_value = 999

        if pop_pref == "Absolutely" and pop_value <= 20:
            score += 15
        elif pop_pref == "Would be nice" and pop_value <= 20:
            score += 5

        if get_first_val('hardware') == 'Old' and 'old computers' in category:
            score += 15

        if get_first_val('gui') == 'Yes' and 'desktop' in category:
            score += 15

        if get_first_val('weight') == 'Yes' and get_avg_size(image_size_str) <= 1000:
            score += 10

        if get_first_val('livetest') == 'Yes' and 'live medium' in category:
            score += 10

        update_pref = get_first_val('update_frequency')
        is_rolling = distro.get('rolling_release')
        if update_pref == "Very important (Rolling Release)" and is_rolling:
            score += 10
        elif update_pref == "Not important (Stable Release)" and not is_rolling:
            score += 10

        design_pref = get_first_val('design')
        if design_pref == "Classic (like Windows)" and distro.get('classic_design'):
            score += 10
        elif design_pref == "Modern (like macOS/Gnome)" and distro.get('modern_design'):
            score += 10

        philosophy_pref = get_first_val('philosophy')
        is_friendly = distro.get('proprietary_friendly')
        if philosophy_pref == "Proprietary is fine" and is_friendly:
            score += 10
        elif philosophy_pref == "Open Source only" and not is_friendly:
            score += 10

        base_pref = get_first_val('system_base')
        if base_pref == "Debian / Ubuntu based" and ("debian" in based_on or "ubuntu" in based_on):
            score += 10
        elif base_pref == "Arch based" and "arch" in based_on:
            score += 10
        elif base_pref == "Fedora based" and "fedora" in based_on:
            score += 10

        if get_first_val('price') == 'Yes' and 'free' not in price:
            score = 0

        final_score = min(score, 100)

        if final_score > 0:
            security_info = get_security_info(distro)

            scored_results.append({
                "id": distro.get("id"),
                "name": distro.get("name"),
                "description": distro.get("description", "No description"),
                "match_score": score,
                "logo_name": distro.get("logo_name"),
                "match_percent": final_score,
                "category": distro.get("category"),
                "security_info": security_info,
                "image_size": distro.get("image_size"),
                "download_url": distro.get("download_url"),
                "price": distro.get("price")
            })

    scored_results.sort(key=lambda x: x['match_score'], reverse=True)

    return scored_results[:3]


def get_avg_size(size_string):
    try:
        clean_str = size_string.replace(',', '')
        parts = clean_str.split('-')
        numbers = []
        for p in parts:
            num_only = ''.join(filter(str.isdigit, p))
            if num_only:
                numbers.append(int(num_only))

        if len(numbers) == 2:
            return sum(numbers) / 2
        elif len(numbers) == 1:
            return numbers[0]
        return 0
    except Exception:
        return 0
