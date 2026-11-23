import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from app import app, db
from models import Distribution
from scripts.setup_db import setup_and_seed


class DatabaseSeedTests(unittest.TestCase):
    def setUp(self):
        app.config.update(
            TESTING=True,
            SQLALCHEMY_DATABASE_URI="sqlite://",
        )
        with app.app_context():
            db.drop_all()
            db.create_all()
            self.existing = Distribution(
                name="Existing Distro",
                description="Old description",
            )
            db.session.add(self.existing)
            db.session.commit()
            self.existing_id = self.existing.id

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_seed_adds_new_rows_and_updates_existing_rows(self):
        dataset = [
            {
                "name": "Existing Distro",
                "description": "Updated description",
                "url": "https://distrowatch.com/existing",
            },
            {
                "name": "New Distro",
                "Category": "Desktop",
                "url": "https://distrowatch.com/table.php?distribution=new-distro",
            },
        ]

        with tempfile.TemporaryDirectory() as temp_dir:
            data_file = Path(temp_dir) / "os.json"
            data_file.write_text(json.dumps(dataset), encoding="utf-8")
            with patch("scripts.setup_db.DATA_FILE", data_file):
                setup_and_seed()
                setup_and_seed()

        with app.app_context():
            self.assertEqual(Distribution.query.count(), 2)
            existing = Distribution.query.filter_by(name="Existing Distro").one()
            new = Distribution.query.filter_by(name="New Distro").one()
            self.assertEqual(existing.id, self.existing_id)
            self.assertEqual(existing.description, "Updated description")
            self.assertEqual(new.category, "Desktop")
            self.assertEqual(new.logo_name, "new-distro")


if __name__ == "__main__":
    unittest.main()
