import { cookies } from "next/headers";
import { NextResponse } from "next/server";
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const access_token = (await cookies()).get("access_token")?.value;
  if (!access_token) {
    return NextResponse.json({ error: { message: "Unauthorized." } }, { status: 404 });
  }
  try {
    const backendResponse = await fetch(`https://localhost:5000/api/dashboard/business/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
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
