import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, code } = body;

    if (code !== "123456") {
      // Opsional: Untuk testing mudah, kita anggap semua kode sukses KECUALI '000000'
      if (code === "000000") {
        return NextResponse.json(
          { message: "Kode verifikasi salah" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { message: "Verifikasi berhasil" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
