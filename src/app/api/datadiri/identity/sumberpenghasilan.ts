// Types and helpers for `penghasilan` (sumber penghasilan)
export type PenghasilanJenis = 'Pekerjaan' | 'Pekerjaan Bebas' | 'Kegiatan Usaha';

export type PenghasilanBase = {
  id?: number;
  ekonomi_id?: number;
  jenis_penghasilan?: PenghasilanJenis | string;
  kode_klu?: string;
  created_at?: string;
  updated_at?: string;
};

export type PekerjaanDetail = {
  id?: number;
  penghasilan_id?: number;
  tempat_kerja?: string;
  penghasilan?: string; // decimal stored as string from API
  created_at?: string;
};

export type KegiatanUsahaDetail = {
  id?: number;
  penghasilan_id?: number;
  merek_dagang?: string;
  omzet_tahunan?: string;
  izin_usaha?: string;
  tanggal_izin?: string | null;
  jumlah_karyawan?: string;
  created_at?: string;
};

export type PenghasilanDetail = PekerjaanDetail | KegiatanUsahaDetail | Record<string, any>;

export type Penghasilan = PenghasilanBase & { detail?: PenghasilanDetail };

export function mapToPenghasilan(input: Record<string, any>): Penghasilan {
  const base: PenghasilanBase = {
    id: input.id != null ? Number(input.id) : undefined,
    ekonomi_id: input.ekonomi_id != null ? Number(input.ekonomi_id) : undefined,
    jenis_penghasilan: input.jenis_penghasilan || input.jenis || '',
    kode_klu: input.kode_klu || input.kode_klu || input.kodeKlu || '',
    created_at: input.created_at || input.createdAt || undefined,
    updated_at: input.updated_at || input.updatedAt || undefined,
  };

  const jenis = String(base.jenis_penghasilan || '').trim();

  if (jenis === 'Pekerjaan' || jenis === 'Pekerjaan Bebas') {
    const d = input.detail || input.data || {};
    const detail: PekerjaanDetail = {
      id: d.id != null ? Number(d.id) : undefined,
      penghasilan_id: d.penghasilan_id != null ? Number(d.penghasilan_id) : undefined,
      tempat_kerja: d.tempat_kerja || d.tempatKerja || d.tempat || '',
      penghasilan: d.penghasilan != null ? String(d.penghasilan) : undefined,
      created_at: d.created_at || d.createdAt || undefined,
    };
    return { ...base, detail };
  }

  if (jenis === 'Kegiatan Usaha') {
    const d = input.detail || input.data || {};
    const detail: KegiatanUsahaDetail = {
      id: d.id != null ? Number(d.id) : undefined,
      penghasilan_id: d.penghasilan_id != null ? Number(d.penghasilan_id) : undefined,
      merek_dagang: d.merek_dagang || d.merekDagang || d.nama_usaha || '',
      omzet_tahunan: d.omzet_tahunan != null ? String(d.omzet_tahunan) : undefined,
      izin_usaha: d.izin_usaha || d.izin || undefined,
      tanggal_izin: d.tanggal_izin || d.tanggalIzin || d.tanggal_izin || undefined,
      jumlah_karyawan: d.jumlah_karyawan != null ? String(d.jumlah_karyawan) : undefined,
      created_at: d.created_at || d.createdAt || undefined,
    };
    return { ...base, detail };
  }

  // Fallback: attach raw detail if present
  return { ...base, detail: input.detail || input.data };
}

export function validatePenghasilan(payload: Partial<Penghasilan>) {
  const errors: Record<string, string> = {};
  const jenis = String(payload.jenis_penghasilan || '').trim();

  if (!jenis) {
    errors.jenis_penghasilan = 'Jenis penghasilan wajib diisi';
    return { ok: false, errors } as const;
  }

  if (jenis === 'Pekerjaan' || jenis === 'Pekerjaan Bebas') {
    const d = payload.detail as Partial<PekerjaanDetail> | undefined;
    if (!d || !d.tempat_kerja || String(d.tempat_kerja).trim() === '') {
      errors.tempat_kerja = 'Tempat kerja wajib diisi';
    }
  }

  if (jenis === 'Kegiatan Usaha') {
    const d = payload.detail as Partial<KegiatanUsahaDetail> | undefined;
    if (!d || !d.merek_dagang || String(d.merek_dagang).trim() === '') {
      errors.merek_dagang = 'Merek dagang wajib diisi';
    }
  }

  return { ok: Object.keys(errors).length === 0, errors } as const;
}

// Example usage:
// const raw = await req.json();
// const items = Array.isArray(raw.penghasilan) ? raw.penghasilan.map(mapToPenghasilan) : [];
// const checks = items.map(i => validatePenghasilan(i));
