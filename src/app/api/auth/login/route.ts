import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // MOCK: Validasi login sederhana
    // Di aplikasi nyata, cek DB dan validasi hash password
    if (password === "wrong") { // Contoh kondisi error
      return NextResponse.json(
        { message: "Email atau password salah" },
        { status: 401 }
      );
    }

    // Mock User Data
    const user = {
      name: "Pengguna Lokal",
      email: email || "user@example.com",
      role: "user",
    };

    // Mock Token (Di production gunakan JWT murni)
    const token = "mock-jwt-token-" + Date.now();

    return NextResponse.json(
      {
        message: "Login berhasil",
        token: token,
        ...user
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
