"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = sessionStorage.getItem("token");
    const userData = sessionStorage.getItem("user");
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }

    // Handle navbar scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <div className={styles.landingContainer}>
      {/* Navigation Bar */}
      <nav className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ""}`}>
        <div className={styles.navContent}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>✱</span>
            NPWP App
          </div>
          <div className={styles.navLinks}>
            {isLoggedIn ? (
              <div className={styles.userInfo}>
                <span className={styles.userName}>Halo, {user?.email || user?.name}</span>
                <Link href="/dashboard" className={styles.navButtonPrimary}>
                  Dashboard
                </Link>
                <button onClick={handleLogout} className={styles.navButtonOutline}>
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className={styles.navButtonOutline}>
                  Masuk
                </Link>
                <Link href="/kategoriRegister" className={styles.navButtonPrimary}>
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        {/* Decorative shapes */}
        <div className={styles.decorativeShapes}>
          <div className={styles.shape1}></div>
          <div className={styles.shape2}></div>
          <div className={styles.shape3}></div>
        </div>
        
        <div className={styles.heroContent}>
          <p className={styles.heroSubtitle}>Selamat Datang</p>
          <h1 className={styles.heroTitle}>
            Kelola NPWP Anda dengan{" "}
            <span className={styles.heroTitleHighlight}>Mudah & Aman</span>
          </h1>
          <p className={styles.heroDescription}>
            Akses tugas, catatan, dan proyek Anda kapan saja, di mana saja - 
            dan jaga semuanya tetap berjalan di satu tempat. Platform terintegrasi 
            untuk semua kebutuhan administrasi perpajakan Anda.
          </p>
          
          {!isLoggedIn ? (
            <div className={styles.heroButtons}>
              <Link href="/kategoriRegister" className={styles.buttonPrimary}>
                Mulai Sekarang →
              </Link>
              <Link href="/login" className={styles.buttonSecondary}>
                Sudah Punya Akun
              </Link>
            </div>
          ) : (
            <div className={styles.heroButtons}>
              <Link href="/dashboard" className={styles.buttonPrimary}>
                Buka Dashboard →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionSubtitle}>Fitur Unggulan</p>
          <h2 className={styles.sectionTitle}>Semua yang Anda Butuhkan</h2>
          <p className={styles.sectionDescription}>
            Nikmati berbagai fitur yang dirancang untuk mempermudah pengelolaan NPWP Anda
          </p>
        </div>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📝</div>
            <h3 className={styles.featureTitle}>Kelola Tugas</h3>
            <p className={styles.featureDescription}>
              Atur dan kelola semua tugas administrasi perpajakan Anda dengan mudah dan efisien dalam satu dashboard.
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📊</div>
            <h3 className={styles.featureTitle}>Pantau Proyek</h3>
            <p className={styles.featureDescription}>
              Lacak progress dan status dokumen perpajakan Anda secara real-time dengan visualisasi yang jelas.
            </p>
          </div>
          
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔒</div>
            <h3 className={styles.featureTitle}>Aman & Terpercaya</h3>
            <p className={styles.featureDescription}>
              Data Anda dilindungi dengan sistem keamanan tingkat tinggi dan enkripsi end-to-end.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>10K+</div>
            <div className={styles.statLabel}>Pengguna Aktif</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>99.9%</div>
            <div className={styles.statLabel}>Uptime</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>24/7</div>
            <div className={styles.statLabel}>Dukungan</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>100%</div>
            <div className={styles.statLabel}>Aman</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>Siap untuk Memulai?</h2>
          <p className={styles.ctaDescription}>
            Bergabung sekarang dan nikmati kemudahan mengelola NPWP Anda
          </p>
          {!isLoggedIn ? (
            <Link href="/kategoriRegister" className={styles.ctaButton}>
              Daftar Gratis →
            </Link>
          ) : (
            <Link href="/dashboard" className={styles.ctaButton}>
              Buka Dashboard →
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>✱ NPWP App</div>
          <p className={styles.footerText}>© 2025 NPWP App. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <a href="#" className={styles.footerLink}>Tentang Kami</a>
            <a href="#" className={styles.footerLink}>Kebijakan Privasi</a>
            <a href="#" className={styles.footerLink}>Syarat & Ketentuan</a>
          </div>
        </div>
      </footer>
    </div>
  );
}