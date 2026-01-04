// Identity helper untuk tabel `orang_terkait`
// Kolom berdasarkan screenshot: id, user_id, nama, hubungan, nik_relasi, keterangan, created_at, updated_at

export type OrangTerkait = {
  id?: number;
  user_id?: number;
  nama?: string;
  hubungan?: string;
  nik_relasi?: string;
  keterangan?: string;
  created_at?: string;
  updated_at?: string;
};

export function mapToOrangTerkait(input: Record<string, any>): OrangTerkait {
  return {
    id: input.id != null ? Number(input.id) : undefined,
    user_id: input.user_id != null ? Number(input.user_id) : undefined,
    nama: input.nama || input.name || '',
    hubungan: input.hubungan || input.relationship || '',
    nik_relasi: input.nik_relasi || input.nik_rel || input.nik || '',
    keterangan: input.keterangan || input.note || input.ket || '',
    created_at: input.created_at || input.createdAt || undefined,
    updated_at: input.updated_at || input.updatedAt || undefined,
  };
}

export function validateOrangTerkait(payload: Partial<OrangTerkait>) {
  const errors: Record<string, string> = {};

  if (!payload.nama || String(payload.nama).trim() === '') {
    errors.nama = 'Nama terkait wajib diisi';
  }

  if (!payload.hubungan || String(payload.hubungan).trim() === '') {
    errors.hubungan = 'Hubungan (mis. ibu, teman) wajib diisi';
  }

  if (payload.nik_relasi) {
    const nik = String(payload.nik_relasi).replace(/\s+/g, '');
    // cek minimal 8-16 digit (tidak memaksa format lengkap KTP di sini)
    if (!/^\d{8,20}$/.test(nik)) {
      errors.nik_relasi = 'NIK relasi tampak tidak valid (harus berupa angka, 8-20 digit)';
    }
  }

  return { ok: Object.keys(errors).length === 0, errors } as const;
}

// Contoh penggunaan:
// const obj = mapToOrangTerkait(req.body);
// const { ok, errors } = validateOrangTerkait(obj);
// if (!ok) return res.status(400).json({ errors });
