import { apiUrl } from "../../../api.js";

export async function fetchDistroById(id) {
    try {
        const response = await fetch(apiUrl(`/distros/${id}`));
        if (!response.ok) throw new Error("Failed to fetch distro");
        return await response.json();
    } catch (err) {
        console.error("FetchDistroById Error:", err);
        throw err;
    }
}

export async function toggleFavorite(distroId) {
    try {
        const response = await fetch(apiUrl("/api/user/favorite"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ distro_id: distroId }),
        });
        if (!response.ok) throw new Error("Failed to toggle favorite");
        return response.json();
    } catch (err) {
        console.error("ToggleFavorite Error:", err);
        throw err;
    }
}
