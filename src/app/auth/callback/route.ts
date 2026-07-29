import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/auth/error", request.url));
  }

  if (code) {
    try {
      // Dynamically import Supabase only when needed
      const { supabase } = await import("@/lib/supabase");
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (!exchangeError) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (err) {
      console.error("Auth callback error:", err);
    }
  }

  return NextResponse.redirect(new URL("/auth/error", request.url));
}
