// Identity helper untuk tabel `alamat`
// Field berdasarkan contoh payload Postman

export type DataGeometris = {
  lat: number;
  lng: number;
};

export type Alamat = {
  id?: number;
  user_id?: number;
  jenis_alamat?: string; // mis. 'Rukah'
  detai_alamat?: string; // catatan: penulisan di Postman 'detai_alamat'
  rt?: string;
  rw?: string;
  provinsi?: string;
  kota?: string;
  kecamatan?: string;
  desa?: string;
  kode_wilayah?: string;
  kode_pos?: string;
  data_geometris?: DataGeometris | null;
  seksi_pengawasan?: string;
  created_at?: string;
  updated_at?: string;
};

export function mapToAlamat(input: Record<string, any>): Alamat {
  const geom = input.data_geometris || input.dataGeometris || input.coordinates || null;
  const data_geometris = geom && typeof geom === 'object' && (geom.lat != null || geom.lng != null)
    ? { lat: Number(geom.lat), lng: Number(geom.lng) }
    : null;

  return {
    id: input.id != null ? Number(input.id) : undefined,
    user_id: input.user_id != null ? Number(input.user_id) : undefined,
    jenis_alamat: input.jenis_alamat || input.jenis || '',
    detai_alamat: input.detai_alamat || input.detail_alamat || input.alamat || '',
    rt: input.rt != null ? String(input.rt) : undefined,
    rw: input.rw != null ? String(input.rw) : undefined,
    provinsi: input.provinsi || input.province || '',
    kota: input.kota || input.kabupaten || input.city || '',
    kecamatan: input.kecamatan || input.subdistrict || '',
    desa: input.desa || input.village || input.desa_kelurahan || '',
    kode_wilayah: input.kode_wilayah || input.kode_wilayah || '',
    kode_pos: input.kode_pos || input.kodepos || input.postal_code || '',
    data_geometris,
    seksi_pengawasan: input.seksi_pengawasan || input.seksi || '',
    created_at: input.created_at || input.createdAt || undefined,
    updated_at: input.updated_at || input.updatedAt || undefined,
  };
}

export function validateAlamat(payload: Partial<Alamat>) {
  const errors: Record<string, string> = {};

  if (!payload.jenis_alamat || String(payload.jenis_alamat).trim() === '') {
    errors.jenis_alamat = 'Jenis alamat wajib diisi';
  }

  if (!payload.detai_alamat || String(payload.detai_alamat).trim() === '') {
    errors.detai_alamat = 'Detail alamat wajib diisi';
  }

  if (payload.kode_pos) {
    const kp = String(payload.kode_pos).trim();
    if (!/^\d{4,6}$/.test(kp)) {
      errors.kode_pos = 'Kode pos tidak valid (harus 4-6 digit)';
    }
  }

  if (payload.data_geometris) {
    const g = payload.data_geometris as DataGeometris;
    if (Number.isNaN(Number(g.lat)) || Number.isNaN(Number(g.lng))) {
      errors.data_geometris = 'Koordinat tidak valid';
    }
  }

  return { ok: Object.keys(errors).length === 0, errors } as const;
}

// Contoh penggunaan:
// const body = req.body;
// const alamat = mapToAlamat(body);
// const { ok, errors } = validateAlamat(alamat);
// if (!ok) return res.status(400).json({ errors });
