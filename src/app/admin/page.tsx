"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./admin.css";

type BiodataUser = {
    id: number;
    nama: string;
    nik: string;
    jenis_kelamin: string;
    tempat_lahir?: string;
    status: string; // e.g., "pending", "verified", "rejected"
};

export default function AdminPage() {
    const router = useRouter();
    const [data, setData] = useState<BiodataUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        // 1. Check Role/Token
        const token = sessionStorage.getItem("token");

        if (!token) {
            router.push("/login");
            return;
        }

        fetchBiodata(token);
    }, []);

    const fetchBiodata = async (token: string) => {
        try {
            const res = await fetch("https://api2.mizstudio.my.id/api/biodata", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                cache: "no-store", // Disable caching to ensure fresh data
            });

            if (res.ok) {
                const json = await res.json();
                console.log("Admin Data:", json);
                if (Array.isArray(json)) {
                    setData(json);
                } else if (json.data && Array.isArray(json.data)) {
                    setData(json.data);
                }
            } else {
                console.error("Failed to fetch data");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Apakah Anda yakin ingin menghapus data ini secara permanen?")) return;

        const token = sessionStorage.getItem("token");
        if (!token) return;

        setProcessingId(id);

        try {
            const res = await fetch(`https://api2.mizstudio.my.id/api/biodata/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const json = await res.json();

            if (res.ok) {
                alert("Data berhasil dihapus");
                // Remove from local state
                setData(prev => prev.filter(item => item.id !== id));
            } else {
                alert(`Gagal menghapus: ${json.message || "Terjadi kesalahan"}`);
            }
        } catch (err) {
            console.error(err);
            alert("Gagal menghubungi server.");
        } finally {
            setProcessingId(null);
        }
    };

    const updateStatus = async (id: number, newStatus: "verified" | "rejected") => {
        const token = sessionStorage.getItem("token");
        if (!token) return;

        setProcessingId(id);

        try {
            const res = await fetch(`https://api2.mizstudio.my.id/api/biodata/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            const json = await res.json();

            if (res.ok) {
                alert(`Berhasil: ${json.message}`);
                // Refresh local state
                setData(prev => prev.map(item =>
                    item.id === id ? { ...item, status: newStatus } : item
                ));
            } else {
                alert(`Gagal: ${json.message || "Terjadi kesalahan"}`);
            }
        } catch (err) {
            console.error(err);
            alert("Gagal menghubungi server.");
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) return (
        <div className="admin-container loading-state">
            <div className="spinner"></div>
            <p>Memuat data...</p>
        </div>
    );

    return (
        <div className="admin-container">
            {/* Background Elements similar to Login */}
            <div className="admin-background"></div>

            <div className="admin-content">
                <div className="admin-header">
                    <div className="header-left">
                        <div className="admin-logo">✱</div>
                        <div>
                            <h1 className="admin-title">Admin Dashboard</h1>
                            <p className="admin-subtitle">Verifikasi Data Identitas Wajib Pajak</p>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push("/login")}
                        className="btn-logout"
                    >
                        Logout
                    </button>
                </div>

                <div className="table-card">
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nama Lengkap</th>
                                    <th>NIK</th>
                                    <th>Tempat Lahir</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>{user.nama}</td>
                                        <td>{user.nik}</td>
                                        <td>{user.tempat_lahir || "-"}</td>
                                        <td>
                                            <span className={`status-badge status-${user.status?.toLowerCase() || 'pending'}`}>
                                                {user.status || "Pending"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                {(user.status !== 'verified' && user.status !== 'accepted') && (
                                                    <button
                                                        className="btn-action btn-approve"
                                                        onClick={() => updateStatus(user.id, "verified")}
                                                        disabled={processingId === user.id}
                                                        title="Setujui"
                                                    >
                                                        {processingId === user.id ? "..." : "✓ Setujui"}
                                                    </button>
                                                )}

                                                {(user.status !== 'rejected') && (
                                                    <button
                                                        className="btn-action btn-reject"
                                                        onClick={() => updateStatus(user.id, "rejected")}
                                                        disabled={processingId === user.id}
                                                        title="Tolak"
                                                    >
                                                        {processingId === user.id ? "..." : "✕ Tolak"}
                                                    </button>
                                                )}

                                                <button
                                                    className="btn-action btn-delete"
                                                    onClick={() => handleDelete(user.id)}
                                                    disabled={processingId === user.id}
                                                    title="Hapus"
                                                >
                                                    {processingId === user.id ? "..." : "🗑 Hapus"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="empty-state">
                                            Tidak ada data pendaftar.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
