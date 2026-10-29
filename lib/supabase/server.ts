import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export function getConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Supabase is not configured. Add the server environment variables.");
  return { url, key };
}

export async function createAuthClient() {
  const { url, key } = getConfig();
  const jar = await cookies();
  return createServerClient(url, key, {
    cookieOptions: { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" },
    cookies: {
      getAll: () => jar.getAll(),
      setAll(values) {
        try { values.forEach(({ name, value, options }) => jar.set(name, value, options)); }
        catch { /* Proxy refreshes cookies before Server Components render. */ }
      },
    },
  });
}

export function createServiceClient() {
  const { url } = getConfig();
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error("The server-side Supabase secret key is missing.");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store", signal: AbortSignal.timeout(10000) }) },
  });
}

export async function getAdmin() {
  const supabase = await createAuthClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  return !error && user?.app_metadata?.role === "admin" ? user : null;
}

export async function requireAdmin() {
  const user = await getAdmin();
  if (!user) throw new Error("Your session has expired or you do not have admin access. Please sign in again.");
  return user;
}
