import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NAVBAR from "../../SharedComponents/NavbarComponent.jsx";
import Footer from "../../SharedComponents/FooterComponent.jsx";
import { useAuth } from "../../SharedComponents/authContext.jsx";

function Postpage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [title, setTitle] = useState("...");
  const [content, setContent] = useState("...");
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id && user) {
      fetchPostForEditing(id);
    }
  }, [id, user]);

  const fetchPostForEditing = async (postId) => {
    setLoadingPost(true);
    try {
      const response = await fetch(
        `http://localhost:3100/forum/posts/${postId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch post: ${response.status}`);
      }

      const postData = await response.json();

      if (user.username !== postData.author.username) {
        setError("You can only edit your own posts");
        navigate(-1);
        return;
      }

      setTitle(postData.title);
      setContent(postData.content);
      setIsEditing(true);
    } catch (error) {
      console.error("Error fetching post:", error);
      setError("Failed to load post for editing");
      navigate("/forum");
    } finally {
      setLoadingPost(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }
    if (title.length > 60) {
      setError("Title must be 60 characters or less");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const postData = {
        username: user.username,
        title: title.trim(),
        content: content.trim(),
      };

      let url = "http://localhost:3100/forum/posts";
      let method = "POST";

      if (isEditing && id) {
        url = `http://localhost:3100/forum/posts/${id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`,
        );
      }

      if (isEditing) {
        navigate(`/post/${id}`);
      } else {
        navigate("/forum");
      }
    } catch (error) {
      console.error("Error saving post:", error);
      setError(
        `Failed to ${isEditing ? "update" : "save"} post. Please try again.`,
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingPost) {
    return (
      <>
        <NAVBAR />
        <div style={{ marginTop: "8rem", textAlign: "center" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading post...</span>
          </div>
          <p>Loading post for editing...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <NAVBAR />
      <div
        className="container d-flex flex-column gap-2"
        style={{ color: "#004E72", marginTop: "8rem", padding: "0rem 10rem" }}
      >
        <h3>Post</h3>
        <p>{isEditing ? "Edit your post here:" : "Write your post here:"}</p>
        <div>
          <label className="form-label">
            <b>Title</b>
          </label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={60}
            style={{ boxShadow: "0px 0px 10px -5px black inset" }}
            disabled={loading}
          />
        </div>
        <div>
          <label className="form-label">
            <b>Content</b>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-control"
            style={{
              height: "150px",
              boxShadow: "0px 0px 10px -5px black inset",
            }}
            disabled={loading}
          ></textarea>
        </div>
        <div className="d-flex flex-row justify-content-end gap-4 mt-3">
          <button
            className="secondaryButton px-4 py-2"
            style={{
              borderRadius: "0.6rem",
            }}
            onClick={handleBack}
            disabled={loading}
          >
            Back
          </button>
          <button
            className="primaryButton px-4 py-2"
            style={{
              color: "#FEFEFE",
              borderRadius: "0.6rem",
            }}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                {isEditing ? "Updating..." : "Saving..."}
              </>
            ) : isEditing ? (
              "Update Post"
            ) : (
              "Save Post"
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default Postpage;
