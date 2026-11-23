import { apiUrl } from "../../api.js";

export async function fetchAllPosts() {
    const response = await fetch(apiUrl("/forum/posts"), {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch posts");
    }

    return response.json();
}
