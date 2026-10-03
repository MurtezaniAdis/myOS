def get_security_info(distro):
    if isinstance(distro, dict):
        os_type = (distro.get("os_type") or "").lower()
        name = (distro.get("name") or "").lower()
    else:
        os_type = (getattr(distro, "os_type", "") or "").lower()
        name = (getattr(distro, "name", "") or "").lower()

    if "windows" in os_type or "windows" in name:
        return {
            "url": "https://www.youtube.com/watch?v=zIVlsPxcUWk",
            "label": "Windows Security Guide"
        }
    return {
        "url": "https://www.youtube.com/watch?v=k47ins3URAs",
        "label": "Linux Security Guide"
    }
