import { NextResponse } from "next/server";
import { verifyOTP } from "@/lib/otpStore";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { message: "Email dan kode verifikasi diperlukan" },
        { status: 400 }
      );
    }

    const isValid = verifyOTP(email, code);

    if (!isValid) {
      return NextResponse.json(
        { message: "Kode verifikasi salah atau kadaluarsa" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Verifikasi berhasil" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verif Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
