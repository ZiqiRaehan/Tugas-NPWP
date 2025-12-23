import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { nik: string } }) {
  try {
    const { nik } = params;
    const res = await fetch(`https://ktp-web.chasouluix.biz.id/api/ktp/${encodeURIComponent(nik)}`);
    const json = await res.json().catch(() => null);
    return NextResponse.json(json, { status: res.status });
  } catch (err) {
    console.error("/api/ktp/[nik] proxy error", err);
    return NextResponse.json({ success: false, message: "Proxy error" }, { status: 500 });
  }
}
