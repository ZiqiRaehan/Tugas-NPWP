import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan password harus diisi" },
        { status: 400 }
      );
    }

    // MOCK: Simpan user ke memory/database (disini pass saja)
    // Di aplikasi nyata, Anda akan menyimpan hash password ke DB

    return NextResponse.json(
      { message: "Registrasi berhasil. Silakan cek email untuk verifikasi." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
