// Konfigurasi URL API
// Masukkan URL hostingan backend Anda di variable HOSTED_URL
// Saat ini diset untuk siap di-hosting (Production Mode)

const DEVELOPMENT_URL = "/api"; // URL untuk development local (Next.js API Routes)
const HOSTED_URL = "https://api2.mizstudio.my.id/api"; // SLOT: Isi dengan URL server hosting Anda yang baru

// Secara default menggunakan HOSTED_URL agar siap untuk di-deploy
// Jika ingin testing local tanpa internet/backend hosting, ubah ke DEVELOPMENT_URL
export const API_BASE_URL = HOSTED_URL;

