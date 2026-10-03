import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { PostHeader } from './CommentComponents.jsx';

function CommentEditorPage() {
  const navigate = useNavigate();
  const { postId, commentId } = useParams();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comment, setComment] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingComment, setLoadingComment] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!postId) {
      navigate('/');
      return;
    }

    fetchPost(postId);

    if (commentId) {
      fetchCommentForEditing(commentId);
    }
  }, [postId, commentId]);

  const fetchPost = async (id) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3100/forum/posts/${id}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch the post: ${response.status}`);
      }

      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error('Error fetching the post:', error);
      setError('Could not load the post. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCommentForEditing = async (commentId) => {
    setLoadingComment(true);
    try {
      const response = await fetch(`http://localhost:3100/forum/posts/${postId}/comments`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch comments: ${response.status}`);
      }

      const data = await response.json();

      const foundComment = data.find((comment) => comment.id === parseInt(commentId));

      if (!foundComment) {
        throw new Error('Comment not found');
      }

      if (user && user.username !== foundComment.author.username) {
        setError('You can only edit your own comments');
        navigate(`/post/${postId}`);
        return;
      }

      setComment(foundComment);
      setContent(foundComment.content);
      setIsEditing(true);
    } catch (error) {
      console.error('Error fetching comment:', error);
      setError('Failed to load comment for editing');
      navigate(`/post/${postId}`);
    } finally {
      setLoadingComment(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!content.trim()) {
      alert('Please write your comment!');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let url, method;

      if (isEditing && commentId) {
        url = `http://localhost:3100/forum/comments/${commentId}`;
        method = 'PUT';
      } else {
        url = `http://localhost:3100/forum/posts/${postId}/comments`;
        method = 'POST';
      }

      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          username: user.username,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      alert(isEditing ? 'Comment updated successfully!' : 'Comment posted successfully!');
      navigate(`/post/${postId}`);

    } catch (err) {
      console.error('Error saving comment:', err);
      setError(`Error ${isEditing ? 'updating' : 'posting'} comment: ${err.message}`);
      alert(`Error ${isEditing ? 'updating' : 'posting'} comment: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingComment && isEditing) {
    return (
      <>
        <Navbar />
        <div style={{ marginTop: '8rem', textAlign: 'center' }}>
          <div className='spinner-border text-primary' role='status'>
            <span className='visually-hidden'>Loading comment...</span>
          </div>
          <p>Loading comment for editing...</p>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className='container mt-5 text-center'>
          <div className='spinner-border' />
          <p>Loading post...</p>
        </div>
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Navbar />
        <div className='container mt-5'>
          <div className='alert alert-danger'>{error || 'Post nicht gefunden'}</div>
          <button className='btn btn-primary' onClick={() => navigate('/forum')}>
            Back to Forum
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div
        className='container d-flex flex-column gap-5'
        style={{ color: '#004E72', marginTop: '8rem', padding: '0rem 10rem' }}
      >
        <PostHeader
          title={post.title}
          author={post.author ? post.author.username : 'Deleted User'}
          date={post.date}
          content={post.content}
        />

        <div className='d-flex flex-column gap-2'>
          <h4>Comment</h4>
          <p>{isEditing ? 'Edit your comment here:' : 'Write your comment here:'}</p>
          <div>
            <label className='form-label'>
              <b>Content</b>
            </label>
            <textarea
              className='form-control'
              style={{ height: '150px', boxShadow: '0px 0px 10px -5px black inset' }}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder='Write your comment...'
              disabled={submitting}
            ></textarea>
          </div>
          <div className='d-flex flex-row justify-content-end gap-4 mt-3'>
            <button
              className='secondaryButton px-4 py-2'
              style={{ borderRadius: '0.6rem' }}
              onClick={() => navigate(`/post/${postId}`)}
              disabled={submitting}
            >
              Back
            </button>
            <button
              className='primaryButton px-4 py-2'
              style={{
                color: '#FEFEFE',
                borderRadius: '0.6rem',
              }}
              onClick={handleSubmitComment}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span
                    className='spinner-border spinner-border-sm me-2'
                    role='status'
                    aria-hidden='true'
                  ></span>
                  {isEditing ? 'Updating...' : 'Saving...'}
                </>
              ) : isEditing ? (
                'Update'
              ) : (
                'Save'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CommentEditorPage;
