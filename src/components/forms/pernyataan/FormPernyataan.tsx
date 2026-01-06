"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./FormPernyataan.css";

export default function FormPernyataan({ onNext }: { onNext?: (data: any) => void }) {
    const router = useRouter();
    const [isChecked, setIsChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!isChecked) {
            setError("Anda harus menyetujui pernyataan untuk melanjutkan.");
            return;
        }

        setLoading(true);
        setError(null);

        const token = sessionStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const res = await fetch("https://api2.mizstudio.my.id/api/pernyataan", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    // The API requirement might be empty body if it just records the timestamp based on token
                    // But usually some flag is sent. Based on user prompt "metode post ... berdasarkan token", implied no huge body.
                    // We'll send a confirmation flag just in case
                    setuju: true
                })
            });

            const json = await res.json();

            if (res.ok) {
                alert("Permohonan berhasil diajukan!");
                // Clear registration step as it is complete
                sessionStorage.removeItem("registration_step");

                // Redirect to dashboard
                router.push("/dashboard");
            } else {
                setError(json.message || "Gagal mengajukan permohonan.");
            }
        } catch (err: any) {
            console.error(err);
            setError("Terjadi kesalahan sistem. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pernyataan-container">
            <h2 className="pernyataan-title">
                Mohon konfirmasi bahwa Wajib Pajak mematuhi pernyataan berikut ini.
            </h2>

            {error && <div className="error-banner">{error}</div>}

            <div className="statement-card">
                <div className="checkbox-wrapper">
                    <input
                        type="checkbox"
                        id="agree"
                        className="checkbox-input"
                        checked={isChecked}
                        onChange={(e) => {
                            setIsChecked(e.target.checked);
                            if (e.target.checked) setError(null);
                        }}
                    />
                    <label htmlFor="agree" className="statement-text">
                        Dengan menyadari sepenuhnya akan segala akibatnya termasuk sanksi sesuai dengan ketentuan peraturan perundang-undangan yang berlaku, saya menyatakan bahwa apa yang saya sampaikan di atas adalah benar dan lengkap, dan saya menyetujui untuk menggunakan Akun Wajib Pajak saya sebagai sarana penerimaan surat dan dokumen perpajakan.
                    </label>
                </div>
            </div>

            <div className="form-actions">
                <button
                    className="btn-submit"
                    onClick={handleSubmit}
                    disabled={loading || !isChecked}
                >
                    {loading ? "Memproses..." : "Ajukan Permohonan"}
                </button>
            </div>
        </div>
    );
}
