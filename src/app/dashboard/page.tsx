"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import styles from "./Dashboard.module.css";

export default function DashboardPage() {
  useAuth();
  const router = useRouter();

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
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📄</div>
            <div className={styles.statInfo}>
              <h3>Status Permohonan</h3>
              <p>Sedang Diproses</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>💳</div>
            <div className={styles.statInfo}>
              <h3>Tagihan</h3>
              <p>Tidak Ada Tagihan</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📅</div>
            <div className={styles.statInfo}>
              <h3>Jatuh Tempo</h3>
              <p>-</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>🔔</div>
            <div className={styles.statInfo}>
              <h3>Notifikasi</h3>
              <p>2 Pesan Baru</p>
            </div>
          </div>
        </div>

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