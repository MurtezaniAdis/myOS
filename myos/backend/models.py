from datetime import datetime, timezone

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Distribution(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    os_type = db.Column(db.String(50))
    based_on = db.Column(db.String(100))
    origin = db.Column(db.String(50))
    architecture = db.Column(db.String(100))
    desktop = db.Column(db.String(100))
    category = db.Column(db.String(100))
    status = db.Column(db.String(50))
    popularity = db.Column(db.String(50))
    description = db.Column(db.Text)
    price = db.Column(db.String(50))
    image_size = db.Column(db.String(50))
    download_url = db.Column(db.String(255))
    logo_name = db.Column(db.String(100), nullable=True)
    beginner_friendly = db.Column(db.Boolean, default=False)
    youtube_link = db.Column(db.String(500), nullable=True)
    rolling_release = db.Column(db.Boolean, default=False)
    classic_design = db.Column(db.Boolean, default=False)
    modern_design = db.Column(db.Boolean, default=False)
    proprietary_friendly = db.Column(db.Boolean, default=False)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    favorite_distro_id = db.Column(db.Integer, db.ForeignKey('distribution.id'), nullable=True)
    favorite_distro = db.relationship('Distribution', backref='users_who_favorited')


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, index=True, default=lambda: datetime.now(timezone.utc))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='SET NULL'), nullable=True)

    author = db.relationship('User', backref=db.backref('posts', lazy=True))
    comments = db.relationship('Comment', back_populates='parent_post', cascade="all, delete-orphan")


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    edited_at = db.Column(db.DateTime, nullable=True)

    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='SET NULL'), nullable=True)

    author = db.relationship('User', backref=db.backref('comments_made', lazy=True))
    parent_post = db.relationship('Post', back_populates='comments')
