import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { readPublicContent, readPublicBlogContent } from "@/lib/admin/content";
import { slugify, type ManagedService, type ManagedBlog } from "@/lib/admin/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/services`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
  ];

  try {
    const [{ services }, { blogs }] = await Promise.all([
      readPublicContent().catch((): { services: ManagedService[] } => ({ services: [] })),
      readPublicBlogContent().catch((): { blogs: ManagedBlog[] } => ({ blogs: [] })),
    ]);

    const serviceEntries: MetadataRoute.Sitemap = services
      .filter((s: ManagedService) => s.visible)
      .map((s: ManagedService) => ({
        url: `${SITE_URL}/services/${s.slug || slugify(s.title)}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.8,
      }));

    const blogEntries: MetadataRoute.Sitemap = blogs
      .filter((b: ManagedBlog) => b.visible)
      .map((b: ManagedBlog) => ({
        url: `${SITE_URL}/blog/${b.slug}`,
        lastModified: new Date(b.date),
        changeFrequency: "monthly",
        priority: 0.7,
      }));

    return [...baseEntries, ...serviceEntries, ...blogEntries];
  } catch {
    return baseEntries;
  }
}
