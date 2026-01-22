export async function getDistros() {
    const response = await fetch("http://localhost:3100/distros", {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch distros: ${response.status} ${response.statusText}`);
    }

    return response.json();
}