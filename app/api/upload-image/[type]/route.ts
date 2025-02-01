import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ type: "save" | "temporary-save" }> }
) {
  const access_token = (await cookies()).get("access_token")?.value;
  if (!access_token) NextResponse.json({ error: { message: "Unauthorized." } }, { status: 404 });
  const formData = await req.formData();
  const file = formData.get("image");
  if (!file) {
    return NextResponse.json({ error: { message: "No file uploaded." } }, { status: 400 });
  }
  const { type } = await context.params;
  try {
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pushImage/${type}`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
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
