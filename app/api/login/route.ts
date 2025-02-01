import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
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
