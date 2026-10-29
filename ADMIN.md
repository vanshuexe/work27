# Website administration

Open `/admin` to manage the website's service cards. Anonymous visitors are redirected to `/admin/login`. Only Supabase users with server-controlled `app_metadata.role = "admin"` can open the dashboard, publish content, upload images, or change their password. Public registration is not offered by this application.

## Configure

Copy `.env.example` to `.env.local` and set `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SECRET_KEY`. Keep the secret key on the server; never prefix it with `NEXT_PUBLIC_`. The SSR auth client validates sessions with Supabase Auth, which manages its project's signing keys. `SUPABASE_JWKS_URL` is included for reference; the SDK handles verification rather than trusting decoded tokens.

Run `node scripts/setup-admin.mjs admin@example.com` on a trusted machine. This creates the private `kali-charan-cms` storage bucket, grants that specific account the admin role, and writes a one-time password setup link to the ignored `.admin-access.local` file. It reuses an existing account with the same email, preserves its other app metadata, and never resets its password without the user opening the setup link. No email is sent. Open the link and choose a password of at least 12 characters. Run the command again to generate a recovery link if access is lost. Set `ADMIN_SITE_URL` to your deployed HTTPS origin before generating a production link.

## Editing

The dashboard supports adding, editing, removing, hiding, and reordering cards within each category. Image uploads accept JPG, PNG, and WebP files up to 5 MB and are decoded and converted server-side to 1000×750 WebP. Applying an edit updates the draft. **Publish changes** saves it to Supabase and updates both the homepage cards and service structured data. Changes are not published until this button is used.

Content is stored as `services.json` in the private bucket; uploaded media is under `media/`. No SQL migration is required. Uploaded image files are exposed through a read-only media route; the CMS JSON is never publicly served. Do not add anonymous or authenticated write policies to this bucket. All writes use a server client after an admin authorization check. Uploads persist even if the draft is discarded, so media is never deleted automatically.

An update timestamp detects stale edits from another session before saving. For simultaneous editors, saves should be coordinated: object storage does not provide a database transaction around that comparison. The public homepage falls back to the original service content if Supabase is unavailable; the admin displays a connection error instead of silently editing fallback data.

## Deployment

Add the server environment variables to the host, set `NEXT_PUBLIC_SITE_URL` to the real website URL, and restart the app. Use HTTPS in production for secure session cookies. `/admin` is excluded from indexing and admin responses use private, no-store caching. The service key must be replaced in the host environment whenever it is rotated in Supabase.

Auth follows the [Supabase server-side client documentation](https://supabase.com/docs/guides/auth/server-side/creating-a-client). Content and image persistence use [private Supabase Storage buckets](https://supabase.com/docs/guides/storage/buckets/fundamentals).
