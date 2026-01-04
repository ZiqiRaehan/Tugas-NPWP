import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config/api';

const TARGET = '/biodata/me';

async function proxy(req: Request, target: string) {
    const method = req.method.toUpperCase();
    // Ensure we pass specific headers if needed, or just let valid ones through
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };

    // If there's an auth token in the incoming request header, pass it
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
        headers['Authorization'] = authHeader;
    }

    const init: RequestInit = { method, headers };

    if (method !== 'GET' && method !== 'HEAD') {
        try {
            const body = await req.text();
            init.body = body;
        } catch (e) {
            // Body might be empty
        }
    }

    try {
        const res = await fetch(`${API_BASE_URL}${target}`, init);
        const text = await res.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = { message: text };
        }

        return NextResponse.json(data, { status: res.status });
    } catch (err) {
        console.error('Proxy error:', err);
        return NextResponse.json({ message: 'Internal Proxy Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const target = searchParams.get('target') || TARGET;
    return proxy(req, target);
}

export async function POST(req: Request) {
    const { searchParams } = new URL(req.url);
    const target = searchParams.get('target') || TARGET;
    return proxy(req, target);
}

export async function PUT(req: Request) {
    const { searchParams } = new URL(req.url);
    const target = searchParams.get('target') || TARGET;
    return proxy(req, target);
}
