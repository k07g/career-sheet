// Cookie name constants shared between the edge middleware and the Node.js
// route handlers/server components. Kept in their own module (no next/headers
// import) so the edge-runtime middleware doesn't pull in Node-only APIs.
export const ACCESS_TOKEN_COOKIE = "g4_access_token";
export const EMAIL_COOKIE = "g4_email";
