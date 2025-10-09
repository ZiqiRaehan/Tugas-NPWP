"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./kategoriRegister.css";

export default function KategoriRegister() {
  const router = useRouter();
  const [language, setLanguage] = useState<"id" | "en">("id");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Translations
  const translations = {
    id: {
      title: "Persiapan Registrasi Wajib Pajak",
      subtitle: "Silakan pilih jenis wajib pajak yang ingin Anda daftarkan sesuai dengan kategori yang paling relevan dengan status perpajakan Anda. Pastikan untuk memilih dengan cermat, karena setiap jenis wajib pajak memiliki kewajiban perpajakan dan prosedur pendaftaran yang berbeda.",
      leftTitle: "Selamat Datang",
      leftSubtitle: "Mulai perjalanan perpajakan Anda dengan mudah dan aman",
      perorangan: "Perorangan",
      peroranganDesc: "Untuk individu yang memiliki penghasilan",
      instansi: "Instansi Pemerintah",
      instansiDesc: "Untuk lembaga pemerintah",
      badan: "Badan",
      badanDesc: "Untuk perusahaan dan organisasi",
      pmse: "Pemungut PPN PMSE Luar Negeri",
      pmseDesc: "Untuk platform digital luar negeri",
      backButton: "Kembali",
      nextButton: "Lanjutkan",
      modalTitle: "Fitur Dalam Pengembangan",
      modalMessage: "Fitur ini sedang dalam tahap pengembangan dan akan segera hadir. Silakan pilih kategori Perorangan untuk melanjutkan pendaftaran.",
      modalButton: "Tutup"
    },
    en: {
      title: "Taxpayer Registration Preparation",
      subtitle: "Please select the type of taxpayer you wish to register according to the category most relevant to your tax status. Be sure to choose carefully, as each type of taxpayer has different tax obligations and registration procedures.",
      leftTitle: "Welcome",
      leftSubtitle: "Start your tax journey easily and securely",
      perorangan: "Individual",
      peroranganDesc: "For individuals with income",
      instansi: "Government Agency",
      instansiDesc: "For government institutions",
      badan: "Entity",
      badanDesc: "For companies and organizations",
      pmse: "Foreign PMSE VAT Collector",
      pmseDesc: "For foreign digital platforms",
      backButton: "Back",
      nextButton: "Continue",
      modalTitle: "Feature Under Development",
      modalMessage: "This feature is currently under development and will be available soon. Please select Individual category to continue registration.",
      modalButton: "Close"
    }
  };

  const t = translations[language];

  const handleKategoriSelect = (kategori: string) => {
    if (kategori === "perorangan") {
      // Store selected kategori and navigate to register
      localStorage.setItem("selectedKategori", kategori);
      router.push("/register");
    } else {
      // Show modal for other categories
      setModalMessage(t.modalMessage);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="kategori-container">
      <div className="kategori-card">
        {/* Left Side - Gradient Background */}
        <div className="kategori-left">
          <div className="logo">✱</div>
          <div className="left-content">
            <p className="left-subtitle">{t.leftTitle}</p>
            <h1 className="left-title">{t.leftSubtitle}</h1>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="kategori-right">
          {/* Language Selector */}
          <div className="language-selector">
            <button
              type="button"
              className={language === "id" ? "active" : ""}
              onClick={() => setLanguage("id")}
            >
              🇮🇩 ID
            </button>
            <button
              type="button"
              className={language === "en" ? "active" : ""}
              onClick={() => setLanguage("en")}
            >
              🇺🇸 EN
            </button>
          </div>

          <div className="kategori-content">
            {/* Header */}
            <div className="kategori-header">
              <h2 className="kategori-title">{t.title}</h2>
              <p className="kategori-subtitle">{t.subtitle}</p>
            </div>

            {/* Kategori Cards */}
            <div className="kategori-grid">
              {/* Perorangan */}
              <div 
                className="kategori-card-item perorangan"
                onClick={() => handleKategoriSelect("perorangan")}
              >
                <div className="card-icon">
                  <div className="person-icon">👤</div>
                </div>
                <h3 className="card-title">{t.perorangan}</h3>
                <p className="card-desc">{t.peroranganDesc}</p>
              </div>

              {/* Instansi Pemerintah */}
              <div 
                className="kategori-card-item instansi"
                onClick={() => handleKategoriSelect("instansi")}
              >
                <div className="card-icon">
                  <div className="gov-icon">🏛️</div>
                </div>
                <h3 className="card-title">{t.instansi}</h3>
                <p className="card-desc">{t.instansiDesc}</p>
              </div>

              {/* Badan */}
              <div 
                className="kategori-card-item badan"
                onClick={() => handleKategoriSelect("badan")}
              >
                <div className="card-icon">
                  <div className="building-icon">🏢</div>
                </div>
                <h3 className="card-title">{t.badan}</h3>
                <p className="card-desc">{t.badanDesc}</p>
              </div>

              {/* PMSE */}
              <div 
                className="kategori-card-item pmse"
                onClick={() => handleKategoriSelect("pmse")}
              >
                <div className="card-icon">
                  <div className="vat-icon">📄</div>
                </div>
                <h3 className="card-title">{t.pmse}</h3>
                <p className="card-desc">{t.pmseDesc}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="kategori-actions">
              <Link href="/login" className="back-button">
                {t.backButton}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t.modalTitle}</h3>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-icon">🚧</div>
              <p className="modal-message">{modalMessage}</p>
            </div>
            <div className="modal-footer">
              <button className="modal-button" onClick={closeModal}>
                {t.modalButton}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
