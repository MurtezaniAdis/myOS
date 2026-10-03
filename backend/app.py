import os
import secrets
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from googleapiclient.discovery import build
from werkzeug.security import check_password_hash, generate_password_hash

from models import Comment, Distribution, Post, User, db
from services.distro_loader import load_distros_from_db
from services.recommender import recommend_distros
from services.security import get_security_info

load_dotenv()
app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', secrets.token_hex(32))
CORS(
    app,
    origins=["http://localhost:8080", "http://127.0.0.1:8080"],
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["SESSION_PERMANENT"] = True
app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(hours=1)
db.init_app(app)

YT_KEY = os.getenv("YOUTUBE_API_KEY")


def get_yt_link(distro_name):
    distro_obj = Distribution.query.filter_by(name=distro_name).first()
    if distro_obj and distro_obj.youtube_link:
        return distro_obj.youtube_link

    search_fallback = f"https://www.youtube.com/results?search_query={distro_name.replace(' ', '+')}+installation+tutorial"

    try:
        if not YT_KEY:
            return search_fallback

        youtube = build("youtube", "v3", developerKey=YT_KEY)
        request = youtube.search().list(
            q=f"{distro_name} installation tutorial",
            part="snippet",
            maxResults=1,
            type="video"
        )
        response = request.execute()

        if response.get('items'):
            video_id = response['items'][0]['id']['videoId']
            link = f"https://www.youtube.com/watch?v={video_id}"

            if distro_obj:
                distro_obj.youtube_link = link
                db.session.commit()
            return link

    except Exception as e:
        print(f"YouTube API not reachable for {distro_name}: {e}")

    return search_fallback


@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Username already exists"}), 400

    hashed_password = generate_password_hash(password)

    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"username": username, "message": "User created successfully"}), 201


@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password, password):
        session.clear()
        session["user_id"] = user.id
        session["username"] = user.username

        return jsonify({
            "username": user.username,
            "message": "Login successful"
        }), 200

    return jsonify({"message": "Invalid username or password"}), 401


@app.route('/auth/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logged out"}), 200


@app.route('/distros', methods=['GET'])
def get_all_distros():
    try:
        distros = Distribution.query.all()
        output = []
        for d in distros:
            output.append({
                "id": d.id,
                "name": d.name,
                "download_url": d.download_url,
                "os_type": d.os_type,
                "based_on": d.based_on,
                "desktop": d.desktop,
                "category": d.category,
                "description": d.description,
                "price": d.price,
                "beginner_friendly": d.beginner_friendly,
                "logo_name": d.logo_name,
                "youtube_link": d.youtube_link,
                "image_size": d.image_size,
                "security_info": get_security_info(d)
            })
        return jsonify(output), 200
    except Exception as e:
        print(f"Catalog Error: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/quiz/submit', methods=['POST'])
def handle_submit():
    data = request.get_json()

    user_answers = data.get('answers')
    all_distros = load_distros_from_db()

    recommendations = recommend_distros(user_answers, all_distros)

    for distro in recommendations:
        distro['install_video'] = get_yt_link(distro['name'])

    return jsonify({
        "status": "success",
        "recommendations": recommendations
    })


@app.route('/auth/check', methods=['GET'])
def check_auth():
    if "user_id" in session:
        user = User.query.get(session["user_id"])
        if user:
            return jsonify({
                "loggedIn": True,
                "user": {
                    "username": user.username,
                    "id": user.id,
                    "favorite_os_name": user.favorite_distro.name if user.favorite_distro else None,
                    "favorite_distro_id": user.favorite_distro_id
                }
            }), 200

    return jsonify({
        "loggedIn": False,
        "user": None
    }), 200


@app.route('/api/user/favorite', methods=['POST'])
def toggle_favorite():
    if "user_id" not in session:
        return jsonify({"message": "Not authenticated"}), 401

    data = request.get_json()
    distro_id = data.get('distro_id')
    user = User.query.get(session["user_id"])

    if user.favorite_distro_id == distro_id:
        user.favorite_distro_id = None
        status = "removed"
    else:
        user.favorite_distro_id = distro_id
        status = "added"

    db.session.commit()
    return jsonify({"status": status})


@app.route('/auth/delete/<username>', methods=['DELETE'])
def delete_account(username):
    session.clear()
    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({"message": "User not found"}), 404

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "Account deleted successfully"}), 200
    except Exception:
        db.session.rollback()
        return jsonify({"message": "Error deleting account"}), 500


@app.route('/forum/posts', methods=['GET'])
def get_posts():
    posts = Post.query.order_by(Post.timestamp.desc()).all()
    output = []
    for post in posts:
        output.append({
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "author": post.author.username if post.author else None,
            "date": post.timestamp.strftime("%Y-%m-%d %H:%M")
        })
    return jsonify(output)


@app.route('/forum/posts', methods=['POST'])
def create_post():
    data = request.get_json()
    username = data.get('username')

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    new_post = Post(
        title=data.get('title'),
        content=data.get('content'),
        user_id=user.id
    )

    db.session.add(new_post)
    db.session.commit()
    return jsonify({"message": "Post created!", "post_id": new_post.id}), 201


