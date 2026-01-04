// Identity helper untuk tabel `dataekonomi`
// Fields: id, user_id, metode, mata_uang, periode_pembukuan, created_at, updated_at
import { Penghasilan, mapToPenghasilan, validatePenghasilan } from './sumberpenghasilan';

export type DataEkonomi = {
	id?: number;
	user_id?: number;
	metode?: string; // varchar(50)
	mata_uang?: string; // varchar(20)
	periode_pembukuan?: string; // varchar(50)
	penghasilan?: Penghasilan[];
	created_at?: string;
	updated_at?: string;
};

export function mapToDataEkonomi(input: Record<string, any>): DataEkonomi {
	return {
		id: input.id != null ? Number(input.id) : undefined,
		user_id: input.user_id != null ? Number(input.user_id) : undefined,
		metode: input.metode || input.method || input.metod || '',
		mata_uang: input.mata_uang || input.currency || input.matauang || '',
		periode_pembukuan: input.periode_pembukuan || input.periode || input.period || '',
	penghasilan: Array.isArray(input.penghasilan) ? input.penghasilan.map(mapToPenghasilan) : [],
		created_at: input.created_at || input.createdAt || undefined,
		updated_at: input.updated_at || input.updatedAt || undefined,
	};
}

export function validateDataEkonomi(payload: Partial<DataEkonomi>) {
	const errors: Record<string, string> = {};

	if (payload.metode != null && String(payload.metode).length > 50) {
		errors.metode = 'Panjang metode maksimal 50 karakter';
	}

	if (payload.mata_uang != null) {
		const mu = String(payload.mata_uang).trim();
		if (mu === '') {
			errors.mata_uang = 'Mata uang tidak boleh kosong jika disertakan';
		} else if (!/^[A-Za-z\s]{1,20}$/.test(mu) && !/^[A-Za-z]{3}$/.test(mu)) {
			errors.mata_uang = 'Format mata uang tidak valid (mis. IDR atau Rupiah)';
		}
		if (mu.length > 20) errors.mata_uang = 'Panjang mata uang maksimal 20 karakter';
	}

	if (payload.periode_pembukuan != null) {
		const p = String(payload.periode_pembukuan).trim();
		if (p === '') {
			errors.periode_pembukuan = 'Periode pembukuan tidak boleh kosong jika disertakan';
		} else if (p.length > 50) {
			errors.periode_pembukuan = 'Panjang periode pembukuan maksimal 50 karakter';
		}

		if (payload.penghasilan && Array.isArray(payload.penghasilan)) {
			payload.penghasilan.forEach((p, i) => {
				const res = validatePenghasilan(p);
				if (!res.ok) {
					errors[`penghasilan[${i}]`] = JSON.stringify(res.errors);
				}
			});
		}
	}

	return { ok: Object.keys(errors).length === 0, errors } as const;
}

// Contoh penggunaan:
// const body = await req.json();
// const data = mapToDataEkonomi(body);
// const { ok, errors } = validateDataEkonomi(data);
// if (!ok) return new Response(JSON.stringify({ errors }), { status: 400 });

