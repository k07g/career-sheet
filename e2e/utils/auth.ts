import { Page } from "@playwright/test";

/**
 * Seeds a session cookie directly (bypassing the real g4 sign-in flow, which
 * isn't available in CI) so tests can start already authenticated. The proxy
 * only checks for the cookie's presence, not its validity, so a fake value
 * works for everything except calls that actually hit the g4 API (e.g. sign-out,
 * which is designed to fail open and still clear the local session).
 */
export async function loginAs(page: Page, email = "e2e-test@example.com") {
  await page.context().addCookies([
    { name: "g4_access_token", value: "e2e-test-token", url: "http://localhost:3000" },
    { name: "g4_email", value: email, url: "http://localhost:3000" },
  ]);
}
