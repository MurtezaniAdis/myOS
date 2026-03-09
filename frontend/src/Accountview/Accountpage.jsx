import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NAVBAR from "../SharedComponents/NavbarComponent.jsx";
import Footer from "../SharedComponents/FooterComponent.jsx";
import {
  AccountHeader,
  AccountButtons,
  ForumPart,
} from "./AccountpageComponents.jsx";

import { useAuth } from "../SharedComponents/authContext";

function Accountpage() {
  const navigate = useNavigate();
  const { user, loading, logout, refreshAuth } = useAuth();

  const [userPosts, setUserPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState(null);

  // Fetch user posts when user is available
  const fetchUserPosts = async () => {
    if (!user || !user.username) return;

    setPostsLoading(true);
    setPostsError(null);

    try {
      const response = await fetch(`http://localhost:3100/forum/users/${user.username}/posts`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      const data = await response.json();
      setUserPosts(data);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      setPostsError('Could not load your posts. Please try again later.');
    } finally {
      setPostsLoading(false);
    }
  };

  const handleRemoveFavorite = async () => {
    await fetch('http://localhost:3100/api/user/favorite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ distro_id: user.favorite_distro_id }),
    });
    await refreshAuth();
  };

  // To delete the post for the user!
  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3100/forum/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(user),
      });

      if (response.ok) {
        fetchUserPosts();
      } else {
        alert('Error deleting post.');
      }
    } catch (error) {
      console.error('Delete Error:', error);
      alert('Network error.');
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }

    // Fetch posts when user is available
    if (user && user.username) {
      fetchUserPosts();
    }
  }, [loading, user, navigate]);

  if (loading) {
    return <div className='text-center mt-5'>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3100/auth/delete/${user.username}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        await logout();
        alert('Account deleted.');
        navigate('/');
      } else {
        alert('Error deleting account.');
      }
    } catch (error) {
      console.error('Delete Error:', error);
      alert('Network error.');
    }
  };

  if (loading) return null;
  if (!user) return null;

  return (
    <>
      <NAVBAR />

      <div className='container' style={{ color: '#004E72', marginTop: '8rem', marginBottom: '4rem' }}>
        <AccountHeader
          username={user.username}
          favoriteOS={user.favorite_os_name}
          favoriteId={user.favorite_distro_id}
          onRemove={handleRemoveFavorite}
        />

        <AccountButtons logout={handleLogout} deleteAccount={handleDeleteAccount} />

        <ForumPart posts={userPosts} loading={postsLoading} error={postsError} deletePost={handleDeletePost} navigate={navigate} />
      </div>
      <Footer />
    </>
  );
}

export default Accountpage;
