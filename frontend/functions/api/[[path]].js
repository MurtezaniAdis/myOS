export async function onRequest({ request, env }) {
  if (!env.API_ORIGIN) {
    return new Response("API_ORIGIN is not configured", { status: 500 });
  }

  let apiOrigin;
  try {
    apiOrigin = new URL(env.API_ORIGIN);
  } catch {
    return new Response("API_ORIGIN must be a valid URL", { status: 500 });
  }

  if (
    !["https:", "http:"].includes(apiOrigin.protocol) ||
    apiOrigin.pathname !== "/" ||
    apiOrigin.search ||
    apiOrigin.hash ||
    apiOrigin.username ||
    apiOrigin.password
  ) {
    return new Response("API_ORIGIN must be an HTTP(S) origin", { status: 500 });
  }

  const incomingUrl = new URL(request.url);
  const upstreamUrl = new URL(apiOrigin.origin);
  upstreamUrl.pathname = incomingUrl.pathname.replace(/^\/api(?=\/|$)/, "") || "/";
  upstreamUrl.search = incomingUrl.search;

  return fetch(new Request(upstreamUrl, request));
}
