import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/config/api";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Login Proxy Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat menghubungkan ke server" },
      { status: 500 }
    );
  }
}
