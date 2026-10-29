import "server-only";
import { connection } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { DEFAULT_CONTENT, validateContent, type ServiceContent } from "./types";

export const CMS_BUCKET = "kali-charan-cms";
export const CMS_FILE = "services.json";

export async function readContent(): Promise<ServiceContent> {
  const { data, error } = await createServiceClient().storage.from(CMS_BUCKET).download(CMS_FILE);
  if (error) {
    if (String(error.statusCode) === "404" || error.message === "Object not found" || error.message === "Bucket not found") {
      return structuredClone(DEFAULT_CONTENT);
    }
    throw new Error("Could not load saved services. Please try again.");
  }
  return validateContent(JSON.parse(await data.text()));
}

export async function readPublicContent(): Promise<ServiceContent> {
  // Never bake fallback content into a build that has no runtime credentials.
  // Keep this outside the catch so Next.js can stop prerendering here.
  await connection();
  try { return await readContent(); }
  catch { return structuredClone(DEFAULT_CONTENT); }
}

export async function saveContent(content: ServiceContent) {
  const current = await readContent();
  if (current.updatedAt !== content.updatedAt) {
    throw new Error("Services have changed in another session. Reload this page before saving your changes.");
  }
  const next = { ...content, updatedAt: new Date().toISOString() };
  const { error } = await createServiceClient().storage.from(CMS_BUCKET).upload(CMS_FILE, JSON.stringify(next), {
    contentType: "application/json", upsert: true, cacheControl: "0",
  });
  if (error) throw new Error("Could not save services to Supabase. Your changes are still in the editor; please retry.");
  return next;
}
