import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../pictures/css/button.css';

export function AccountHeader({ username, favoriteOS, favoriteId, onRemove }) {
  const navigate = useNavigate();

  return (
    <>
      <h2 className='mb-4'>{username}</h2>

      <p className='mb-2'> My favorite OS is:</p>

      {favoriteOS ? (
        <div className='d-flex flex-row align-items-center gap-2 mb-5'>
          <button
            onClick={() => navigate(`/detail/${favoriteId}`)}
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
            {favoriteOS}
          </button>

          <button
            onClick={onRemove}
            className='btn btn-sm'
            style={{
              background: 'transparent',
              color: '#FF2132',
              borderColor: '#FF2132',
              borderRadius: '0.5rem',
              fontSize: '0.8rem',
              padding: '0.3rem 0.8rem',
            }}
          >
            Remove
          </button>
        </div>
      ) : (
        <div className='mb-5'>
          <p className='mb-2 text-muted' style={{ fontSize: '0.9rem' }}>
            <i>No favorite operating system selected yet.</i>
          </p>
          <button
            onClick={() => navigate('/catalog')}
            className='primaryButton'
            style={{
              color: '#FEFEFE',
              borderRadius: '0.6rem',
              padding: '0.4rem 1rem',
              fontWeight: '600',
            }}
          >
            + Choose from Catalog
          </button>
        </div>
      )}
    </>
  );
}

export function AccountButtons({ logout, deleteAccount }) {
  return (
    <>
      <div className='d-flex flex-row gap-4 mb-4'>
        <button
          onClick={logout}
          className='secondaryButton px-4 py-2'
          style={{
            borderRadius: '0.6rem',
          }}
        >
          Log out
        </button>

        <button
          onClick={deleteAccount}
          className='tertiaryButton px-4 py-2'
          style={{
            borderRadius: '0.6rem',
          }}
        >
          Delete Account
        </button>
      </div>
    </>
  );
}

export function ForumPart({ posts, loading, error, deletePost, navigate }) {

  return (
    <>
      <div>
        <h4>My Posts</h4>
        {loading ? (
          <div className='text-center py-4'>
            <div className='spinner-border text-primary' role='status'>
              <span className='visually-hidden'>Loading posts...</span>
            </div>
            <p className='mt-2'>Loading your posts...</p>
          </div>
        ) : error ? (
          <div className='alert alert-danger' role='alert'>
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className='alert alert-info' role='alert'>
            You haven't created any posts yet.
            <button className='btn btn-link p-0 ms-2' onClick={() => navigate('/post')}>
              Create your first post
            </button>
          </div>
        ) : (
          <div className='list-group gap-4'>
            {posts.map((post) => (
              <div
                key={post.id}
                className='list-group-item d-flex flex-column p-4'
                style={{ backgroundColor: '#B3E5FC', borderRadius: '0.8rem', }}
              >
                <h5>{post.title}</h5>
                {post.date && <p>Posted on: {post.date}</p>}
                <p>{post.content}</p>
                <div className='d-flex justify-content-end gap-2'>
                  <button
                    className='secondaryButton px-4 py-2'
                    style={{
                      borderRadius: '0.6rem',
                    }}
                    onClick={() => navigate(`/post/${post.id}`)}
                  >
                    View
                  </button>
                  <button
                    className='tertiaryButton px-4 py-2'
                    style={{
                      borderRadius: '0.6rem',
                    }}
                    onClick={() => deletePost(post.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}{' '}
          </div>
        )}
      </div>
    </>
  );
}
