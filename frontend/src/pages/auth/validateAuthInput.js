export function validateAuthInput(username, password, isLogin) {
    if (typeof username !== "string" || typeof password !== "string") {
        return { ok: false, message: "Invalid input" };
    }

    if (username.trim() === "" || password.trim() === "") {
        return {
            ok: false,
            message: "Username and password cannot be empty or only spaces!",
        };
    }

    if (!isLogin && password.length < 6) {
        return {
            ok: false,
            message: "Password must be at least 6 characters long!",
        };
    }

    if (username.length > 15 || password.length > 20) {
        return {
            ok: false,
            message: "Stop bullshitting around with long usernames or passwords!",
        };
    }

    if (password.includes(" ")) {
        return { ok: false, message: "Password cannot contain spaces!" };
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return {
            ok: false,
            message: "Username can only contain letters, numbers, and underscores!",
        };
    }

    return { ok: true };
}
