"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "./FormKontak.css";

type KontakFormValues = {
    email: string;
    no_hp: string;
    no_telp?: string;
    no_fax?: string;
};

export default function FormKontak({ onNext }: { onNext?: (data: any) => void }) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<KontakFormValues>({
        defaultValues: {
            email: "",
            no_hp: "",
            no_telp: "",
            no_fax: ""
        }
    });

    const [verifyingEmail, setVerifyingEmail] = useState(false);
    const [verifyingHp, setVerifyingHp] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState("");
    const [verificationTarget, setVerificationTarget] = useState<"email" | "hp" | null>(null);

    // Load email from session storage on mount
    useEffect(() => {
        try {
            const userStr = sessionStorage.getItem("user");
            if (userStr) {
                const userData = JSON.parse(userStr);
                // User might have email directly or nested
                // Adjust based on actual structure. `LoginForm` saved result of `/auth/login`.
                // If structure is { user: { email: ... }, token: ... } or just { email: ..., token: ... }
                // Let's assume root or user object.
                const email = userData.email || userData.user?.email || "";
                if (email) {
                    setValue("email", email);
                }
            }
        } catch (e) {
            console.error("Failed to load user data", e);
        }
    }, [setValue]);

    const handleVerify = async (type: "email" | "hp") => {
        setSubmitError(null);
        const data = watch();

        if (type === "email" && !data.email) {
            setSubmitError("Email harus diisi.");
            return;
        }
        if (type === "hp" && !data.no_hp) {
            setSubmitError("Nomor Handphone harus diisi.");
            return;
        }

        const token = sessionStorage.getItem("token");
        if (!token) {
            setSubmitError("Anda belum login.");
            return;
        }

        if (type === "email") setVerifyingEmail(true);
        else setVerifyingHp(true);

        try {
            // Trigger contact creation/update which sends verification email
            // Based on user info: POST /api/kontak sends the email.
            // We use the same endpoint for both? 
            // The Postman shows: { "email": "...", "no_hp": "..." } -> "email verifikasi dikirim"
            // So calling this likely triggers the email verification.

            const payload = {
                email: data.email,
                no_hp: data.no_hp || "", // Send both if available
                // no_telp: data.no_telp,
                // no_fax: data.no_fax
            };

            const res = await fetch("https://api2.mizstudio.my.id/api/kontak", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.message || "Gagal memproses verifikasi.");
            }

            // If success, user says "muncul buat masukan kode verifikasi"
            // So we show OTP modal
            setVerificationTarget(type);
            setShowOtpModal(true);

            alert(json.message || "Kode verifikasi telah dikirim.");

        } catch (err: any) {
            console.error(err);
            setSubmitError(err.message || "Gagal mengirim verifikasi.");
        } finally {
            if (type === "email") setVerifyingEmail(false);
            else setVerifyingHp(false);
        }
    };

    const handleVerifyOtp = async () => {
        // Placeholder for OTP verification
        // Since we don't know the endpoint yet, we'll verify "dummy" or ask user.
        // Assuming there is an endpoint. For now, alerts success.

        // TODO: Replace with actual verify call
        // const res = await fetch("https://api2.mizstudio.my.id/api/kontak/verify", ...);

        if (otp === "123456") { // Dummy check
            setShowOtpModal(false);
            alert("Verifikasi berhasil! (Dummy Logic)");
            // Update status locally if needed
        } else {
            alert("Kode salah (Dummy: gunakan 123456)");
        }
    };

    const onSubmit = async (data: KontakFormValues) => {
        setSubmitError(null);
        // Final submission (Lanjut)
        // If "Lanjut" just means moving to next step, ensure data is saved.
        // We might want to call the same POST /api/kontak to ensure everything is saved.

        const token = sessionStorage.getItem("token");
        if (!token) {
            setSubmitError("Anda belum login.");
            return;
        }

        try {
            const res = await fetch("https://api2.mizstudio.my.id/api/kontak", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            const json = await res.json();
            if (!res.ok) {
                throw new Error(json.message || "Gagal menyimpan data.");
            }

            if (onNext) {
                onNext(json);
            }

        } catch (err: any) {
            setSubmitError(err.message);
        }
    };

    return (
        <div className="kontak-form-container">
            <div className="kontak-header">
                <h2>Mohon verifikasi detail kontak wajib pajak.</h2>
            </div>

            {submitError && (
                <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #dc2626' }}>
                    {submitError}
                </div>
            )}

            <div className="kontak-form-card">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-row">
                        {/* Email */}
                        <div className="form-col">
                            <label>E-mail *</label>
                            <div className="input-with-button">
                                <input
                                    {...register("email", { required: "Email wajib diisi" })}
                                    // User wants to edit email manually
                                    placeholder="email@example.com"
                                />
                                <button
                                    type="button"
                                    className="btn-verify"
                                    onClick={() => handleVerify("email")}
                                    disabled={verifyingEmail}
                                >
                                    {verifyingEmail ? "..." : "Verify"}
                                </button>
                            </div>
                        </div>

                        {/* No HP */}
                        <div className="form-col">
                            <label>Nomor Handphone *</label>
                            <div className="input-with-button">
                                <input
                                    {...register("no_hp", {
                                        required: "Nomor HP wajib diisi",
                                        pattern: { value: /^0\d{7,14}$/, message: "Mulai dengan 0, 8-15 digit angka" }
                                    })}
                                    placeholder="08123456789"
                                    maxLength={15}
                                />
                                <button
                                    type="button"
                                    className="btn-verify"
                                    onClick={() => handleVerify("hp")}
                                    disabled={verifyingHp}
                                >
                                    {verifyingHp ? "..." : "Verify"}
                                </button>
                            </div>
                            <div className="help-text">Phone number start with 0, min 8 characters, max 15 characters, and digits only</div>
                            {errors.no_hp && <span className="error-text">{errors.no_hp.message}</span>}
                        </div>

                        {/* No Telp */}
                        <div className="form-col">
                            <label>Nomor Telepon</label>
                            <input
                                className="single-input"
                                {...register("no_telp", {
                                    pattern: { value: /^0\d{7,14}$/, message: "Mulai dengan 0, 8-15 digit angka" }
                                })}
                                placeholder="021..."
                                maxLength={15}
                            />
                            <div className="help-text">Phone number start with 0, min 8 characters, max 15 characters, and digits only</div>
                            {errors.no_telp && <span className="error-text">{errors.no_telp.message}</span>}
                        </div>

                        {/* No Fax */}
                        <div className="form-col">
                            <label>Nomor Faksimile</label>
                            <input
                                className="single-input"
                                {...register("no_fax", {
                                    pattern: { value: /^0\d{7,14}$/, message: "Mulai dengan 0, 8-15 digit angka" }
                                })}
                                placeholder="Masukkan Nomor Fax"
                                maxLength={15}
                            />
                            <div className="help-text">Phone number start with 0, min 8 characters, max 15 characters, and digits only</div>
                            {errors.no_fax && <span className="error-text">{errors.no_fax.message}</span>}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-submit" disabled={isSubmitting}>
                            Lanjut
                        </button>
                    </div>
                </form>
            </div>

            {/* OTP Modal (Simple Inline Implementation for now) */}
            {showOtpModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', minWidth: '300px' }}>
                        <h3>Masukkan Kode Verifikasi</h3>
                        <p>Kode telah dikirim ke {verificationTarget === "email" ? "Email" : "Nomor HP"} Anda.</p>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Kode Verifikasi"
                            style={{ width: '100%', padding: '0.5rem', margin: '1rem 0', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button onClick={() => setShowOtpModal(false)} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>Batal</button>
                            <button onClick={handleVerifyOtp} style={{ padding: '0.5rem 1rem', background: '#6366f1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Verifikasi</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
