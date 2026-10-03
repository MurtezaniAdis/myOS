export async function fetchAllPosts() {
    const response = await fetch("http://localhost:3100/forum/posts", {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch posts");
    }

    return response.json();
}
