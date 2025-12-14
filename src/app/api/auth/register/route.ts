import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/mail";
import { saveOTP } from "@/lib/otpStore";

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

    // Generate 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Simpan OTP ke memory store (simulasi database)
    saveOTP(email, code);

    // Kirim Email Verifikasi
    // Pastikan environment variables EMAIL_USER dan EMAIL_PASS sudah diset di .env.local
    const sent = await sendVerificationEmail(email, code);

    if (!sent) {
      console.error(`Gagal mengirim email ke ${email}. Code: ${code}`);
      // Kita kembalikan error agar user tahu konfigurasinya belum benar
      // Jika ingin bypass, bisa comment bagian ini
      return NextResponse.json(
        { message: "Gagal mengirim email verifikasi. Cek konfigurasi server." },
        { status: 500 }
      );
    }

    // MOCK: Simpan user ke memory/database (disini pass saja)
    // Di aplikasi nyata, Anda akan menyimpan hash password ke DB

    return NextResponse.json(
      { message: "Registrasi berhasil. Silakan cek email untuk verifikasi." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
