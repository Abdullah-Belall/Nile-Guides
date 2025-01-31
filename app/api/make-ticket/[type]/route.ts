import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { type: "clients" | "workers" } }) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  const access_token = (await cookies()).get("access_token")?.value;

  const unWrapParams = await params;
  if (!access_token) NextResponse.json({ error: { message: "Unauthorized." } }, { status: 404 });
  try {
    const body = await req.json();
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${unWrapParams.type}/ticket`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
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
