import { Calendar, User } from "lucide-react";
import "../../styles/button.css";

export function ForumHeader({ onClickBack, onClickPost }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h1 className="mb-4 fw-bold">Forum</h1>
      <div className="d-flex gap-2">
        <button
          className="secondaryButton px-4 py-2"
          style={{ borderRadius: "0.6rem" }}
          onClick={() => onClickBack()}
        >
          Back
        </button>

        <button
          className="secondaryButton px-4 py-2"
          style={{ borderRadius: "0.6rem" }}
          onClick={onClickPost}
        >
          Create Post
        </button>
      </div>
    </div>
  );
}

export function Posts({ posts, handleUserClick, onClickComments }) {
  return (
    <>
      {posts.length === 0 ? (
        <div className="card text-center p-4 text-muted">
          No posts yet. Be the first to create one!
        </div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title fw-semibold mb-2">{post.title}</h5>

              <div className="d-flex gap-3 text-muted small mb-3">
                <div className="d-flex align-items-center gap-1">
                  <User size={14} />
                  {post.author && post.author !== "Deleted User" ? (
                    <span
                      onClick={() => handleUserClick(post.author)}
                      style={{
                        cursor: "pointer",
                        textDecoration: "underline",
                        color: "#004E72",
                      }}
                      onMouseEnter={(e) => (e.target.style.color = "#e6b400")}
                      onMouseLeave={(e) => (e.target.style.color = "#004E72")}
                    >
                      {post.author}
                    </span>
                  ) : (
                    <span>{post.author || "Deleted User"}</span>
                  )}
                </div>
                <div className="d-flex align-items-center gap-1">
                  <Calendar size={14} />
                  <span>{post.date}</span>
                </div>
              </div>

              <p className="card-text" style={{ whiteSpace: "pre-wrap" }}>
                {post.content}
              </p>

              <button
                onClick={() => onClickComments(post.id)}
                className="secondaryButton px-3 py-1"
                style={{ borderRadius: "0.6rem" }}
              >
                Check Comments
              </button>
            </div>
          </div>
        ))
      )}
    </>
  );
}
