import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config/api';

const TARGET = '/orang-terkait';

async function proxy(req: Request, target: string) {
	const method = req.method.toUpperCase();
	const headers: Record<string, string> = { 'Content-Type': 'application/json' };
	const init: RequestInit = { method, headers };
	if (method !== 'GET' && method !== 'OPTIONS') init.body = await req.text();
	const res = await fetch(`${API_BASE_URL}${target}`, init);
	const text = await res.text();
	let data;
	try { data = JSON.parse(text); } catch { data = { message: text }; }
	return NextResponse.json(data, { status: res.status });
}

export async function GET(req: Request) {
	try {
		const url = new URL(req.url);
		const target = url.searchParams.get('target') || TARGET;
		return await proxy(req, target);
	} catch (err) {
		console.error('ot GET proxy error', err);
		return NextResponse.json({ message: 'Proxy error' }, { status: 500 });
	}
}

export async function POST(req: Request) {
	try {
		const url = new URL(req.url);
		const target = url.searchParams.get('target') || TARGET;
		return await proxy(req, target);
	} catch (err) {
		console.error('ot POST proxy error', err);
		return NextResponse.json({ message: 'Proxy error' }, { status: 500 });
	}
}

export async function PUT(req: Request) {
	try {
		const url = new URL(req.url);
		const target = url.searchParams.get('target') || TARGET;
		return await proxy(req, target);
	} catch (err) {
		console.error('ot PUT proxy error', err);
		return NextResponse.json({ message: 'Proxy error' }, { status: 500 });
	}
}

export function OPTIONS() {
	return new NextResponse(null, {
		status: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization',
		},
	});
}

