import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "node:fs";

try { process.loadEnvFile(".env.local"); } catch { /* Environment variables may already be configured by the host. */ }
const email = process.argv[2]?.trim().toLowerCase();
if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("Usage: node scripts/setup-admin.mjs admin@example.com"); process.exit(1);
}
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
  console.error("Configure SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local first."); process.exit(1);
}
const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const origin = (process.env.ADMIN_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

async function main() {
  const { data: bucket, error: bucketError } = await client.storage.getBucket("kali-charan-cms");
  if (bucketError) {
    const { error } = await client.storage.createBucket("kali-charan-cms", {
      public: false, fileSizeLimit: 5 * 1024 * 1024, allowedMimeTypes: ["application/json", "image/webp"],
    });
    if (error) throw new Error(`Could not create CMS storage: ${error.message}`);
  } else if (bucket.public) {
    throw new Error("The kali-charan-cms bucket must be private. Make it private before continuing.");
  }
  let user;
  for (let page = 1; ; page++) {
    const { data, error } = await client.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw new Error(`Could not inspect admin accounts: ${error.message}`);
    user = data.users.find(u => u.email?.toLowerCase() === email);
    if (user || data.users.length < 100) break;
  }
  const type = user ? "recovery" : "invite";
  const { data: link, error: linkError } = await client.auth.admin.generateLink({ type, email });
  if (linkError) throw new Error(`Could not create an account setup link: ${linkError.message}`);
  const { error: roleError } = await client.auth.admin.updateUserById(link.user.id, {
    app_metadata: { ...link.user.app_metadata, role: "admin" },
  });
  if (roleError) throw new Error(`Could not grant admin access: ${roleError.message}`);
  const setupUrl = `${origin}/admin/activate?token_hash=${encodeURIComponent(link.properties.hashed_token)}&type=${type}`;
  writeFileSync(".admin-access.local", `Admin email: ${email}\n\nPrivate one-time password setup link:\n${setupUrl}\n\nThis link expires according to the Supabase email OTP expiry setting.\nGenerate a new link by rerunning this script. It does not send email.\n`);
  console.log(`Admin access configured for ${email}.`);
  console.log("Private CMS storage is ready. The password setup link is saved in .admin-access.local.");
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
