import json
from pathlib import Path

from app import app
from models import Distribution, db

DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "os.json"


def setup_and_seed():
    with app.app_context():
        db.create_all()
        print("✔ Database schema checked/created.")

        try:
            if Distribution.query.first() is None:
                print("-> Table 'distribution' is empty. Starting seeding...")

                if not DATA_FILE.exists():
                    print(f"❌ Error: {DATA_FILE} not found.")
                    print("Generate the dataset first with: python -m scripts.scraper")
                    return

                with open(DATA_FILE, 'r', encoding='utf-8') as f:
                    distros_data = json.load(f)

                count = 0
                for item in distros_data:
                    url = item.get('url', '')
                    logo_name = url.strip('/').split('/')[-1]

                    new_distro = Distribution(
                        name=item.get('name'),
                        os_type=item.get('OS Type'),
                        based_on=item.get('Based on'),
                        origin=item.get('Origin'),
                        architecture=item.get('Architecture'),
                        desktop=item.get('Desktop'),
                        category=item.get('Category'),
                        status=item.get('Status'),
                        popularity=item.get('Popularity'),
                        description=item.get('description'),
                        price=item.get('Price (US$)'),
                        image_size=item.get('Image Size (MB)'),
                        download_url=item.get('Download'),
                        beginner_friendly=item.get('Beginner-friendly', False),
                        logo_name=logo_name,
                        rolling_release=item.get('rolling_release', False),
                        classic_design=item.get('classic_design', False),
                        modern_design=item.get('modern_design', False),
                        proprietary_friendly=item.get('proprietary_friendly', False)
                    )
                    db.session.add(new_distro)
                    count += 1

                db.session.commit()
                print(f"✔ Success: {count} entries added.")
            else:
                print("-> Info: Table already has data. Skipping seeding.")

        except Exception as e:
            print(f"❌ Error during seeding: {e}")


if __name__ == "__main__":
    setup_and_seed()
    print("Setup finished.")
