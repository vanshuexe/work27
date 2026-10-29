import { createServiceClient } from "@/lib/supabase/server";
import { CMS_BUCKET } from "@/lib/admin/content";

export async function GET(_request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.webp$/.test(filename)) {
    return new Response("Not found", { status: 404 });
  }
  try {
    const { data, error } = await createServiceClient().storage.from(CMS_BUCKET).download(`media/${filename}`);
    if (error || !data) return new Response("Not found", { status: 404 });
    return new Response(data, { headers: {
      "Content-Type": "image/webp", "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "default-src 'none'; sandbox",
    } });
  } catch { return new Response("Image unavailable", { status: 503 }); }
}
