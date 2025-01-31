import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  const access_token = (await cookies()).get("access_token")?.value;

  if (!access_token) NextResponse.json({ error: { message: "Unauthorized." } }, { status: 404 });
  try {
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-store",
    });
    const data = await backendResponse.json();
    if (!backendResponse.ok) {
      return NextResponse.json({ error: data }, { status: backendResponse.status });
    }
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: { message: error?.message || "Internal Server Error" } },
      { status: 500 }
    );
  }
}
