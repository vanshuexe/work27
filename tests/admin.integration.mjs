import assert from "node:assert/strict";
import { randomUUID, randomBytes } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

process.loadEnvFile(".env.local");
const base = process.env.ADMIN_TEST_URL || "http://localhost:3000";
const service = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
const created = [];
const timeout = () => AbortSignal.timeout(30000);

function actionId(name) {
  const file = [".next/dev/server/server-reference-manifest.json", ".next/server/server-reference-manifest.json"].find(existsSync);
  const manifest = JSON.parse(readFileSync(file, "utf8"));
  const entry = Object.entries(manifest.node).find(([,value]) => value.exportedName === name);
  assert(entry, `Load the admin pages before testing ${name}.`);
  return entry[0];
}

async function login(email, password) {
  const form = new FormData();
  form.set("_1_email", email); form.set("_1_password", password);
  // FormData fields precede the root model, matching React's streaming encoder.
  form.set("0", JSON.stringify([{}, "$K1"]));
  return fetch(`${base}/admin/login`, { method: "POST", redirect: "manual", signal: timeout(),
    headers: { "Next-Action": actionId("signIn"), Origin: base, Accept: "text/x-component" }, body: form });
}

try {
  for (const path of ["/admin", "/admin/password"]) {
    const res = await fetch(base + path, { redirect: "manual", signal: timeout() });
    assert.equal(res.status, 307); assert.equal(new URL(res.headers.get("location"), base).pathname, "/admin/login");
  }
  const home = await fetch(base, { signal: timeout() }); const html = await home.text();
  assert.equal(home.status, 200);
  assert(!html.includes(process.env.SUPABASE_SECRET_KEY));
  const media = await fetch(`${base}/api/media/services.json`, { signal: timeout() }); assert.equal(media.status, 404);
  console.log("PASS: protected pages reject anonymous visitors; homepage works; private content and secret key are not exposed.");

  const denied = await fetch(`${base}/admin`, { method: "POST", signal: timeout(),
    headers: { "Next-Action": actionId("publishServices"), "Content-Type": "text/plain;charset=UTF-8", Origin: base },
    body: JSON.stringify([{ services: [], updatedAt: null }]),
  });
  assert((await denied.text()).includes("do not have admin access"));
  console.log("PASS: server action rejects anonymous publishing.");

  for (const role of ["viewer", "admin"]) {
    const email = `cms-verification-${randomUUID()}@example.com`;
    const password = randomBytes(32).toString("base64url");
    const { data, error } = await service.auth.admin.createUser({ email, password, email_confirm: true,
      app_metadata: { role }, user_metadata: { role: "admin" } });
    if (error) throw new Error(`Could not create temporary auth test user: ${error.message}`);
    created.push(data.user.id);
    const res = await login(email, password);
    const body = await res.text();
    if (role === "viewer") {
      assert(body.includes("does not have admin access"), `Non-admin sign-in returned: ${body.slice(0, 1200)}`);
      console.log("PASS: a valid non-admin account is denied even when user-editable metadata claims admin.");
    } else {
      assert(res.headers.get("x-action-redirect")?.startsWith("/admin;"), "Admin password login should redirect to the dashboard.");
      const setCookies = res.headers.getSetCookie();
      assert(setCookies.some(value => /HttpOnly/i.test(value)), "Session cookies must be HttpOnly.");
      const cookie = setCookies.map(value => value.split(";")[0]).join("; ");
      const dashboard = await fetch(`${base}/admin`, { headers: { Cookie: cookie }, redirect: "manual", signal: timeout() });
      assert.equal(dashboard.status, 200); assert((await dashboard.text()).includes("Service library"));
      console.log("PASS: admin email/password login creates HttpOnly cookies and opens the dashboard.");
    }
  }
} finally {
  for (const id of created) {
    const { error } = await service.auth.admin.deleteUser(id);
    if (error) throw new Error(`Temporary test user cleanup failed: ${error.message}`);
  }
  if (created.length) console.log("Temporary verification accounts removed.");
}
