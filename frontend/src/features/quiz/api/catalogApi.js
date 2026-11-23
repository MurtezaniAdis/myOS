import { apiUrl } from "../../../api.js";

export async function getDistros() {
    const response = await fetch(apiUrl("/distros"), {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch distros: ${response.status} ${response.statusText}`);
    }

    return response.json();
}
