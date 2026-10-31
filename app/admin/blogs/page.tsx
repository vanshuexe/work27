import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, ExternalLink, KeyRound, LayoutGrid, LogOut, Sparkles } from "lucide-react";
import { getAdmin } from "@/lib/supabase/server";
import { readBlogContent, readContent } from "@/lib/admin/content";
import { signOut } from "../actions";
import BlogManager from "@/components/admin/BlogManager";

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
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-brand">
          <Sparkles size={24} />
          <span>
            Kali Charan<small>WEBSITE MANAGER</small>
          </span>
        </Link>
        <div className="admin-sidebar-label">WORKSPACE</div>
        <Link href="/admin" className="admin-nav">
          <LayoutGrid size={19} /> Services <span>{serviceContent?.services.length ?? "—"}</span>
        </Link>
        <Link href="/admin/blogs" className="admin-nav active" aria-current="page">
          <BookOpen size={19} /> Blogs <span>{blogContent?.blogs.length ?? "—"}</span>
        </Link>
        <Link href="/admin/password" className="admin-nav">
          <KeyRound size={19} /> Account password
        </Link>
        <div className="admin-sidebar-bottom">
          <Link href="/#blogs" target="_blank" className="admin-nav">
            <ExternalLink size={18} /> View website
          </Link>
          <div className="admin-account">
            <span className="admin-avatar">{user.email?.[0]?.toUpperCase()}</span>
            <div>
              <strong>Administrator</strong>
              <small>{user.email}</small>
            </div>
          </div>
          <form action={signOut}>
            <button className="admin-nav admin-signout">
              <LogOut size={18} /> Sign out
            </button>
          </form>
        </div>
      </aside>
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

