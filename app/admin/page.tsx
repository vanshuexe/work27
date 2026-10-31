import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, ExternalLink, KeyRound, LayoutGrid, LogOut, Sparkles } from "lucide-react";
import { getAdmin } from "@/lib/supabase/server";
import { readBlogContent, readContent } from "@/lib/admin/content";
import { signOut } from "./actions";
import ServiceManager from "@/components/admin/ServiceManager";

export default async function AdminPage() {
  const user = await getAdmin();
  if (!user) redirect("/admin/login");
  let content;
  let blogContent;
  try {
    [content, blogContent] = await Promise.all([
      readContent(),
      readBlogContent().catch(() => null),
    ]);
  } catch { /* Display a recoverable error instead of an editable fallback. */ }
  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <Link href="/admin" className="admin-brand"><Sparkles size={24} /><span>Kali Charan<small>WEBSITE MANAGER</small></span></Link>
      <div className="admin-sidebar-label">WORKSPACE</div>
      <Link href="/admin" className="admin-nav active" aria-current="page"><LayoutGrid size={19} /> Services <span>{content?.services.length ?? "—"}</span></Link>
      <Link href="/admin/blogs" className="admin-nav"><BookOpen size={19} /> Blogs <span>{blogContent?.blogs.length ?? "—"}</span></Link>
      <Link href="/admin/password" className="admin-nav"><KeyRound size={19} /> Account password</Link>
      <div className="admin-sidebar-bottom">
        <Link href="/" target="_blank" className="admin-nav"><ExternalLink size={18} /> View website</Link>
        <div className="admin-account"><span className="admin-avatar">{user.email?.[0]?.toUpperCase()}</span><div><strong>Administrator</strong><small>{user.email}</small></div></div>
        <form action={signOut}><button className="admin-nav admin-signout"><LogOut size={18} /> Sign out</button></form>
      </div>
    </aside>
    <main className="admin-main">
      <header className="admin-topbar"><span>Website <span className="admin-slash">/</span> <strong>Services</strong></span><Link href="/#services" target="_blank" className="admin-topbar-link">View live website <ExternalLink size={15} /></Link></header>
      {content ? <ServiceManager initialContent={content} /> : <div className="admin-content"><h1>Services could not be loaded</h1><p>Your saved content is safe. Check the Supabase connection and reload this page.</p><Link className="admin-button secondary" href="/admin">Try again</Link></div>}
    </main>
  </div>;
}