@app.route('/forum/users/<username>/posts', methods=['GET'])
def get_user_posts(username):
    user = User.query.filter_by(username=username).first_or_404()

    user_posts = Post.query.filter_by(user_id=user.id).order_by(Post.timestamp.desc()).all()

    output = []
    for post in user_posts:
        output.append({
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "date": post.timestamp.strftime("%Y-%m-%d %H:%M"),
            "comment_count": len(post.comments)
        })

    return jsonify(output)


@app.route('/api/users/<username>', methods=['GET'])
def get_user_profile(username):
    user = User.query.filter_by(username=username).first()

    if not user:
        return jsonify({"message": "User not found"}), 404

    user_posts = Post.query.filter_by(user_id=user.id).order_by(Post.timestamp.desc()).all()

    posts_data = []
    for post in user_posts:
        posts_data.append({
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "date": post.timestamp.strftime("%Y-%m-%d %H:%M"),
            "comment_count": len(post.comments)
        })

    return jsonify({
        "username": user.username,
        "favorite_os_name": user.favorite_distro.name if user.favorite_distro else None,
        "favorite_distro_id": user.favorite_distro_id,
        "posts": posts_data
    }), 200


@app.route('/forum/posts/<int:post_id>/comments', methods=['POST'])
def add_comment(post_id):
    if "user_id" not in session:
        return jsonify({"message": "Login required"}), 401

    Post.query.get_or_404(post_id)

    data = request.get_json()

    if not data.get('content'):
        return jsonify({"error": "Content is required"}), 400

    user = User.query.get(session["user_id"])

    new_comment = Comment(
        content=data.get('content'),
        post_id=post_id,
        user_id=user.id
    )

    db.session.add(new_comment)
    db.session.commit()

    return jsonify({
        "id": new_comment.id,
        "content": new_comment.content,
        "timestamp": new_comment.timestamp.isoformat(),
        "edited_at": None,
        "post_id": new_comment.post_id,
        "user_id": new_comment.user_id,
        "author": {
            "id": user.id,
            "username": user.username
        }
    }), 201


@app.route('/forum/posts/<int:post_id>/comments', methods=['GET'])
def get_comments(post_id):
    Post.query.get_or_404(post_id)

    comments = Comment.query.filter_by(post_id=post_id).order_by(Comment.timestamp.asc()).all()

    output = []
    for comment in comments:
        output.append({
            "id": comment.id,
            "content": comment.content,
            "timestamp": comment.timestamp.isoformat(),
            "edited_at": comment.edited_at.isoformat() if comment.edited_at else None,
            "post_id": comment.post_id,
            "user_id": comment.user_id,
            "author": {
                "id": comment.author.id if comment.author else None,
                "username": comment.author.username if comment.author else None
            }
        })

    return jsonify(output), 200


@app.route('/forum/posts/<int:post_id>', methods=['GET'])
def get_single_post(post_id):
    post = Post.query.get_or_404(post_id)

    return jsonify({
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "timestamp": post.timestamp.isoformat(),
        "user_id": post.user_id,
        "author": {
            "id": post.author.id if post.author else None,
            "username": post.author.username if post.author else None
        }
    }), 200


@app.route('/forum/posts/<int:post_id>', methods=['PUT'])
def edit_post(post_id):
    data = request.get_json()
    post = Post.query.get_or_404(post_id)

    if not post.author or post.author.username != data.get('username'):
        return jsonify({"message": "You can only edit your own posts!"}), 403

    post.title = data.get('title', post.title)
    post.content = data.get('content', post.content)
    db.session.commit()

    return jsonify({"message": "Post updated successfully"})


@app.route('/forum/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    data = request.get_json()
    post = Post.query.get_or_404(post_id)

    if not post.author or post.author.username != data.get('username'):
        return jsonify({"message": "Unauthorized"}), 403

    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Post deleted"})


@app.route('/forum/comments/<int:comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    data = request.get_json()
    comment = Comment.query.get_or_404(comment_id)

    if not comment.author or comment.author.username != data.get('username'):
        return jsonify({"message": "Unauthorized"}), 403

    db.session.delete(comment)
    db.session.commit()
    return jsonify({"message": "Comment removed"})


@app.route('/forum/comments/<int:comment_id>', methods=['PUT'])
def edit_comment(comment_id):
    data = request.get_json()
    comment = Comment.query.get_or_404(comment_id)

    if not comment.author or comment.author.username != data.get('username'):
        return jsonify({"message": "You can only edit your own comments!"}), 403

    new_content = data.get('content')
    if not new_content:
        return jsonify({"message": "Content cannot be empty"}), 400

    comment.content = new_content
    comment.edited_at = datetime.now(timezone.utc)
    db.session.commit()

    return jsonify({
        "message": "Comment updated successfully",
        "content": comment.content,
        "date": comment.edited_at.strftime("%Y-%m-%d %H:%M")
    }), 200


@app.route('/distros/<int:distro_id>', methods=['GET'])
def get_distro_by_id(distro_id):
    try:
        d = Distribution.query.get_or_404(distro_id)
        yt_link = d.youtube_link or get_yt_link(d.name)

        return jsonify({
            "id": d.id,
            "name": d.name,
            "download_url": d.download_url,
            "os_type": d.os_type,
            "based_on": d.based_on,
            "desktop": d.desktop,
            "category": d.category,
            "description": d.description,
            "price": d.price,
            "beginner_friendly": d.beginner_friendly,
            "logo_name": d.logo_name,
            "image_size": d.image_size,
            "youtube_link": yt_link,
            "security_info": get_security_info(d)
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=3100)
