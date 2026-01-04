"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "./FormAlamat.css";

type AlamatValues = {
    jalan: string;
    blok?: string;
    nomor?: string;
    rt?: string;
    rw?: string;
    kelurahan: string;
    kecamatan: string;
    kota: string;
    provinsi: string;
    kode_pos: string;
};

export default function FormAlamat({ onNext }: { onNext?: (data: any) => void }) {
    const { register, handleSubmit, formState: { errors } } = useForm<AlamatValues>();
    const [saving, setSaving] = useState(false);

    const onSubmit = async (data: AlamatValues) => {
        setSaving(true);
        try {
            // Placeholder API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log("Alamat Submitted:", data);
            if (onNext) onNext(data);
        } catch (error) {
            console.error(error);
            alert("Gagal menyimpan alamat.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="alamat-container">
            <div className="alamat-header">
                <h2>Masukkan Data Alamat Tempat Tinggal</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="alamat-form">
                <div className="form-row">
                    <div className="form-group">
                        <label>Jalan *</label>
                        <input className="alamat-input" {...register("jalan", { required: true })} placeholder="Nama Jalan" />
                        {errors.jalan && <span style={{ color: 'red', fontSize: 12 }}>Wajib diisi</span>}
                    </div>
                </div>

                <div className="form-row half">
                    <div className="form-group">
                        <label>Blok</label>
                        <input className="alamat-input" {...register("blok")} placeholder="Blok" />
                    </div>
                    <div className="form-group">
                        <label>Nomor</label>
                        <input className="alamat-input" {...register("nomor")} placeholder="No. Rumah" />
                    </div>
                </div>

                <div className="form-row half">
                    <div className="form-group">
                        <label>RT</label>
                        <input className="alamat-input" {...register("rt")} placeholder="000" />
                    </div>
                    <div className="form-group">
                        <label>RW</label>
                        <input className="alamat-input" {...register("rw")} placeholder="000" />
                    </div>
                </div>

                <div className="form-row half">
                    <div className="form-group">
                        <label>Provinsi *</label>
                        <input className="alamat-input" {...register("provinsi", { required: true })} placeholder="Provinsi" />
                    </div>
                    <div className="form-group">
                        <label>Kota/Kabupaten *</label>
                        <input className="alamat-input" {...register("kota", { required: true })} placeholder="Kota/Kabupaten" />
                    </div>
                </div>

                <div className="form-row half">
                    <div className="form-group">
                        <label>Kecamatan *</label>
                        <input className="alamat-input" {...register("kecamatan", { required: true })} placeholder="Kecamatan" />
                    </div>
                    <div className="form-group">
                        <label>Kelurahan/Desa *</label>
                        <input className="alamat-input" {...register("kelurahan", { required: true })} placeholder="Kelurahan/Desa" />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Kode Pos *</label>
                        <input className="alamat-input" {...register("kode_pos", { required: true })} placeholder="Kode Pos" />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
                    <button type="submit" className="btn-next-action" disabled={saving}>
                        {saving ? "Menyimpan..." : "Lanjut"}
                    </button>
                </div>
            </form>
        </div>
    );
}
