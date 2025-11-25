"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import "./verif.css";

export default function VerifForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [language, setLanguage] = useState<"id" | "en">("id");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // API Base URL
  const API_BASE_URL = "https://api.mizstudio.my.id/api/auth";

  // Translations
  const translations = {
    id: {
      title: "Verifikasi Akun",
      subtitle: "Masukkan kode verifikasi yang telah dikirimkan ke email Anda.",
      codeLabel: "Kode Verifikasi",
      codePlaceholder: "Masukkan kode 6 digit",
      verifyButton: "Verifikasi",
      errorInvalidCode: "Kode verifikasi tidak valid.",
      errorCodeLength: "Kode verifikasi harus 6 digit.",
      successMessage: "Verifikasi berhasil! Anda sekarang dapat login.",
      backToLogin: "Kembali ke Halaman Login",
      errorNetwork: "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
      emailSentTo: "Kode verifikasi telah dikirim ke"
    },
    en: {
      title: "Account Verification",
      subtitle: "Enter the verification code sent to your email.",
      codeLabel: "Verification Code",
      codePlaceholder: "Enter 6-digit code",
      verifyButton: "Verify",
      errorInvalidCode: "Invalid verification code.",
      errorCodeLength: "Verification code must be 6 digits.",
      successMessage: "Verification successful! You can now login.",
      backToLogin: "Back to Login Page",
      errorNetwork: "Cannot connect to server. Check your internet connection.",
      emailSentTo: "Verification code sent to"
    }
  };

  const t = translations[language];

  useEffect(() => {
    // Ambil email dari query parameter atau sessionStorage
    const emailFromQuery = searchParams.get("email");
    const emailFromSession = sessionStorage.getItem("register_email");
    
    const userEmail = emailFromQuery || emailFromSession;
    
    if (!userEmail) {
      // Jika tidak ada email, redirect ke register
      router.push("/register");
      return;
    }
    
    setEmail(userEmail);
  }, [router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (verificationCode.length !== 6) {
      setError(t.errorCodeLength);
      return;
    }

    setLoading(true);
    try {
      // Call verify API
      const response = await fetch(`${API_BASE_URL}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          code: verificationCode, // Sesuai dengan Postman: "code" bukan "otp"
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Clear session storage
        sessionStorage.removeItem("register_email");
        
        // Show success message
        alert(data.message || t.successMessage);
        
        // Redirect to login
        router.push("/login");
      } else {
        // Handle error response from API
        setError(data.message || t.errorInvalidCode);
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError(t.errorNetwork);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verif-container">
      <div className="verif-card">
        {/* Left Side - Gradient Background */}
        <div className="verif-left">
          <div className="logo">✱</div>
          <div className="left-content">
            <p className="left-subtitle">{t.title}</p>
            <h1 className="left-title">{t.subtitle}</h1>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="verif-right">
          {/* Language Selector */}
          <div className="language-selector">
            <button
              type="button"
              className={language === "id" ? "active" : ""}
              onClick={() => setLanguage("id")}
              disabled={loading}
            >
              🇮🇩 ID
            </button>
            <button
              type="button"
              className={language === "en" ? "active" : ""}
              onClick={() => setLanguage("en")}
              disabled={loading}
            >
              🇺🇸 EN
            </button>
          </div>

          <form onSubmit={handleSubmit} className="verif-form">
            <div className="form-header">
              <div className="form-icon">✱</div>
              <h2>{t.title}</h2>
              <p className="form-subtitle">{t.subtitle}</p>
              {email && (
                <p className="email-info">
                  {t.emailSentTo}: <strong>{email}</strong>
                </p>
              )}
            </div>

            {/* Verification Code Input */}
            <div className="form-group">
              <label>{t.codeLabel}</label>
              <input
                type="text"
                maxLength={6}
                placeholder={t.codePlaceholder}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                required
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && <div className="error-message">{error}</div>}

            {/* Submit Button */}
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Loading..." : t.verifyButton}
            </button>

            {/* Login Link */}
            <p className="login-link">
              <Link href="/login">{t.backToLogin}</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}