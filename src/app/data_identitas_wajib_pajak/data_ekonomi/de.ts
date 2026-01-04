import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/config/api';

const BASE = '/ekonomi';
const PENGHASILAN = '/ekonomi/penghasilan';

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

function resolveTarget(req: Request) {
	const url = new URL(req.url);
	const q = url.searchParams.get('target');
	if (q === 'penghasilan' || url.pathname.endsWith('/penghasilan')) return PENGHASILAN;
	return q ? `/${q.replace(/^\//, '')}` : BASE;
}

export async function GET(req: Request) {
	try {
		const target = resolveTarget(req);
		return await proxy(req, target);
	} catch (err) {
		console.error('de GET proxy error', err);
		return NextResponse.json({ message: 'Proxy error' }, { status: 500 });
	}
}

export async function POST(req: Request) {
	try {
		const target = resolveTarget(req);
		return await proxy(req, target);
	} catch (err) {
		console.error('de POST proxy error', err);
		return NextResponse.json({ message: 'Proxy error' }, { status: 500 });
	}
}

export async function PUT(req: Request) {
	try {
		const target = resolveTarget(req);
		return await proxy(req, target);
	} catch (err) {
		console.error('de PUT proxy error', err);
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

