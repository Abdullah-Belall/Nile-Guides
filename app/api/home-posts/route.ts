import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = url.searchParams;

  try {
    const backendURL = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/home`);
    backendURL.search = params.toString();
    const backendResponse = await fetch(backendURL.toString(), {
      method: "GET",
    });
    const data = await backendResponse.json();
    if (!backendResponse.ok) {
      return NextResponse.json({ error: data }, { status: backendResponse.status });
    }
    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error: unknown) {
    let errorMessage = "Internal Server Error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: { message: errorMessage } }, { status: 500 });
  }
}
