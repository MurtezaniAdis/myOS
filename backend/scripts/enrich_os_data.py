import json
from pathlib import Path

DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "os.json"

ROLLING_RELEASE_OS = ["Arch", "Manjaro", "Endeavour", "openSUSE", "Solus", "Void"]
CLASSIC_DESIGN_OS = ["Mint", "Zorin", "Kubuntu", "MX Linux", "Deepin", "Lite"]
MODERN_DESIGN_OS = ["elementary", "Ubuntu", "Pop!_OS", "Fedora"]
PROPRIETARY_FRIENDLY_OS = ["Ubuntu", "Pop!_OS", "Manjaro", "Zorin", "Mint"]


def matches_any(name, keywords):
    return any(keyword.lower() in name.lower() for keyword in keywords)


def enrich_data():
    if not DATA_FILE.exists():
        print(f"Error: {DATA_FILE} not found.")
        return

    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        distros = json.load(f)

    print(f"--- Enriching {len(distros)} entries ---")

    true_counts = {"rolling": 0, "classic": 0}

    for distro in distros:
        name = distro.get("name", "")

        distro["rolling_release"] = matches_any(name, ROLLING_RELEASE_OS)
        distro["classic_design"] = matches_any(name, CLASSIC_DESIGN_OS)
        distro["modern_design"] = matches_any(name, MODERN_DESIGN_OS)
        distro["proprietary_friendly"] = matches_any(name, PROPRIETARY_FRIENDLY_OS)

        if distro["rolling_release"]:
            true_counts["rolling"] += 1
        if distro["classic_design"]:
            true_counts["classic"] += 1

    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(distros, f, ensure_ascii=False, indent=4)

    print(f"Enriched: Found {true_counts['rolling']} Rolling and {true_counts['classic']} Classic distros.")


if __name__ == "__main__":
    enrich_data()
