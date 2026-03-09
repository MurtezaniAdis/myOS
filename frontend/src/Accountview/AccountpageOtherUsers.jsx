import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NAVBAR from "../SharedComponents/NavbarComponent.jsx";
import Footer from "../SharedComponents/FooterComponent.jsx";

function AccountpageOtherUsers() {
  const { username } = useParams();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, [username]);

  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3100/api/users/${username}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found');
        }
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <NAVBAR />
        <div className='container text-center mt-5'>
          <div className='spinner-border text-primary' role='status'>
            <span className='visually-hidden'>Loading profile...</span>
          </div>
          <p className='mt-3'>Loading user profile...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <NAVBAR />
        <div className='container' style={{ marginTop: '8rem', marginBottom: '4rem' }}>
          <div className='alert alert-danger' role='alert'>
            {error}
          </div>
          <button
            onClick={() => navigate('/forum')}
            className='secondaryButton px-4 py-2'
            style={{ borderRadius: '0.6rem' }}
          >
            Back to Forum
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NAVBAR />

      <div className='container' style={{ color: '#004E72', marginTop: '8rem', marginBottom: '4rem' }}>
        <div className='d-flex justify-content-between align-items-center mb-4'>
          <h2 className='mb-0'>{profileData.username}'s Profile</h2>
          <button
            onClick={() => navigate('/forum')}
            className='secondaryButton px-4 py-2'
            style={{ borderRadius: '0.6rem' }}
          >
            Back to Forum
          </button>
        </div>

        <p className='mb-2'>Favorite OS:</p>
        {profileData.favorite_os_name ? (
          <div className='mb-5'>
            <button
              onClick={() => navigate(`/detail/${profileData.favorite_distro_id}`)}
              className='btn btn-sm'
              style={{
                background: '#e6b400',
                color: '#ffffff',
                borderRadius: '0.5rem',
                fontSize: '1.2rem',
                padding: '0.3rem 0.8rem',
                fontWeight: '800',
              }}
            >
              {profileData.favorite_os_name}
            </button>
          </div>
        ) : (
          <div className='mb-5'>
            <p className='text-muted' style={{ fontSize: '0.9rem' }}>
              <i>No favorite operating system selected yet.</i>
            </p>
          </div>
        )}

        <div>
          <h4>{profileData.username}'s Posts</h4>
          {profileData.posts.length === 0 ? (
            <div className='alert alert-info' role='alert'>
              This user hasn't created any posts yet.
            </div>
          ) : (
            <div className='list-group gap-4'>
              {profileData.posts.map((post) => (
                <div
                  key={post.id}
                  className='list-group-item d-flex flex-column p-4'
                  style={{ backgroundColor: '#B3E5FC', borderRadius: '0.8rem' }}
                >
                  <h5>{post.title}</h5>
                  {post.date && <p className='text-muted small mb-2'>Posted on: {post.date}</p>}
                  <p>{post.content}</p>
                  <div className='d-flex justify-content-between align-items-center'>
                    <span className='text-muted small'>
                      {post.comment_count} {post.comment_count === 1 ? 'comment' : 'comments'}
                    </span>
                    <button
                      className='secondaryButton px-4 py-2'
                      style={{ borderRadius: '0.6rem' }}
                      onClick={() => navigate(`/post/${post.id}`)}
                    >
                      View Post
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AccountpageOtherUsers;