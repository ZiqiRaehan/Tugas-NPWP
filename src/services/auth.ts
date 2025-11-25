type Json = Record<string, any>;

async function call<T = Json>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });

  let data: any = null;
  try { data = await res.json(); } catch { /* ignore */ }

  if (!res.ok) {
    const message =
      data?.message ||
      data?.error ||
      (typeof data === "string" ? data : "Terjadi kesalahan.");
    throw new Error(message);
  }
  return data as T;
}

export async function register(payload: {
  name: string;
  nik: string;
  email: string;
  password: string;
  kategori?: string; // kalau backend perlu
}) {
  // → proxy ke BACKEND_URL/api/auth/register melalui route handler lokal
  return call("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function login(payload: { email: string; password: string }) {
  return call("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function verify(payload: { email: string; code: string }) {
  // kalau backend minta GET ?code=xxx, ubah di sini
  return call("/api/auth/verif", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
