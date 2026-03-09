import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NAVBAR from "../../SharedComponents/NavbarComponent.jsx";
import Footer from "../../SharedComponents/FooterComponent.jsx";
import { useAuth } from "../../SharedComponents/authContext.jsx";

function PostReviewpage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    // parallel loading instead of post and then comments
    fetchPostAndComments(id);
  }, [id, navigate]);

  const fetchPostAndComments = async (postId) => {
    setLoading(true);
    setError(null);

    try {
      const [postResponse, commentsResponse] = await Promise.all([
        fetch(`http://localhost:3100/forum/posts/${postId}`, {
          method: "GET",
          credentials: "include",
        }),
        fetch(`http://localhost:3100/forum/posts/${postId}/comments`, {
          method: "GET",
          credentials: "include",
        }),
      ]);

      // Check responses
      if (!postResponse.ok) {
        throw new Error(`Failed to fetch post: ${postResponse.status}`);
      }
      if (!commentsResponse.ok) {
        throw new Error(`Failed to fetch comments: ${commentsResponse.status}`);
      }

      // Parse both responses
      const [postData, commentsData] = await Promise.all([
        postResponse.json(),
        commentsResponse.json(),
      ]);

      setPost(postData);
      setComments(commentsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Could not load the post and comments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const response = await fetch(
        `http://localhost:3100/forum/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(user),
        },
      );

      if (response.ok) {
        navigate("/forum");
      } else {
        alert("Error deleting post.");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Network error.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const response = await fetch(
        `http://localhost:3100/forum/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(user),
        },
      );

      if (response.ok) {
        setComments(comments.filter((c) => c.id !== commentId));
      } else {
        alert("Error deleting comment.");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Network error.");
    }
  };

  const handleCommentClick = () => {
    if (!user) {
      navigate("/auth");
    } else {
      navigate(`/post/${post.id}/comment`);
    }
  };

  const handleUserClick = (username) => {
    if (username && username !== 'Deleted User') {
      // Check if it's the current user
      if (user && user.username === username) {
        navigate('/account');
      } else {
        navigate(`/user/${username}`);
      }
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString("de-DE"),
      time: date.toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const postDate = post ? formatDate(post.timestamp) : { date: "", time: "" };

  if (loading) {
    return (
      <>
        <NAVBAR />
        <div
          className="container d-flex flex-column gap-3"
          style={{ color: "#004E72", marginTop: "8rem", padding: "0rem 10rem" }}
        >
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p>Loading post and comments...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <NAVBAR />
        <div
          className="container d-flex flex-column gap-3"
          style={{ color: "#004E72", marginTop: "8rem", padding: "0rem 10rem" }}
        >
          <div className="alert alert-danger">{error || "Post not found"}</div>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/forum")}
          >
            Back to Forum
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <NAVBAR />

      <div
        className='container d-flex flex-column gap-3'
        style={{ color: '#004E72', marginTop: '8rem', padding: '0rem 10rem' }}
      >
        <div className='d-flex flex-column gap-2'>
          <h4>{post.title}</h4>
          <div className='d-flex gap-3 mb-3'>
            {post.author?.username && post.author.username !== 'Deleted User' ? (
              <span
                className='me-5'
                onClick={() => handleUserClick(post.author.username)}
                style={{
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  color: '#004E72',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.color = '#e6b400'}
                onMouseLeave={(e) => e.target.style.color = '#004E72'}
              >
                {post.author.username}
              </span>
            ) : (
              <span className='me-5'>{post.author?.username || 'Deleted User'}</span>
            )}
            <span>{postDate.date}</span>
            <span>{postDate.time}</span>
          </div>
          <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>

          <div className='d-flex flex-row justify-content-end gap-4 mb-4'>
            <button
              className='secondaryButton px-4 py-2'
              style={{
                borderRadius: '0.6rem',
              }}
              onClick={() => navigate('/forum')}
            >
              Back to Forum
            </button>

            {user && post.author && user.username === post.author.username ? (
              <>
                <button
                  className='secondaryButton px-4 py-2'
                  style={{
                    borderRadius: '0.6rem',
                  }}
                  onClick={() => navigate(`/postEdit/${post.id}`)}
                >
                  Edit
                </button>
                <button
                  className='tertiaryButton px-4 py-2'
                  style={{
                    borderRadius: '0.6rem',
                  }}
                  onClick={() => handleDeletePost(post.id)}
                >
                  Delete
                </button>
              </>
            ) : (
              <button
                className='secondaryButton px-4 py-2'
                style={{
                  borderRadius: '0.6rem',
                }}
                onClick={handleCommentClick}
              >
                Comment
              </button>
            )}
          </div>
        </div>

        <div className='d-flex flex-column gap-2'>
          <h5>Comments {comments.length > 0 && `(${comments.length})`}</h5>
          {comments.length === 0 ? (
            <p className='text-muted'>No comments yet. Be the first to comment!</p>
          ) : (
            <div className='d-flex flex-column gap-4'>
              {comments.map((comment) => {
                const commentDate = formatDate(comment.timestamp);
                const commentAuthor = comment.author?.username || 'Deleted User';
                
                return (
                  <div key={comment.id} className='border-bottom pb-3'>
                    <div className='d-flex gap-3 mb-2'>
                      {commentAuthor !== 'Deleted User' ? (
                        <span
                          className='fw-semibold'
                          onClick={() => handleUserClick(commentAuthor)}
                          style={{
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            color: '#004E72'
                          }}
                          onMouseEnter={(e) => e.target.style.color = '#e6b400'}
                          onMouseLeave={(e) => e.target.style.color = '#004E72'}
                        >
                          {commentAuthor}
                        </span>
                      ) : (
                        <span className='fw-semibold'>{commentAuthor}</span>
                      )}
                      <span className='text-muted'>{commentDate.date}</span>
                      <span className='text-muted'>{commentDate.time}</span>
                    </div>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{comment.content}</p>
                    {user && comment.author && user.username === comment.author.username && (
                      <div className='d-flex flex-row justify-content-end gap-3'>
                        <button
                          className='secondaryButton px-3 py-1'
                          style={{
                            borderRadius: '0.5rem',
                          }}
                          onClick={() => navigate(`/post/${post.id}/comment/${comment.id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className='tertiaryButton px-3 py-1'
                          style={{
                            borderRadius: '0.5rem',
                          }}
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PostReviewpage;