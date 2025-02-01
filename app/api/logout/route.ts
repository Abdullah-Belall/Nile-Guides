import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const access_token = (await cookies()).get("access_token")?.value;
  if (!access_token)
    return NextResponse.json({ error: { message: "Unauthorized." } }, { status: 401 });
  try {
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const data = await backendResponse.json();
    const backendCookies = backendResponse.headers.get("set-cookie");
    const response = NextResponse.json(data, { status: backendResponse.status });
    if (!backendResponse.ok)
      return NextResponse.json({ error: data }, { status: backendResponse.status });
    if (backendCookies) response.headers.append("Set-Cookie", backendCookies);
    return response;
  } catch (error: unknown) {
    let errorMessage = "Internal Server Error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: { message: errorMessage } }, { status: 500 });
  }
}
