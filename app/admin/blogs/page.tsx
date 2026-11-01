import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { getAdmin } from "@/lib/supabase/server";
import { readBlogContent, readContent } from "@/lib/admin/content";
import BlogManager from "@/components/admin/BlogManager";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminBlogsPage() {
  const user = await getAdmin();
  if (!user) redirect("/admin/login");

  let blogContent;
  let serviceContent;
  try {
    [blogContent, serviceContent] = await Promise.all([
      readBlogContent(),
      readContent().catch(() => null),
    ]);
  } catch {
    /* Display a recoverable error */
  }

  return (
    <div className="admin-shell">
      <AdminSidebar
        currentSection="blogs"
        userEmail={user.email || ""}
        servicesCount={serviceContent?.services.length}
        blogsCount={blogContent?.blogs.length}
      />
      <main className="admin-main">
        <header className="admin-topbar">
          <span>
            Website <span className="admin-slash">/</span> <strong>Blogs</strong>
          </span>
          <Link href="/#blogs" target="_blank" className="admin-topbar-link">
            View live website <ExternalLink size={15} />
          </Link>
        </header>
        {blogContent ? (
          <BlogManager initialContent={blogContent} />
        ) : (
          <div className="admin-content">
            <h1>Blogs could not be loaded</h1>
            <p>Your saved content is safe. Check the Supabase connection and reload this page.</p>
            <Link className="admin-button secondary" href="/admin/blogs">
              Try again
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

