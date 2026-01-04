"use client";

import React, { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import "./FormDataEkonomi.css";

// Types
type MainEkonomiValues = {
    metode: string;
    mata_uang: string;
    periode_pembukuan: string;
};

type IncomeSourceValues = {
    jenis_penghasilan: string;
    kode_klu: string;

    // Pekerjaan specific
    tempat_kerja?: string;
    penghasilan_per_bulan?: string;

    // Kegiatan Usaha specific
    merek_dagang?: string;
    omzet_per_tahun?: string;
    izin_usaha?: string;
    tanggal_izin_usaha?: string;
    jumlah_karyawan?: string;
};

export default function FormDataEkonomi({ onNext }: { onNext?: (data: any) => void }) {
    const [incomeSources, setIncomeSources] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [savingMain, setSavingMain] = useState(false);
    const [savingSource, setSavingSource] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    // Main Form
    const { register: registerMain, handleSubmit: handleSubmitMain, setValue: setMainValue } = useForm<MainEkonomiValues>({
        defaultValues: {
            metode: "Pencatatan",
            mata_uang: "Rupiah Indonesia",
            periode_pembukuan: "01-12"
        }
    });

    // Modal Form
    const {
        register: registerModal,
        handleSubmit: handleSubmitModal,
        watch,
        reset: resetModal,
        setValue: setValueModal
    } = useForm<IncomeSourceValues>({
        defaultValues: {
            jenis_penghasilan: "",
            kode_klu: ""
        }
    });

    const selectedJenis = watch("jenis_penghasilan");

    // Load existing data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem("token");
                if (!token) return;

                const res = await fetch("https://api2.mizstudio.my.id/api/ekonomi", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const json = await res.json();
                    console.log("Fetched Ekonomi Data:", json);

                    // Assuming structure based on typical patterns. 
                    // If json contains main fields:
                    if (json.metode) setMainValue("metode", json.metode);
                    if (json.mata_uang) setMainValue("mata_uang", json.mata_uang);
                    if (json.periode_pembukuan) setMainValue("periode_pembukuan", json.periode_pembukuan);

                    // If json contains list of sources (e.g. json.penghasilan or if json is array)
                    // Adjust based on actual API response. For now assuming json might have a property 'penghasilan' or similar
                    // Or if endpoints are completely separate, maybe this GET only returns main data?
                    // User said "memunculkan data yang sudah disimpan tadi dengan menggunakan metode get api nya".
                    // Let's assume the GET returns the list of income sources too, or we need to fetch them from somewhere.
                    // If the user said "different tables", maybe the GET /api/ekonomi returns everything aggregated?

                    if (Array.isArray(json.penghasilan)) {
                        setIncomeSources(json.penghasilan);
                    } else if (Array.isArray(json)) {
                        // If the endpoint returns the list directly
                        setIncomeSources(json);
                    } else if (json.data && Array.isArray(json.data)) {
                        setIncomeSources(json.data);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch ekonomi data", error);
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();
    }, [setMainValue]);

    const handleAddSource = async (data: IncomeSourceValues) => {
        setSavingSource(true);
        setSubmitError(null);
        try {
            const token = sessionStorage.getItem("token");
            if (!token) throw new Error("Anda belum login.");

            // Construct payload based on type
            let payload: any = {
                jenis_penghasilan: data.jenis_penghasilan,
                kode_klu: data.kode_klu
            };

            if (data.jenis_penghasilan === "Pekerjaan" || data.jenis_penghasilan === "Pekerjaan Bebas") {
                payload.detail = {
                    tempat_kerja: data.tempat_kerja,
                    penghasilan: parseInt(data.penghasilan_per_bulan?.toString() || "0")
                };
            } else if (data.jenis_penghasilan === "Kegiatan Usaha") {
                payload.detail = {
                    merek_dagang: data.merek_dagang,
                    omzet_tahunan: data.omzet_per_tahun,
                    izin_usaha: data.izin_usaha,
                    tanggal_izin: data.tanggal_izin_usaha,
                    jumlah_karyawan: data.jumlah_karyawan
                };
            }

            console.log("Sending income source:", payload);

            const res = await fetch("https://api2.mizstudio.my.id/api/ekonomi/penghasilan", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Gagal menyimpan sumber penghasilan.");

            // Add to list (reload from server to be sure, or append)
            // For smoother UX, append locally using returned ID
            const newId = json.id || json.data?.id || Date.now();
            setIncomeSources([...incomeSources, { ...data, id: newId }]);

            setShowModal(false);
            resetModal();
            alert("Sumber penghasilan berhasil ditambahkan.");

        } catch (e: any) {
            console.error(e);
            setSubmitError(e.message);
        } finally {
            setSavingSource(false);
        }
    };

    const handleMainSubmit = async (data: MainEkonomiValues) => {
        if (incomeSources.length === 0) {
            alert("Mohon tambahkan setidaknya satu sumber penghasilan.");
            return;
        }

        setSavingMain(true);
        try {
            const token = sessionStorage.getItem("token");
            if (!token) throw new Error("Anda belum login.");

            const res = await fetch("https://api2.mizstudio.my.id/api/ekonomi", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.message || "Gagal menyimpan data ekonomi.");

            if (onNext) onNext(json);

        } catch (e: any) {
            alert(e.message);
        } finally {
            setSavingMain(false);
        }
    };

    return (
        <div className="ekonomi-container">
            <div className="ekonomi-header">
                <h2>Masukkan data ekonomi wajib pajak.</h2>
            </div>

            {/* Main Form (Always visible) */}
            <form id="main-ekonomi-form" onSubmit={handleSubmitMain(handleMainSubmit)}>
                <div className="ekonomi-main-form">
                    <div className="ekonomi-form-group">
                        <label>Metode Pembukuan/Pencatatan *</label>
                        <select className="ekonomi-select" {...registerMain("metode")}>
                            <option value="Pencatatan">Pencatatan</option>
                            <option value="Pembukuan">Pembukuan</option>
                        </select>
                    </div>
                    <div className="ekonomi-form-group">
                        <label>Mata Uang Pembukuan *</label>
                        <select className="ekonomi-select" {...registerMain("mata_uang")}>
                            <option value="Rupiah Indonesia">Rupiah Indonesia</option>
                            <option value="Dollar Amerika">Dollar Amerika</option>
                        </select>
                    </div>
                    <div className="ekonomi-form-group">
                        <label>Periode Pembukuan *</label>
                        <select className="ekonomi-select" {...registerMain("periode_pembukuan")}>
                            <option value="01-12">01-12</option>
                            <option value="04-03">04-03</option>
                            <option value="07-06">07-06</option>
                            <option value="10-09">10-09</option>
                        </select>
                    </div>
                </div>

                {/* Sources Table Section */}
                <div className="ekonomi-table-section">
                    <div className="section-title">Semua</div>
                    <button type="button" className="btn-tambah" onClick={() => setShowModal(true)}>
                        Tambah
                    </button>

                    <table className="ekonomi-table">
                        <thead>
                            <tr>
                                <th>Aksi</th>
                                <th>Sumber Penghasilan</th>
                                <th>Kode KLU</th>
                                <th>Keterangan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingData ? (
                                <tr><td colSpan={4} style={{ textAlign: 'center', padding: 20 }}>Memuat data...</td></tr>
                            ) : incomeSources.length === 0 ? (
                                <tr>
                                    <td colSpan={4}>
                                        <div className="empty-state">
                                            Tidak ada data yang ditemukan.
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                incomeSources.map((src, idx) => (
                                    <tr key={idx}>
                                        <td>-</td>
                                        <td>{src.jenis_penghasilan}</td>
                                        <td>{src.kode_klu}</td>
                                        <td>
                                            {(src.jenis_penghasilan === 'Pekerjaan' || src.jenis_penghasilan === 'Pekerjaan Bebas')
                                                ? src.tempat_kerja || src.detail?.tempat_kerja
                                                : (src.merek_dagang || src.detail?.merek_dagang || src.jenis_penghasilan)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        type="submit"
                        className="btn-next-action"
                        disabled={savingMain}
                        style={{ opacity: (incomeSources.length === 0) ? 0.5 : 1 }}
                        title={incomeSources.length === 0 ? "Tambahkan sumber penghasilan terlebih dahulu" : ""}
                    >
                        {savingMain ? "Menyimpan..." : "Lanjut"}
                    </button>
                </div>
            </form>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content ekonomi-modal">
                        <div className="modal-header">
                            <h3>Tambah Sumber Penghasilan</h3>
                            <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            {submitError && <div className="error-banner">{submitError}</div>}

                            <form id="source-form" onSubmit={handleSubmitModal(handleAddSource)}>
                                <div className="form-row">
                                    <label>Sumber Penghasilan *</label>
                                    <select className="ekonomi-select" {...registerModal("jenis_penghasilan", { required: true })}>
                                        <option value="">Pilih sumber pendapatan</option>
                                        <option value="Pekerjaan">Pekerjaan</option>
                                        <option value="Pekerjaan Bebas">Pekerjaan Bebas</option>
                                        <option value="Kegiatan Usaha">Kegiatan Usaha</option>
                                    </select>
                                    {!selectedJenis && <span className="field-warning">Kolom ini wajib diisi!</span>}
                                </div>

                                {selectedJenis && (
                                    <div className="form-row">
                                        <label>Kode KLU *</label>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input className="ekonomi-input" {...registerModal("kode_klu", { required: true })} placeholder="Kode KLU" style={{ flex: 1 }} />
                                            <button type="button" className="btn-add-klu" style={{ background: '#1e293b', color: 'white', border: 'none', borderRadius: '4px', padding: '0 1rem' }}>Add</button>
                                        </div>
                                    </div>
                                )}

                                {(selectedJenis === 'Pekerjaan' || selectedJenis === 'Pekerjaan Bebas') && (
                                    <>
                                        <div className="form-row">
                                            <label>Tempat Kerja *</label>
                                            <input
                                                className="ekonomi-input"
                                                {...registerModal("tempat_kerja", { required: true })}
                                                placeholder="Silakan masukkan nama tempat kerja Anda"
                                            />
                                            <span className="field-warning">Kolom ini wajib diisi!</span>
                                        </div>
                                        <div className="form-row">
                                            <label>Penghasilan per bulan (Rp) *</label>
                                            <input
                                                type="number"
                                                className="ekonomi-input"
                                                {...registerModal("penghasilan_per_bulan", { required: true })}
                                                placeholder="Contoh: 5000000"
                                            />
                                            <span className="field-warning">Masukkan angka tanpa titik/koma (Contoh: 5000000)</span>
                                        </div>
                                    </>
                                )}

                                {selectedJenis === 'Kegiatan Usaha' && (
                                    <>
                                        <div className="form-row">
                                            <label>Merek Dagang / Bisnis *</label>
                                            <input className="ekonomi-input" {...registerModal("merek_dagang", { required: true })} />
                                        </div>
                                        <div className="form-row">
                                            <label>Perkiraan Omset Per Tahun</label>
                                            <select className="ekonomi-select" {...registerModal("omzet_per_tahun")}>
                                                <option value="">Pilih Omset</option>
                                                <option value="Rp. 0 s/d Rp. 4,8 M">Rp. 0 s/d Rp. 4,8 M</option>
                                                <option value="Di atas Rp. 4,8 M">Di atas Rp. 4,8 M</option>
                                            </select>
                                        </div>
                                        <div className="form-row">
                                            <label>Izin Usaha</label>
                                            <input className="ekonomi-input" {...registerModal("izin_usaha")} />
                                        </div>
                                        <div className="form-row">
                                            <label>Tanggal Izin Usaha</label>
                                            <input type="date" className="ekonomi-input" {...registerModal("tanggal_izin_usaha")} />
                                        </div>
                                        <div className="form-row">
                                            <label>Jumlah karyawan *</label>
                                            <select className="ekonomi-select" {...registerModal("jumlah_karyawan", { required: true })}>
                                                <option value="di bawah 10">di bawah 10</option>
                                                <option value="10-50">10-50</option>
                                                <option value="di atas 50">di atas 50</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                            <button type="submit" form="source-form" className="btn-primary save" disabled={savingSource}>
                                {savingSource ? "Menyimpan..." : "Simpan"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
