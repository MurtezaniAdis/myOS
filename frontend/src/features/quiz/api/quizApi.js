import { apiUrl } from "../../../api.js";

export async function submitQuiz(answers) {
    try {
        const response = await fetch(apiUrl("/quiz/submit"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answers }),
        });

        const data = await response.json();
        return { ok: response.ok, data };
    } catch (error) {
        console.error("Quiz submission error:", error);
        return { ok: false, data: null, error };
    }
}
