# NPWP Online Application

Aplikasi web untuk pendaftaran dan pengelolaan NPWP secara online.

## Fitur
- **Frontend**: Next.js 15, React 19, TailwindCSS, CSS Modules
- **Design**: Premium, Responsive, Clean Aesthetics
- **Backend (Internal)**: Next.js API Routes (Ready for Vercel/VPS)
- **Email Verification**: Menggunakan Nodemailer (Gmail SMTP)
- **State Management**: Session Storage & In-Memory OTP (VPS friendly)

## 🚀 Persiapan Hosting

Aplikasi ini sudah dikonfigurasi untuk siap di-hosting (Production Ready).

### 1. Konfigurasi API
Buka file `src/config/api.ts` dan pastikan konfigurasi mengarah ke URL hosting Anda.

```typescript
// src/config/api.ts
const HOSTED_URL = "https://server-anda.com/api/auth"; // Ganti dengan domain Anda
export const API_BASE_URL = HOSTED_URL;
```

### 2. Konfigurasi Email
Untuk fitur verifikasi email, Anda **WAJIB** mengatur Environment Variables pada server hosting Anda.

Buat file `.env.local` atau setting di panel Hosting (Vercel/cPanel):
```env
EMAIL_USER=email.anda@gmail.com
EMAIL_PASS=password-aplikasi-anda
```
> **Catatan**: Jika menggunakan Gmail, `EMAIL_PASS` adalah "App Password" yang digenerate dari Google Account Security (bukan password login biasa).

### 3. Deployment
**Vercel / Netlify:**
- Push kode ke GitHub/GitLab.
- Import project ke Vercel.
- Tambahkan Environment Variables (`EMAIL_USER`, `EMAIL_PASS`).
- Deploy!

**VPS / Node Server:**
- Upload file ke server.
- Run `npm install`
- Run `npm run build`
- Run `npm start`

## ⚠️ Database Note
Saat ini aplikasi menggunakan **In-Memory Storage** (`src/lib/otpStore.ts`).
- Jika di-hosting di **VPS** (Server yang nyala terus 24/7), OTP akan berjalan lancar.
- Jika di-hosting di **Serverless** (Vercel/Netlify), OTP mungkin hilang jika instance restart. Untuk production serverless, disarankan menghubungkan ke Database external (PostgreSQL/MySQL).

## Development Local

Untuk menjalankan di local:
1. `npm install`
2. `npm run dev`
3. Buk `http://localhost:3000`
