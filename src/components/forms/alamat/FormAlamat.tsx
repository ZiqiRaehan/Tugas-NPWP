"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import "./FormAlamat.css";

// Dynamic import for MapPicker to avoid SSR issues
const MapPicker = dynamic(() => import("./MapPicker"), { ssr: false });

type AlamatValues = {
    jenis_alamat: string;
    detail_alamat: string;
    rt: string;
    rw: string;
    provinsi: string;
    kota: string;
    kecamatan: string;
    desa: string;
    kode_wilayah: string;
    kode_pos: string;
    data_geometris: {
        lat: number;
        lng: number;
    };
    seksi_pengawasan: string;
};

export default function FormAlamat({ onNext }: { onNext?: (data: any) => void }) {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<AlamatValues>({
        defaultValues: {
            jenis_alamat: "Alamat Domisili (Alamat Utama)",
            data_geometris: { lat: 0, lng: 0 } // Default or empty
        }
    });

    const [saving, setSaving] = useState(false);
    const [showMap, setShowMap] = useState(false);

    const lat = watch("data_geometris.lat");
    const lng = watch("data_geometris.lng");

    const onSubmit = async (data: AlamatValues) => {
        setSaving(true);
        console.log("Submitting Alamat:", data);
        try {
            // Placeholder API call
            // const res = await fetch("https://api2.mizstudio.my.id/api/alamat", { ... });

            // Simulate delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            alert("Data alamat berhasil disimpan (Simulasi)");

            if (onNext) onNext(data);
        } catch (error) {
            console.error(error);
            alert("Gagal menyimpan alamat.");
        } finally {
            setSaving(false);
        }
    };

    const handleMapConfirm = (lat: number, lng: number) => {
        setValue("data_geometris.lat", lat);
        setValue("data_geometris.lng", lng);
        setShowMap(false);
    };

    return (
        <div className="alamat-container">
            <div className="alamat-header">
                <h2>Masukkan detail Alamat wajib pajak.</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="alamat-form">

                {/* Section 1: Jenis & Detail */}
                <div className="form-row half">
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Jenis Alamat *</label>
                        <select className="alamat-select" {...register("jenis_alamat", { required: true })}>
                            <option value="Alamat Domisili (Alamat Utama)">Alamat Domisili (Alamat Utama)</option>
                            <option value="Alamat Tempat Usaha">Alamat Tempat Usaha</option>
                            <option value="Alamat Tempat Tinggal">Alamat Tempat Tinggal</option>
                        </select>
                    </div>
                    <div className="form-group" style={{ flex: 2 }}>
                        <label>Detail Alamat *</label>
                        <input className="alamat-input" {...register("detail_alamat", { required: true })} placeholder="Enter Address details (street, number, building...)" />
                        {errors.detail_alamat && <span className="field-error">Wajib diisi</span>}
                    </div>
                </div>

                {/* Section 2: RT / RW */}
                <div className="form-row half">
                    <div className="form-group">
                        <label>RT *</label>
                        <input className="alamat-input" {...register("rt", { required: true })} placeholder="001" />
                        <span className="field-hint">If RT/RW does not exist, enter 000</span>
                    </div>
                    <div className="form-group">
                        <label>RW *</label>
                        <input className="alamat-input" {...register("rw", { required: true })} placeholder="007" />
                        <span className="field-hint">If RT/RW does not exist, enter 000</span>
                    </div>
                </div>

                {/* Section 3: Provinsi / Kota */}
                <div className="form-row half">
                    <div className="form-group">
                        <label>Provinsi *</label>
                        <input className="alamat-input" {...register("provinsi", { required: true })} placeholder="JAWA BARAT" />
                    </div>
                    <div className="form-group">
                        <label>Kota/Wilayah *</label>
                        <input className="alamat-input" {...register("kota", { required: true })} placeholder="KAB. BOGOR" />
                    </div>
                </div>

                {/* Section 4: Kecamatan / Desa */}
                <div className="form-row half">
                    <div className="form-group">
                        <label>Kecamatan *</label>
                        <input className="alamat-input" {...register("kecamatan", { required: true })} placeholder="GUNUNG PUTRI" />
                    </div>
                    <div className="form-group">
                        <label>Desa/Kelurahan *</label>
                        <input className="alamat-input" {...register("desa", { required: true })} placeholder="GUNUNG PUTRI" />
                    </div>
                </div>

                {/* Section 5: Kode Pos & Kode Wilayah */}
                <div className="form-row half">
                    <div className="form-group">
                        <label>Kode Pos *</label>
                        <input className="alamat-input" {...register("kode_pos", { required: true })} placeholder="16961" />
                    </div>
                    <div className="form-group">
                        <label>Kode Wilayah *</label>
                        <input className="alamat-input" {...register("kode_wilayah", { required: true })} placeholder="3201022004" />
                    </div>
                </div>

                {/* Section 6: Geometris & Seksi Pengawasan */}
                <div className="form-row half">
                    <div className="form-group">
                        <label>Data geometris *</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                className="alamat-input"
                                value={lat && lng ? `${lat.toFixed(5)}, ${lng.toFixed(5)}` : ""}
                                readOnly
                                placeholder="Latitude, Longitude"
                                style={{ flex: 1, backgroundColor: '#f9fafb' }}
                            />
                            <button
                                type="button"
                                className="btn-mark-address"
                                onClick={() => setShowMap(true)}
                            >
                                Mark Address
                            </button>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Seksi Pengawasan *</label>
                        <input className="alamat-input" {...register("seksi_pengawasan")} />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="btn-copy">Copy from Domicile</button>
                    <button type="submit" className="btn-next-action" disabled={saving}>
                        {saving ? "Menyimpan..." : "Lanjut"}
                    </button>
                </div>
            </form>

            {/* Map Modal */}
            {showMap && (
                <div className="modal-overlay">
                    <div className="modal-content map-modal" style={{ width: '90%', maxWidth: '800px', height: '600px', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        {/* MapPicker renders its own header/footer logic or we can wrap it */}
                        <div style={{ padding: '16px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>Pilih Lokasi</h3>
                            <button onClick={() => setShowMap(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <MapPicker
                                initialLat={lat || -6.2088}
                                initialLng={lng || 106.8456}
                                onConfirm={handleMapConfirm}
                                onClose={() => setShowMap(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
