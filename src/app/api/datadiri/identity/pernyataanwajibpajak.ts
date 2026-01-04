// // Tipe dan helper untuk field biodata_npwp
// // Fields berdasarkan payload contoh dari Postman.

// export type BiodataNpwp = {
// 	nik: string;
// 	nama: string;
// 	tempat_lahir?: string;
// 	tanggal_lahir?: string; // YYYY-MM-DD
// 	jenis_kelamin?: string; // "P" / "L" atau lain
// 	status_perkawinan?: string;
// 	nomor_kk?: string;
// 	negara?: string;
// 	jenis_pajak?: string;
// 	status_keluarga?: string;
// 	nama_ibu?: string;
// 	agama?: string;
// 	jenis_pekerjaan?: string;
// 	kategori_individu?: string;
// };

// // Validasi sederhana: pastikan field wajib ada dan format dasar
// export function validateBiodata(data: Partial<BiodataNpwp>) {
// 	const errors: Record<string, string> = {};

// 	if (!data.nik || typeof data.nik !== "string") {
// 		errors.nik = "NIK wajib diisi";
// 	}

// 	if (!data.nama || typeof data.nama !== "string") {
// 		errors.nama = "Nama wajib diisi";
// 	}

// 	if (data.tanggal_lahir && !/^\d{4}-\d{2}-\d{2}$/.test(data.tanggal_lahir)) {
// 		errors.tanggal_lahir = "Format tanggal harus YYYY-MM-DD";
// 	}

// 	return {
// 		ok: Object.keys(errors).length === 0,
// 		errors,
// 	} as const;
// }

// // Mapper: ambil payload (mis. dari form) dan kembalikan objek sesuai schema
// export function mapToBiodata(payload: Record<string, any>): BiodataNpwp {
// 	return {
// 		nik: String(payload.nik || payload.NIK || "").trim(),
// 		nama: String(payload.nama || payload.name || "").trim(),
// 		tempat_lahir: payload.tempat_lahir || payload.tempat || "",
// 		tanggal_lahir: payload.tanggal_lahir || payload.dob || "",
// 		jenis_kelamin: payload.jenis_kelamin || payload.gender || "",
// 		status_perkawinan: payload.status_perkawinan || payload.marital_status || "",
// 		nomor_kk: payload.nomor_kk || payload.no_kk || "",
// 		negara: payload.negara || payload.country || "",
// 		jenis_pajak: payload.jenis_pajak || payload.tax_type || "",
// 		status_keluarga: payload.status_keluarga || payload.family_status || "",
// 		nama_ibu: payload.nama_ibu || payload.mother_name || "",
// 		agama: payload.agama || payload.religion || "",
// 		jenis_pekerjaan: payload.jenis_pekerjaan || payload.job || "",
// 		kategori_individu: payload.kategori_individu || payload.category || "",
// 	};
// }

// // Contoh penggunaan (untuk referensi):
// // const payload = req.body;
// // const biodata = mapToBiodata(payload);
// // const { ok, errors } = validateBiodata(biodata);

