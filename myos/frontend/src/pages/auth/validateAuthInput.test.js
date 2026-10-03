import { validateAuthInput } from "./validateAuthInput.js";

describe("validateAuthInput", () => {
    test("username cannot be empty", () => {
        const result = validateAuthInput("", "password123", true);
        expect(result.ok).toBe(false);
    });

    test("password too short during registration", () => {
        const result = validateAuthInput("user1", "123", false);
        expect(result.ok).toBe(false);
    });

    test("valid input returns ok true", () => {
        const result = validateAuthInput("user1", "password123", true);
        expect(result.ok).toBe(true);
    });
});
