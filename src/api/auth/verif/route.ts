import { proxyToBackend } from "@/lib/proxy";

export async function POST(req: Request) {
  return proxyToBackend(req, "/api/auth/verif");
}

// Kalau verif-nya GET token misalnya /api/auth/verif?token=xyz
// bisa tambahkan ini:
export async function GET(req: Request) {
  const { search } = new URL(req.url);
  return proxyToBackend(req, `/api/auth/verif${search}`);
}
