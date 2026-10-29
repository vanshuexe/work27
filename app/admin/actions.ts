"use server";

import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuthClient, createServiceClient, requireAdmin } from "@/lib/supabase/server";
import { CMS_BUCKET, saveContent } from "@/lib/admin/content";
import { validateContent } from "@/lib/admin/types";

export type AuthState = { error?: string; success?: string };

export async function signIn(_previous: AuthState, form: FormData): Promise<AuthState> {
  const email = String(form.get("email") || "").trim();
  const password = String(form.get("password") || "");
  if (!email || !password || email.length > 254 || password.length > 200) return { error: "Enter your email address and password." };
  try {
    const client = await createAuthClient();
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) return { error: "Unable to sign in. Check your email and password and try again." };
    if (data.user?.app_metadata?.role !== "admin") {
      await client.auth.signOut();
      return { error: "This account does not have admin access." };
    }
  } catch { return { error: "Sign-in is temporarily unavailable. Please try again." }; }
  redirect("/admin");
}

export async function signOut() {
  const client = await createAuthClient();
  await client.auth.signOut();
  redirect("/admin/login");
}

export async function changePassword(_previous: AuthState, form: FormData): Promise<AuthState> {
  try {
    await requireAdmin();
    const password = String(form.get("password") || "");
    if (password.length < 12 || password.length > 200) return { error: "Use a password with 12–200 characters." };
    if (password !== form.get("confirm")) return { error: "The passwords do not match." };
    const client = await createAuthClient();
    const { error } = await client.auth.updateUser({ password });
    if (error) return { error: "Could not update your password. Choose a different password or sign in again." };
    return { success: "Your password has been saved. You can now open the dashboard." };
  } catch { return { error: "Please sign in again before changing your password." }; }
}

export async function publishServices(value: unknown) {
  try {
    await requireAdmin();
    const content = validateContent(value);
    const saved = await saveContent(content);
    revalidatePath("/");
    revalidatePath("/admin");
    return { content: saved };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to save services." };
  }
}

export async function uploadServiceImage(form: FormData) {
  try {
    await requireAdmin();
    const file = form.get("image");
    if (!(file instanceof File) || file.size === 0 || file.size > 5 * 1024 * 1024) {
      return { error: "Choose a JPG, PNG, or WebP image smaller than 5 MB." };
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      return { error: "Only JPG, PNG, and WebP images are supported." };
    }
    const buffer = await sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 40_000_000 })
      .rotate().resize(1000, 750, { fit: "cover" }).webp({ quality: 86 }).toBuffer();
    const filename = `${randomUUID()}.webp`;
    const { error } = await createServiceClient().storage.from(CMS_BUCKET).upload(`media/${filename}`, buffer, {
      contentType: "image/webp", cacheControl: "31536000", upsert: false,
    });
    if (error) return { error: "Image upload failed. Please try again." };
    return { path: `/api/media/${filename}` };
  } catch (error) {
    console.error("Service image upload failed:", error instanceof Error ? error.message : "Unknown error");
    return { error: "Could not upload this image. Check the file and your login, then try again." };
  }
}
