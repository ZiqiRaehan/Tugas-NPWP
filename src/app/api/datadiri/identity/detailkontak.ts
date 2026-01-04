// Tipe, mapper, dan validator untuk tabel `kontak` (biodata kontak)
// Field berdasarkan screenshot: id, user_id, email, no_hp, status_verifikasi, waktu_kirim, waktu_verif, created_at, updated_at

export type Kontak = {
  id?: number;
  user_id?: number;
  email?: string;
  no_hp?: string;
  status_verifikasi?: 'pending' | 'verified' | 'rejected' | string;
  waktu_kirim?: string | null; // ISO timestamp
  waktu_verif?: string | null; // ISO timestamp
  created_at?: string;
  updated_at?: string;
};

export function validateKontak(payload: Partial<Kontak>) {
  const errors: Record<string, string> = {};

  // email basic check
  if (payload.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) errors.email = 'Format email tidak valid';
  }

  // no_hp presence and basic digits check
  if (!payload.no_hp || String(payload.no_hp).trim() === '') {
    errors.no_hp = 'Nomor handphone wajib diisi';
  } else {
    const hp = String(payload.no_hp).replace(/[^0-9+]/g, '');
    if (hp.length < 8) errors.no_hp = 'Nomor handphone terlalu pendek';
  }

  // status_verifikasi allowed values (optional)
  if (payload.status_verifikasi) {
    const allowed = ['pending', 'verified', 'rejected'];
    if (!allowed.includes(payload.status_verifikasi)) {
      // tidak fatal — hanya peringatan
      errors.status_verifikasi = `Status tidak dikenal (boleh: ${allowed.join(', ')})`;
    }
  }

  return { ok: Object.keys(errors).length === 0, errors } as const;
}

export function mapToKontak(input: Record<string, any>): Kontak {
  return {
    id: input.id != null ? Number(input.id) : undefined,
    user_id: input.user_id != null ? Number(input.user_id) : undefined,
    email: input.email || input.EMail || input.email_address || '',
    no_hp: input.no_hp || input.phone || input.nohp || input.tel || '',
    status_verifikasi: input.status_verifikasi || input.status || 'pending',
    waktu_kirim: input.waktu_kirim || input.sent_at || null,
    waktu_verif: input.waktu_verif || input.verified_at || null,
    created_at: input.created_at || input.createdAt || undefined,
    updated_at: input.updated_at || input.updatedAt || undefined,
  };
}

// Contoh penggunaan:
// const payload = req.body;
// const kontak = mapToKontak(payload);
// const { ok, errors } = validateKontak(kontak);
// if (!ok) return res.status(400).json({ errors });
