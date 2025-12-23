"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import styles from "./Dashboard.module.css";

export default function DashboardPage() {
  useAuth();
  const router = useRouter();

  const [maintenanceFeature, setMaintenanceFeature] = useState<string | null>(null);

  const handleUnavailable = (name: string) => {
    setMaintenanceFeature(name);
  };

  const closeMaintenance = () => setMaintenanceFeature(null);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className={styles.dashboardContainer}>
      <Navbar />
      <div className={styles.content}>

        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>Dashboard Overview</h1>
          <p className={styles.welcomeSubtitle}>
            Selamat datang! Pantau status perpajakan dan aktivitas Anda di sini.
          </p>
        </div>

        <div className={styles.statsGrid}>
          <Link href="/data_identitas_wajib_pajak" className={styles.statCard} aria-label="Isi Data Lengkap">
            <div className={styles.statIcon}>📄</div>
            <div className={styles.statInfo}>
              <h3>Isi Data Lengkap</h3>
              <p>Ayo isi data sekarang!</p>
            </div>
          </Link>
          <div className={styles.statCard} onClick={() => handleUnavailable("Tagihan")} style={{ cursor: "pointer", color: "red" }} title="Sedang maintenance">
            <div className={styles.statIcon}>💳</div>
            <div className={styles.statInfo}>
              <h3>Tagihan</h3>
              <p>Tidak Ada Tagihan</p>
            </div>
          </div>
          <div className={styles.statCard} onClick={() => handleUnavailable("Jatuh Tempo")} style={{ cursor: "pointer" }} title="Sedang maintenance">
            <div className={styles.statIcon}>📅</div>
            <div className={styles.statInfo}>
              <h3>Jatuh Tempo</h3>
              <p>-</p>
            </div>
          </div>
          <div className={styles.statCard} onClick={() => handleUnavailable("Notifikasi")} style={{ cursor: "pointer" }} title="Sedang maintenance">
            <div className={styles.statIcon}>🔔</div>
            <div className={styles.statInfo}>
              <h3>Notifikasi</h3>
              <p>!</p>
            </div>
          </div>
        </div>

        {maintenanceFeature && (
          <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60 }}>
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} onClick={closeMaintenance} />
            <div style={{ background: "#ffffff", padding: 20, borderRadius: 8, boxShadow: "0 6px 24px rgba(0,0,0,0.2)", minWidth: 320, zIndex: 70 }}>
              <h3 style={{ marginTop: 0, color: "#b00020" }}>{maintenanceFeature}</h3>
              <p style={{ marginBottom: 12, color: "#b00020", fontWeight: 600 }}>{maintenanceFeature} sedang dalam perawatan. Menu sementara tidak dapat diakses.</p>
              <div style={{ textAlign: "right" }}>
                <button onClick={closeMaintenance} style={{ padding: "8px 12px", background: "#2d6a4f", color: "#ffffff", border: "none", borderRadius: 6 }}>Tutup</button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.actionSection}>
          <div className={styles.actionContent}>
            <h2>Kelola Akun Anda</h2>
            <p>Pastikan data Anda selalu mutakhir untuk kemudahan administrasi. Hubungi layanan pelanggan jika Anda mengalami kendala.</p>
            <button
              onClick={handleLogout}
              className={styles.logoutButton}
            >
              Keluar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}