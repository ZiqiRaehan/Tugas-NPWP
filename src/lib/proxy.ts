export async function proxyToBackend(req: Request, backendPath: string) {
    if (!process.env.BACKEND_URL) {
      return new Response(JSON.stringify({ message: "BACKEND_URL is not set" }), { status: 500 });
    }
  
    // Bangun URL tujuan
    const url = new URL(process.env.BACKEND_URL);
    // Pastikan tidak double slash
    url.pathname = backendPath.startsWith("/") ? backendPath : `/${backendPath}`;
  
    // Ambil body (hanya untuk method yang boleh ada body)
    const method = req.method.toUpperCase();
    const hasBody = !["GET", "HEAD"].includes(method);
    const body = hasBody ? await req.text() : undefined;
  
    // Forward header penting (hindari hop-by-hop headers)
    const headers: Record<string, string> = {
      "Accept": "application/json",
    };
    const contentType = req.headers.get("content-type");
    if (contentType) headers["Content-Type"] = contentType;
  
    const auth = req.headers.get("authorization");
    if (auth) headers["Authorization"] = auth;
  
    const resp = await fetch(url.toString(), {
      method,
      headers,
      body,
      cache: "no-store",
    });
  
    // Pass-through status & body
    const text = await resp.text();
    const respContentType = resp.headers.get("content-type") ?? "application/json";
    return new Response(text, {
      status: resp.status,
      headers: { "content-type": respContentType },
    });
  }
  