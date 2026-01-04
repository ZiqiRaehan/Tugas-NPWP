"use client";

import React, { useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import styles from "../dashboard/Dashboard.module.css";
import "./page.css";
import FormIdentitas from "@/components/forms/identitas/FormIdentitas";
import FormKontak from "@/components/forms/kontak/FormKontak";
import FormOrangTerkait from "@/components/forms/orang_terkait/FormOrangTerkait";
import FormDataEkonomi from "@/components/forms/ekonomi/FormDataEkonomi";
import FormAlamat from "@/components/forms/alamat/FormAlamat";

export default function Page() {
  const [step, setStep] = useState(4);
  const [loading, setLoading] = useState(true);

  // Restore step from session storage
  React.useEffect(() => {
    try {
      const savedStep = sessionStorage.getItem("registration_step");
      if (savedStep) {
        setStep(parseInt(savedStep));
      }
    } catch (e) {
      console.error("Failed to load step", e);
    } finally {
      setLoading(false);
    }
  }, []);

  function next(data?: any) {
    console.log(`Step ${step} Data:`, data);
    setStep((s) => {
      const nextStep = Math.min(7, s + 1);
      sessionStorage.setItem("registration_step", nextStep.toString());
      return nextStep;
    });
  }

  function back() {
    setStep(s => {
      const prevStep = Math.max(1, s - 1);
      sessionStorage.setItem("registration_step", prevStep.toString());
      return prevStep;
    });
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className={styles.dashboardContainer}>
      <Navbar />
      <div className={styles.content}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>Isi Data Identitas Wajib Pajak</h1>
          <p className={styles.welcomeSubtitle}>Lengkapi informasi berikut agar proses pendaftaran berjalan lancar.</p>
        </div>

        <div className={styles.statCard} style={{ padding: 24, cursor: "default" }}>
          <div style={{ width: '100%' }}>
            {/* Stepper UI */}
            <div className="stepper" style={{ marginBottom: 32, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }}>
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 100 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: n === step ? '#1B4B38' : (n < step ? '#2d7a5a' : '#eee'),
                    color: n === step || n < step ? '#fff' : '#333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    boxShadow: n === step ? '0 4px 6px rgba(0,0,0,0.1)' : 'none'
                  }}>
                    {n}
                  </div>
                  <div style={{
                    fontSize: 11,
                    marginTop: 8,
                    textAlign: 'center',
                    color: n === step ? '#1B4B38' : '#666',
                    fontWeight: n === step ? '600' : '400'
                  }}>
                    {[
                      'Identitas', 'Detail Kontak', 'Orang Terkait', 'Data Ekonomi', 'Alamat', 'Verifikasi', 'Pernyataan'
                    ][n - 1]}
                  </div>
                </div>
              ))}
            </div>

            {console.log("Rendering Step:", step)}

            {step === 1 && <FormIdentitas onNext={next} />}
            {step === 2 && <FormKontak onNext={next} />}
            {step === 3 && <FormOrangTerkait onNext={next} />}
            {step === 4 && <FormDataEkonomi onNext={next} />}
            {step === 5 && <FormAlamat onNext={next} />}

            {step > 5 && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                <h3>Tahap {step} belum tersedia</h3>
                <p>Silakan kembali atau selesaikan tahap sebelumnya.</p>
                <button onClick={() => setStep(s => s - 1)} style={{ marginTop: 20, padding: '8px 16px', background: '#1B4B38', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Kembali</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
