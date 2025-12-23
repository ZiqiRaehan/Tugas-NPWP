import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const nik = searchParams.get("nik");

    if (!nik) {
        return NextResponse.json({ message: "NIK is required" }, { status: 400 });
    }

    try {
        // Try path param first: /api/ktp/{nik}
        let targetUrl = `https://ktp-web.chasouluix.biz.id/api/ktp/${nik}`;
        let res = await fetch(targetUrl);

        // If 404, try query param: /api/ktp?nik={nik}
        if (res.status === 404) {
            targetUrl = `https://ktp-web.chasouluix.biz.id/api/ktp?nik=${encodeURIComponent(nik)}`;
            res = await fetch(targetUrl);
        }

        // Pass detailed error if still failing
        if (res.status === 404) {
            return NextResponse.json({ message: "NIK tidak ditemukan di database KTP." }, { status: 404 });
        }

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error("Proxy Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
