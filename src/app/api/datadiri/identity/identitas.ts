// Helper untuk tabel `biodata_npwp` (identitas)
export type JenisKelamin = 'L' | 'P';
export type StatusIdentitas = 'draft' | 'submitted' | 'verified' | 'rejected';

export type Identitas = {
  id?: number;
  user_id?: number;
  nik?: string; // varchar(20)
  nama?: string; // varchar(100)
  tempat_lahir?: string; // varchar(50)
  tanggal_lahir?: string; // date
  jenis_kelamin?: JenisKelamin;
  status_perkawinan?: string; // varchar(20)
  nomor_kk?: string; // varchar(20)
  negara?: string; // varchar(50)
  jenis_pajak?: string; // varchar(50)
  status_keluarga?: string; // varchar(50)
  nama_ibu?: string; // varchar(100)
  agama?: string; // varchar(50)
  jenis_pekerjaan?: string; // varchar(100)
  kategori_individu?: string; // varchar(50)
  npwp?: string; // varchar(20)
  status?: StatusIdentitas;
};

export function mapToIdentitas(input: Record<string, any>): Identitas {
  return {
    id: input.id != null ? Number(input.id) : undefined,
    user_id: input.user_id != null ? Number(input.user_id) : undefined,
    nik: input.nik || input.NIK || input.nomor_identitas || '',
    nama: input.nama || input.name || '',
    tempat_lahir: input.tempat_lahir || input.tempatLahir || input.tempat || '',
    tanggal_lahir: input.tanggal_lahir || input.tanggalLahir || input.dob || undefined,
    jenis_kelamin: (input.jenis_kelamin || input.jenisKelamin || input.gender || '').toUpperCase(),
    status_perkawinan: input.status_perkawinan || input.statusPerkawinan || input.marital_status || '',
    nomor_kk: input.nomor_kk || input.nomorKK || input.kk || '',
    negara: input.negara || input.country || 'Indonesia',
    jenis_pajak: input.jenis_pajak || input.jenisPajak || '',
    status_keluarga: input.status_keluarga || input.statusKeluarga || '',
    nama_ibu: input.nama_ibu || input.namaIbu || input.mother_name || '',
    agama: input.agama || input.religion || '',
    jenis_pekerjaan: input.jenis_pekerjaan || input.jenisPekerjaan || input.occupation || '',
    kategori_individu: input.kategori_individu || input.kategoriIndividu || input.kategori || '',
    npwp: input.npwp || input.NPWP || '',
    status: input.status || input.status || 'draft',
  };
}

export function validateIdentitas(payload: Partial<Identitas>) {
  const errors: Record<string, string> = {};

  // Validasi NIK
  if (!payload.nik || String(payload.nik).trim() === '') {
    errors.nik = 'NIK wajib diisi';
  } else if (!/^\d{16}$/.test(String(payload.nik).trim())) {
    errors.nik = 'NIK harus 16 digit';
  }

  // Validasi nama
  if (!payload.nama || String(payload.nama).trim() === '') {
    errors.nama = 'Nama wajib diisi';
  } else if (String(payload.nama).length > 100) {
    errors.nama = 'Nama maksimal 100 karakter';
  }

  // Validasi tempat lahir
  if (payload.tempat_lahir && String(payload.tempat_lahir).length > 50) {
    errors.tempat_lahir = 'Tempat lahir maksimal 50 karakter';
  }

  // Validasi tanggal lahir
  if (payload.tanggal_lahir) {
    const d = new Date(String(payload.tanggal_lahir));
    if (Number.isNaN(d.getTime())) {
      errors.tanggal_lahir = 'Format tanggal lahir tidak valid';
    }
  }

  // Validasi jenis kelamin
  if (payload.jenis_kelamin && !['L', 'P'].includes(String(payload.jenis_kelamin))) {
    errors.jenis_kelamin = 'Jenis kelamin harus L atau P';
  }

  // Validasi NPWP
  if (payload.npwp && String(payload.npwp).trim() !== '') {
    const npwp = String(payload.npwp).replace(/\D/g, '');
    if (npwp.length !== 15) {
      errors.npwp = 'NPWP harus 15 digit';
    }
  }

  // Validasi status
  if (payload.status && !['draft', 'submitted', 'verified', 'rejected'].includes(String(payload.status))) {
    errors.status = 'Status tidak valid';
  }

  return { ok: Object.keys(errors).length === 0, errors } as const;
}

// Contoh penggunaan:
// const body = await req.json();
// const identitas = mapToIdentitas(body);
// const { ok, errors } = validateIdentitas(identitas);
// if (!ok) return new Response(JSON.stringify({ errors }), { status: 400 });
