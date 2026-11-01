import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { getAdmin } from "@/lib/supabase/server";
import { readBlogContent, readContent } from "@/lib/admin/content";
import ServiceManager from "@/components/admin/ServiceManager";
import AdminSidebar from "@/components/admin/AdminSidebar";

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
    <AdminSidebar
      currentSection="services"
      userEmail={user.email || ""}
      servicesCount={content?.services.length}
      blogsCount={blogContent?.blogs.length}
    />
    <main className="admin-main">
      <header className="admin-topbar"><span>Website <span className="admin-slash">/</span> <strong>Services</strong></span><Link href="/#services" target="_blank" className="admin-topbar-link">View live website <ExternalLink size={15} /></Link></header>
      {content ? <ServiceManager initialContent={content} /> : <div className="admin-content"><h1>Services could not be loaded</h1><p>Your saved content is safe. Check the Supabase connection and reload this page.</p><Link className="admin-button secondary" href="/admin">Try again</Link></div>}
    </main>
  </div>;
}
