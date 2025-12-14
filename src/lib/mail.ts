import nodemailer from "nodemailer";

// Konfigurasi transporter email
// Gunakan environment variables untuk keamanan
const transporter = nodemailer.createTransport({
    service: "gmail", // Bisa diganti dengan host SMTP lain
    auth: {
        user: process.env.EMAIL_USER, // Email pengirim
        pass: process.env.EMAIL_PASS, // App Password (bukan password login biasa)
    },
});

export const sendVerificationEmail = async (to: string, code: string) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: "Kode Verifikasi NPWP",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #1B4B38; text-align: center;">Verifikasi Email Anda</h2>
        <p style="color: #666; font-size: 16px;">Terima kasih telah mendaftar di layanan NPWP Online. Silakan gunakan kode verifikasi di bawah ini untuk mengaktifkan akun Anda:</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
          <h1 style="color: #1B4B38; letter-spacing: 5px; margin: 0; font-size: 32px;">${code}</h1>
        </div>
        
        <p style="color: #666; font-size: 14px;">Kode ini hanya berlaku selama 15 menit.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px; text-align: center;">Jika Anda tidak merasa mendaftar, silakan abaikan email ini.</p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};
