"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./profile.css";

type UserData = {
    id: number;
    nama: string;
    nik: string;
    jenis_kelamin: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    status_perkawinan: string;
    nomor_kk: string;
    status: string;
    token_step?: string;
    registration_step?: string;
    npwp?: string; // Add optional field if present
};

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        fetchUserProfile(token);
    }, []);

    const fetchUserProfile = async (token: string) => {
        try {
            const res = await fetch("https://api2.mizstudio.my.id/api/biodata", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                cache: "no-store",
            });

            const json = await res.json();
            console.log("User Data Response:", json);

            if (res.ok) {
                // Scenario 1: Data Not Found (Message)
                if (json.message === "Data tidak ditemukan") {
                    setUser(null);
                    setLoading(false);
                    return;
                }

                // Scenario 2: Array (Admin or List)
                if (Array.isArray(json)) {
                    // If it's an array, we try to find the user's data or just take the first one
                    // ideally we should match with session user_id but taking first is a reasonable fallback for now
                    // based on user explanation that backend filters by token
                    setUser(json.length > 0 ? json[0] : null);
                }
                // Scenario 3: Single Object (User with data)
                else if (typeof json === 'object' && json !== null) {
                    // Check if it's the wrapper { data: ... } or direct object
                    // User example showed direct object: { id: 11, ... }
                    const data = json.data || json;

                    // Verify it has expected fields to be sure it's not simply a success message
                    if (data.id || data.nik) {
                        setUser(data);
                    } else {
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            } else {
                // Handle 404 specifically if API returns it for "Not Found"
                if (res.status === 404) {
                    setUser(null);
                } else {
                    console.error("Failed to fetch profile:", res.status);
                    // Optional: keep null to show empty state instead of error
                    setUser(null);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        router.push("/login");
    };

    if (loading) return (
        <div className="profile-container loading-state">
            <div className="spinner"></div>
            <p>Memuat profil...</p>
        </div>
    );

    return (
        <div className="profile-container">
            <div className="profile-background"></div>

            <div className="profile-content">
                <div className="profile-header">
                    <div className="header-left">
                        <div className="profile-logo">✱</div>
                        <div>
                            <h1 className="profile-title">Profil Saya</h1>
                            <p className="profile-subtitle">Informasi Biodata Wajib Pajak</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => router.push("/dashboard")}
                            style={{ padding: '10px 20px', background: 'transparent', color: 'white', border: '1px solid white', borderRadius: '8px', cursor: 'pointer' }}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={handleLogout}
                            className="btn-logout"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {user ? (
                    <div className="profile-card">
                        <div className="profile-section-title">
                            Data Pribadi
                            <span style={{ float: 'right' }}>
                                <span className={`status-badge status-${user.status?.toLowerCase() || 'draft'}`}>
                                    {user.status || "DRAFT"}
                                </span>
                            </span>
                        </div>

                        <div className="profile-grid">
                            <div className="data-group">
                                <div className="data-label">Nama Lengkap</div>
                                <div className="data-value">{user.nama || "-"}</div>
                            </div>

                            <div className="data-group">
                                <div className="data-label">NIK</div>
                                <div className="data-value">{user.nik || "-"}</div>
                            </div>

                            <div className="data-group">
                                <div className="data-label">Nomor KK</div>
                                <div className="data-value">{user.nomor_kk || "-"}</div>
                            </div>

                            <div className="data-group">
                                <div className="data-label">Tempat, Tanggal Lahir</div>
                                <div className="data-value">
                                    {user.tempat_lahir || "-"}, {user.tanggal_lahir ? new Date(user.tanggal_lahir).toLocaleDateString("id-ID") : "-"}
                                </div>
                            </div>

                            <div className="data-group">
                                <div className="data-label">Jenis Kelamin</div>
                                <div className="data-value">
                                    {user.jenis_kelamin === 'L' ? 'Laki-laki' : user.jenis_kelamin === 'P' ? 'Perempuan' : "-"}
                                </div>
                            </div>

                            <div className="data-group">
                                <div className="data-label">Status Perkawinan</div>
                                <div className="data-value">{user.status_perkawinan || "-"}</div>
                            </div>

                            <div className="data-group">
                                <div className="data-label">NPWP</div>
                                <div className="data-value" style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                                    {(user as any).npwp || "Belum Terbit"}
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="profile-card" style={{ textAlign: 'center', padding: '60px' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📝</div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#1e293b' }}>
                            Data Anda Belum Terinput
                        </h2>
                        <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto 30px' }}>
                            Mohon lengkapi data identitas Anda untuk melanjutkan proses administrasi perpajakan.
                        </p>
                        <button
                            onClick={() => router.push("/dashboard")}
                            style={{
                                padding: '14px 28px',
                                background: '#1B4B38',
                                color: 'white',
                                border: 'none',
                                borderRadius: '30px',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '1rem',
                                boxShadow: '0 4px 6px rgba(27, 75, 56, 0.2)',
                                transition: 'transform 0.2s'
                            }}
                        >
                            Ayo Isi Data Diri Anda
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
