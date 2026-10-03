const URLS = {
    login: "http://localhost:3100/auth/login",
    register: "http://localhost:3100/auth/register",
};

export async function auth(username, password, isLogin) {
    const url = isLogin ? URLS.login : URLS.register;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        return { ok: response.ok, data };
    } catch (error) {
        console.error("Auth error:", error);
        return { ok: false, data: { message: "Something went wrong" } };
    }
}
