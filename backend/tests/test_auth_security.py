import os
import unittest

os.environ["APP_ENV"] = "development"
os.environ["SECRET_KEY"] = "test-only-secret"
os.environ["SESSION_COOKIE_SECURE"] = "false"
os.environ["PYTHON_DOTENV_DISABLED"] = "true"

from werkzeug.security import generate_password_hash

from app import app, db
from models import Comment, Distribution, Post, User
from services.distro_loader import load_distros_from_db


class AuthSecurityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        app.config.update(
            TESTING=True,
            SQLALCHEMY_DATABASE_URI="sqlite://",
        )

    def setUp(self):
        self.client = app.test_client()
        with app.app_context():
            db.drop_all()
            db.create_all()

            self.owner = User(
                username="owner",
                password=generate_password_hash("owner-pass"),
            )
            self.attacker = User(
                username="attacker",
                password=generate_password_hash("attacker-pass"),
            )
            db.session.add_all([self.owner, self.attacker])
            db.session.flush()

            self.post = Post(
                title="Original title",
                content="Original content",
                user_id=self.owner.id,
            )
            db.session.add(self.post)
            db.session.flush()

            self.comment = Comment(
                content="Original comment",
                post_id=self.post.id,
                user_id=self.owner.id,
            )
            self.distro = Distribution(
                name="Test Distro",
                category="Desktop",
                price="Free",
                image_size="500",
            )
            db.session.add_all([self.comment, self.distro])
            db.session.commit()

            self.owner_id = self.owner.id
            self.attacker_id = self.attacker.id
            self.post_id = self.post.id
            self.comment_id = self.comment.id
            self.distro_id = self.distro.id

    def authenticate(self, user_id):
        with self.client.session_transaction() as browser_session:
            browser_session["user_id"] = user_id

    def test_account_delete_requires_own_authenticated_session(self):
        response = self.client.delete("/auth/delete/owner")
        self.assertEqual(response.status_code, 401)

        self.authenticate(self.attacker_id)
        response = self.client.delete("/auth/delete/owner")
        self.assertEqual(response.status_code, 403)
        with self.client.session_transaction() as browser_session:
            self.assertEqual(browser_session["user_id"], self.attacker_id)

        self.authenticate(self.owner_id)
        response = self.client.delete("/auth/delete/owner")
        self.assertEqual(response.status_code, 200)
        with self.client.session_transaction() as browser_session:
            self.assertNotIn("user_id", browser_session)

    def test_post_mutations_cannot_use_forged_username(self):
        self.authenticate(self.attacker_id)

        response = self.client.put(
            f"/forum/posts/{self.post_id}",
            json={
                "username": "owner",
                "title": "Attacker title",
                "content": "Attacker content",
            },
        )
        self.assertEqual(response.status_code, 403)

        response = self.client.delete(
            f"/forum/posts/{self.post_id}",
            json={"username": "owner"},
        )
        self.assertEqual(response.status_code, 403)

        with app.app_context():
            post = db.session.get(Post, self.post_id)
            self.assertEqual(post.title, "Original title")
            self.assertEqual(post.content, "Original content")

    def test_owner_can_edit_and_delete_posts_and_comments_without_username_body(self):
        self.authenticate(self.owner_id)

        response = self.client.put(
            f"/forum/posts/{self.post_id}",
            json={"title": "Updated title", "content": "Updated content"},
        )
        self.assertEqual(response.status_code, 200)

        response = self.client.put(
            f"/forum/comments/{self.comment_id}",
            json={"content": "Updated comment"},
        )
        self.assertEqual(response.status_code, 200)

        response = self.client.delete(f"/forum/comments/{self.comment_id}")
        self.assertEqual(response.status_code, 200)

        response = self.client.delete(f"/forum/posts/{self.post_id}")
        self.assertEqual(response.status_code, 200)

    def test_comment_mutations_cannot_use_forged_username(self):
        self.authenticate(self.attacker_id)

        response = self.client.put(
            f"/forum/comments/{self.comment_id}",
            json={"username": "owner", "content": "Attacker comment"},
        )
        self.assertEqual(response.status_code, 403)

        response = self.client.delete(
            f"/forum/comments/{self.comment_id}",
            json={"username": "owner"},
        )
        self.assertEqual(response.status_code, 403)

        with app.app_context():
            comment = db.session.get(Comment, self.comment_id)
            self.assertEqual(comment.content, "Original comment")

    def test_post_creation_uses_session_user_not_body_username(self):
        response = self.client.post(
            "/forum/posts",
            json={"username": "owner", "title": "Forged", "content": "Body"},
        )
        self.assertEqual(response.status_code, 401)

        self.authenticate(self.attacker_id)
        response = self.client.post(
            "/forum/posts",
            json={"username": "owner", "title": "Created", "content": "Body"},
        )
        self.assertEqual(response.status_code, 201)

        with app.app_context():
            post = db.session.get(Post, response.json["post_id"])
            self.assertEqual(post.user_id, self.attacker_id)

    def test_register_rejects_invalid_input_and_accepts_valid_input(self):
        response = self.client.post("/auth/register")
        self.assertEqual(response.status_code, 400)

        invalid_inputs = [
            {},
            {"username": "new_user"},
            {"username": "new_user", "password": "short"},
            {"username": "bad-name", "password": "valid-pass"},
            {"username": "new_user", "password": "has space"},
            {"username": "a" * 16, "password": "valid-pass"},
            {"username": "new_user", "password": "p" * 21},
        ]
        for data in invalid_inputs:
            with self.subTest(data=data):
                response = self.client.post("/auth/register", json=data)
                self.assertEqual(response.status_code, 400)

        response = self.client.post(
            "/auth/register",
            json={"username": "new_user", "password": "valid-pass"},
        )
        self.assertEqual(response.status_code, 201)

    def test_login_rejects_missing_input_without_server_error(self):
        response = self.client.post("/auth/login", json={"username": "owner"})
        self.assertEqual(response.status_code, 400)

    def test_distro_loader_reads_the_active_sqlalchemy_database(self):
        with app.app_context():
            distros = load_distros_from_db()
        self.assertEqual(len(distros), 1)
        self.assertEqual(distros[0]["id"], self.distro_id)
        self.assertEqual(distros[0]["name"], "Test Distro")


if __name__ == "__main__":
    unittest.main()
