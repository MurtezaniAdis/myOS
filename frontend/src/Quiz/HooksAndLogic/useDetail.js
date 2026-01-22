import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../SharedComponents/authContext.jsx";
import { fetchDistroById, toggleFavorite } from "../Requests/DetailRequests.js";

export function useDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const { user, refreshAuth } = useAuth();

    let origin = null;
    if (location.state) {
        origin = location.state.from;
    }

    let initialDistro = null;
    if (location.state && location.state.distro) {
        initialDistro = location.state.distro;
    }
    const [distro, setDistro] = useState(initialDistro);
    const [loading, setLoading] = useState(!distro);

    const handleBackClick = () => {
        if (origin === "catalog") {
            navigate("/catalog");
        } else if (origin === "results" || origin === "home") {
            navigate(-1);
        } else {
            navigate("/catalog");
        }
    };

    let isFavorite = false;
    if (user && distro && distro.id) {
        if (Number(user.favorite_distro_id) === Number(distro.id)) {
            isFavorite = true;
        }
    }

    const handleToggleFavorite = async() => {
        if (!user) {
            alert("Please log in first to set a favorite OS.");
            return;
        }
        try {
            await toggleFavorite(distro.id);
            await refreshAuth();
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        let shouldFetch = !distro || !distro.download_url || !distro.youtube_link;

        if (shouldFetch) {
            setLoading(true);
            fetchDistroById(id)
                .then((data) => {
                    setDistro(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [id, distro]);

    return {
        distro,
        loading,
        handleBackClick,
        isFavorite,
        handleToggleFavorite,
    };
}