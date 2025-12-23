// Helper untuk tabel `pernyataan`
export type Pernyataan = {
	id?: number;
	user_id?: number;
	disetujui?: boolean | number; // tinyint(1) stored as 0/1
	tanggal_submit?: string; // datetime
};

export function mapToPernyataan(input: Record<string, any>): Pernyataan {
	return {
		id: input.id != null ? Number(input.id) : undefined,
		user_id: input.user_id != null ? Number(input.user_id) : undefined,
		disetujui:
			input.disetujui != null
				? (typeof input.disetujui === 'string' ? (input.disetujui === '1' || input.disetujui === 'true') : Boolean(Number(input.disetujui)))
				: undefined,
		tanggal_submit: input.tanggal_submit || input.tanggalSubmit || input.tanggal || undefined,
	};
}

export function validatePernyataan(payload: Partial<Pernyataan>) {
	const errors: Record<string, string> = {};

	if (payload.user_id == null) {
		errors.user_id = 'user_id wajib diisi';
	}

	if (payload.disetujui != null) {
		const v = payload.disetujui;
		const s = String(v);
		const ok = v === true || v === false || s === '0' || s === '1' || s === 'true' || s === 'false';
		if (!ok) errors.disetujui = 'Nilai disetujui harus boolean atau 0/1';
	}

	if (payload.tanggal_submit != null) {
		const d = new Date(String(payload.tanggal_submit));
		if (Number.isNaN(d.getTime())) {
			errors.tanggal_submit = 'Format tanggal_submit tidak valid';
		}
	}

	return { ok: Object.keys(errors).length === 0, errors } as const;
}

// Contoh penggunaan:
// const body = await req.json();
// const p = mapToPernyataan(body);
// const { ok, errors } = validatePernyataan(p);
// if (!ok) return new Response(JSON.stringify({ errors }), { status: 400 });

