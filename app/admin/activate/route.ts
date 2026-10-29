import { NextResponse } from "next/server";
import { createAuthClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  if (token_hash && (type === "invite" || type === "recovery")) {
    const client = await createAuthClient();
    const { data, error } = await client.auth.verifyOtp({ token_hash, type });
    if (!error && data.user?.app_metadata?.role === "admin") {
      return NextResponse.redirect(new URL("/admin/password", url.origin));
    }
    await client.auth.signOut();
  }
  return NextResponse.redirect(new URL("/admin/login?expired=1", url.origin));
}
