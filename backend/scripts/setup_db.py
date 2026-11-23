import json
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from app import app
from models import Distribution, db

DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "os.json"


def get_logo_name(item):
    logo_name = item.get("logo_name")
    if logo_name:
        return logo_name

    url = urlparse(item.get("url", ""))
    if url.hostname not in {"distrowatch.com", "www.distrowatch.com"}:
        return None

    query_slug = parse_qs(url.query).get("distribution", [])
    if query_slug:
        return query_slug[0]

    path_parts = url.path.strip("/").split("/")
    if path_parts and path_parts[-1] != "table.php":
        return path_parts[-1]
    return None


def setup_and_seed():
    with app.app_context():
        db.create_all()
        print("Database schema checked/created.")

        if not DATA_FILE.exists():
            raise FileNotFoundError(
                f"{DATA_FILE} not found. Generate it first with: python -m scripts.scraper"
            )

        print("-> Importing distributions from the dataset...")
        try:
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                distros_data = json.load(f)

            distros_by_name = {
                distro.name: distro for distro in Distribution.query.all()
            }
            added = 0
            updated = 0
            for item in distros_data:
                name = item.get("name")
                if not name:
                    raise ValueError("Every distro entry must have a name.")

                distro = distros_by_name.get(name)
                if distro is None:
                    distro = Distribution(name=name)
                    db.session.add(distro)
                    distros_by_name[name] = distro
                    added += 1
                else:
                    updated += 1

                values = {
                    "os_type": item.get("OS Type"),
                    "based_on": item.get("Based on"),
                    "origin": item.get("Origin"),
                    "architecture": item.get("Architecture"),
                    "desktop": item.get("Desktop"),
                    "category": item.get("Category"),
                    "status": item.get("Status"),
                    "popularity": item.get("Popularity"),
                    "description": item.get("description"),
                    "price": item.get("Price (US$)"),
                    "image_size": item.get("Image Size (MB)"),
                    "download_url": item.get("Download"),
                    "beginner_friendly": item.get("Beginner-friendly"),
                    "rolling_release": item.get("rolling_release"),
                    "classic_design": item.get("classic_design"),
                    "modern_design": item.get("modern_design"),
                    "proprietary_friendly": item.get("proprietary_friendly"),
                }
                for field, value in values.items():
                    if value is not None:
                        setattr(distro, field, value)

                logo_name = get_logo_name(item)
                if logo_name:
                    distro.logo_name = logo_name

            db.session.commit()
        except Exception:
            db.session.rollback()
            raise

        print(f"Success: {added} added, {updated} updated.")


if __name__ == "__main__":
    setup_and_seed()
    print("Setup finished.")
