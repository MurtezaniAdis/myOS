import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../SharedComponents/authContext.jsx";
import { fetchAllPosts } from "./ForumRequests.js";

export function useForum() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        async function loadPosts() {
            try {
                const data = await fetchAllPosts();
                setPosts(data);
            } catch (err) {
                console.error(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        loadPosts();
    }, []);

    const handleCreatePost = () => {
        if (!user) {
            navigate("/auth");
        } else {
            navigate("/post");
        }
    };

    const handleUserClick = (author) => {
        if (author && author !== "Deleted User") {
            if (user && user.username === author) {
                navigate("/account");
            } else {
                navigate(`/user/${author}`);
            }
        }
    };

    return {
        posts,
        loading,
        handleCreatePost,
        handleUserClick,
    };
}