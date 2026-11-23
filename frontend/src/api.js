const apiBaseUrl = (import.meta.env.VITE_API_URL || "http://localhost:3100").replace(/\/+$/, "");

export function apiUrl(path) {
  return `${apiBaseUrl}/${path.replace(/^\/+/, "")}`;
}
