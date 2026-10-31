# Website administration

Open `/admin` to manage the website's service cards, or `/admin/blogs` to manage the public blog articles. Anonymous visitors are redirected to `/admin/login`. Only Supabase users with server-controlled `app_metadata.role = "admin"` can open the dashboard, publish content, upload images, or change their password. Public registration is not offered by this application.

## Configure

Copy `.env.example` to `.env.local` and set `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SECRET_KEY`. Keep the secret key on the server; never prefix it with `NEXT_PUBLIC_`. The SSR auth client validates sessions with Supabase Auth, which manages its project's signing keys. `SUPABASE_JWKS_URL` is included for reference; the SDK handles verification rather than trusting decoded tokens.

Run `node scripts/setup-admin.mjs admin@example.com` on a trusted machine. This creates the private `kali-charan-cms` storage bucket, grants that specific account the admin role, and writes a one-time password setup link to the ignored `.admin-access.local` file. It reuses an existing account with the same email, preserves its other app metadata, and never resets its password without the user opening the setup link. No email is sent. Open the link and choose a password of at least 12 characters. Run the command again to generate a recovery link if access is lost. Set `ADMIN_SITE_URL` to your deployed HTTPS origin before generating a production link.

## Editing Services & Blogs

### Services & Dedicated Service Pages (`/admin`)
The dashboard supports full CRUD for service cards and their dedicated landing pages:
- **Adding new service pages**: Click **+ Add service**, provide a title, custom or auto-generated URL slug (e.g. `/services/love-problem-solution`), category, cover image (or upload your own up to 5 MB), card short summary, and full dedicated page content/remedies.
- **Editing service pages**: Click **Edit** on any service row to update title, slug, image, card description, or the full dedicated page content body.
- **Deleting service pages**: In the edit dialog, click **Delete page** and confirm removal to delete the service and its dedicated page from the draft.
- **Previewing pages**: Click **View page** on any service row to open the live dedicated page (`/services/[slug]`) in a new tab.
- **Hiding/Showing**: Toggle the visibility button on any service to publish or hide it without deleting.
- **Reordering**: Move services up or down within their category.
- **Publish changes**: Commits changes to Supabase (`services.json`), instantly making the dedicated pages, homepage cards, and sitemap entries live.

### Blogs (`/admin/blogs`)
The blog dashboard supports:
- **Adding new articles**: Click **+ Add blog**, provide a title, category, author, excerpt, cover image (or upload your own), and full article content. The URL slug is auto-generated or can be customized.
- **Editing articles**: Click **Edit** on any article card to modify title, content, reading time, date, or cover photo.
- **Hiding/Showing articles**: Toggle the visibility switch on any card to publish or temporarily unpublish an article without deleting it.
- **Deleting articles**: Click **Delete** and confirm in the modal to remove an article.
- **Publishing**: Click **Publish changes** to commit drafts to Supabase Storage (`blogs.json`). Published articles are immediately reflected on the homepage (`/#blogs`), the blog archive (`/blog`), and individual article pages (`/blog/[slug]`), and are indexed in `sitemap.xml`.

Content is stored as `services.json` and `blogs.json` in the private bucket `kali-charan-cms`; uploaded media is under `media/`. No SQL migration is required. Uploaded image files are exposed through a read-only media route (`/api/media/[filename]`); the CMS JSON is never publicly served. Do not add anonymous or authenticated write policies to this bucket. All writes use a server client after an admin authorization check. Uploads persist even if the draft is discarded, so media is never deleted automatically.

An update timestamp detects stale edits from another session before saving. For simultaneous editors, saves should be coordinated: object storage does not provide a database transaction around that comparison. The public homepage and blog routes fall back to default content if Supabase is unavailable; the admin displays a connection error instead of silently editing fallback data.

## Deployment

Add the server environment variables to the host, set `NEXT_PUBLIC_SITE_URL` to the real website URL, and restart the app. Use HTTPS in production for secure session cookies. `/admin` is excluded from indexing and admin responses use private, no-store caching. The service key must be replaced in the host environment whenever it is rotated in Supabase.

The production build does not require Supabase credentials: authentication and public CMS reads run at request time. The running server still requires `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SECRET_KEY` in its hosting environment. Local `.env.local` files are ignored by Git and are not automatically included in a remote deployment.

Auth follows the [Supabase server-side client documentation](https://supabase.com/docs/guides/auth/server-side/creating-a-client). Content and image persistence use [private Supabase Storage buckets](https://supabase.com/docs/guides/storage/buckets/fundamentals).
