"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "./FormOrangTerkait.css";

type OrangTerkaitValues = {
    hubungan: string;
    nik: string;
    nama: string;
    keterangan: string;
};

export default function FormOrangTerkait({ onNext }: { onNext?: (data: any) => void }) {
    const [showModal, setShowModal] = useState(false);
    const [savedData, setSavedData] = useState<any[]>([]);
    const [saving, setSaving] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<OrangTerkaitValues>({
        defaultValues: {
            hubungan: "Lainnya",
            nik: "",
            nama: "",
            keterangan: ""
        }
    });

    const handleSave = async (data: OrangTerkaitValues) => {
        setSaving(true);
        setSubmitError(null);
        try {
            const token = sessionStorage.getItem("token");
            if (!token) throw new Error("Anda belum login.");

            console.log("Validating with KTP API:", data.nik, data.nama);

            // 1. Validate NIK & Name matches directly to external API
            const validateRes = await fetch("https://ktp-web.chasouluix.biz.id/api/ktp/validate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    nik: data.nik,
                    nama_lengkap: data.nama
                })
            });

            const validateJson = await validateRes.json();

            if (!validateRes.ok) {
                // If 404/400, usually message says "Data tidak sesuai" or similar
                throw new Error(validateJson.message || "Validasi NIK dan Nama gagal. Pastikan data sesuai KTP.");
            }

            // 2. If valid, save to backend
            // Using logic inferred from `ot.ts` -> POST /api/orang-terkait (proxied or direct)
            // Let's use direct backend URL if possible, or correct path.
            // Assuming backend is same base: https://api2.mizstudio.my.id/api/orang-terkait

            const submitRes = await fetch("https://api2.mizstudio.my.id/api/orang-terkait", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    nik_relasi: data.nik,
                    nama: data.nama,
                    hubungan: data.hubungan,
                    keterangan: data.keterangan || "-"
                })
            });

            const submitJson = await submitRes.json();

            if (!submitRes.ok) {
                throw new Error(submitJson.message || "Gagal menyimpan data ke server.");
            }

            // Success
            setSavedData([...savedData, data]);
            setShowModal(false);
            reset();
            alert("Orang terkait berhasil ditambahkan!");

        } catch (err: any) {
            console.error(err);
            setSubmitError(err.message || "Terjadi kesalahan.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="ot-container">
            <div className="ot-title-section">
                <h2>Masukkan orang terkait wajib pajak.</h2>
                <p>Tambahkan Orang yang Mempunyai Hubungan Istimewa</p>
            </div>

            {submitError && (
                <div style={{ color: 'red', marginBottom: '1rem' }}>{submitError}</div>
            )}

            {/* List of added people (if any) - Optional visualization */}
            {savedData.length > 0 && (
                <div className="ot-list">
                    {savedData.map((item, idx) => (
                        <div key={idx} className="ot-item">
                            <div>
                                <strong>{item.nama}</strong> ({item.hubungan})<br />
                                <small>{item.nik}</small>
                            </div>
                            <span style={{ color: 'green' }}>✓ Tersimpan</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="ot-add-button-container">
                <button className="btn-add-ot" onClick={() => setShowModal(true)}>
                    +
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4rem' }}>
                <button className="btn-next-step" onClick={() => onNext && onNext(savedData)}>
                    Lanjut
                </button>
            </div>


            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Buat Orang</h3>
                            <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
                        </div>

                        <div className="modal-body">
                            {submitError && (
                                <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
                                    {submitError}
                                </div>
                            )}

                            <form id="ot-form" onSubmit={handleSubmit(handleSave)}>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Jenis Orang yang Mempunyai Hubungan Istimewa *</label>
                                        <select {...register("hubungan")} defaultValue="Lainnya">
                                            <option value="Lainnya">Lainnya</option>
                                            <option value="Pemegang Saham">Pemegang Saham</option>
                                            <option value="Komisaris">Komisaris</option>
                                            <option value="Direktur">Direktur</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Person NIK/TIN *</label>
                                        <input
                                            {...register("nik", { required: "NIK wajib diisi" })}
                                            placeholder="NIK/NPWP"
                                        />
                                        {errors.nik && <span style={{ color: 'red', fontSize: '12px' }}>{errors.nik.message}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label>Person Name *</label>
                                        <input
                                            {...register("nama", { required: "Nama wajib diisi" })}
                                            placeholder="Nama Lengkap"
                                        />
                                        {errors.nama && <span style={{ color: 'red', fontSize: '12px' }}>{errors.nama.message}</span>}
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Keterangan</label>
                                        <input
                                            {...register("keterangan")}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                            <button
                                className="btn-primary save"
                                type="submit"
                                form="ot-form"
                                disabled={saving}
                            >
                                {saving ? "Menyimpan..." : "Simpan"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
