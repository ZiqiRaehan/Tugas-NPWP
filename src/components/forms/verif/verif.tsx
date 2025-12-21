"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/config/api";
import "./verif.css";

export default function VerifForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [language, setLanguage] = useState<"id" | "en">("id");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  /* ================= TRANSLATION ================= */
  const translations = {
    id: {
      title: "Verifikasi Akun",
      subtitle: "Masukkan kode verifikasi yang telah dikirimkan ke email Anda.",
      codeLabel: "Kode Verifikasi",
      codePlaceholder: "Masukkan kode 6 digit",
      verifyButton: "Verifikasi",
      resendButton: "Kirim Ulang Kode",
      resendSuccess: "Kode verifikasi berhasil dikirim ulang.",
      errorInvalidCode: "Kode verifikasi tidak valid.",
      errorCodeLength: "Kode verifikasi harus 6 digit.",
      successMessage: "Verifikasi berhasil! Anda sekarang dapat login.",
      backToLogin: "Kembali ke Halaman Login",
      errorNetwork: "Tidak dapat terhubung ke server.",
      emailSentTo: "Kode verifikasi dikirim ke"
    },
    en: {
      title: "Account Verification",
      subtitle: "Enter the verification code sent to your email.",
      codeLabel: "Verification Code",
      codePlaceholder: "Enter 6-digit code",
      verifyButton: "Verify",
      resendButton: "Resend Code",
      resendSuccess: "Verification code resent successfully.",
      errorInvalidCode: "Invalid verification code.",
      errorCodeLength: "Verification code must be 6 digits.",
      successMessage: "Verification successful! You can now login.",
      backToLogin: "Back to Login Page",
      errorNetwork: "Cannot connect to server.",
      emailSentTo: "Verification code sent to"
    }
  };

  const t = translations[language];

  /* ================= GET EMAIL ================= */
  useEffect(() => {
    const emailFromQuery = searchParams.get("email");
    const emailFromSession = sessionStorage.getItem("register_email");
    const userEmail = emailFromQuery || emailFromSession;

    if (userEmail) {
      setEmail(userEmail);
    }
  }, [searchParams]);

  /* ================= VERIFY CODE ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email harus diisi");
      return;
    }

    if (verificationCode.length !== 6) {
      setError(t.errorCodeLength);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/auth/verif`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code: verificationCode
        })
      });

      const text = await response.text();
      const contentType = response.headers.get("content-type") || "";

      let data: any = null;
      if (contentType.includes("application/json")) {
        try {
          data = JSON.parse(text);
        } catch {
          data = null;
        }
      }

      if (response.ok) {
        sessionStorage.removeItem("register_email");
        alert(data?.message || t.successMessage);
        router.push("/login");
      } else {
        setError(data?.message || text || t.errorInvalidCode);
      }
    } catch (err) {
      console.error(err);
      setError(t.errorNetwork);
    } finally {
      setLoading(false);
    }
  };

  /* ================= RESEND CODE ================= */
  const handleResend = async () => {
    if (!email) {
      setError("Email diperlukan untuk mengirim ulang kode.");
      return;
    }

    setError("");
    setResendLoading(true);

    try {
      const response = await fetch(`/api/auth/resend-verif`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const text = await response.text();
      const contentType = response.headers.get("content-type") || "";

      let data: any = null;
      if (contentType.includes("application/json")) {
        try {
          data = JSON.parse(text);
        } catch {
          data = null;
        }
      }

      if (response.ok) {
        alert(data?.message || t.resendSuccess);
      } else {
        setError(data?.message || text || t.errorNetwork);
      }
    } catch (err) {
      console.error(err);
      setError(t.errorNetwork);
    } finally {
      setResendLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="verif-container">
      <div className="verif-card">
        <div className="verif-left">
          <div className="logo">✱</div>
          <div className="left-content">
            <p className="left-subtitle">{t.title}</p>
            <h1 className="left-title">{t.subtitle}</h1>
          </div>
        </div>

        <div className="verif-right">
          <div className="language-selector">
            <button
              type="button"
              className={language === "id" ? "active" : ""}
              onClick={() => setLanguage("id")}
              disabled={loading || resendLoading}
            >
              🇮🇩 ID
            </button>
            <button
              type="button"
              className={language === "en" ? "active" : ""}
              onClick={() => setLanguage("en")}
              disabled={loading || resendLoading}
            >
              🇺🇸 EN
            </button>
          </div>

          <form onSubmit={handleSubmit} className="verif-form">
            <div className="form-header">
              <div className="form-icon">✱</div>
              <h2>{t.title}</h2>
              <p className="form-subtitle">{t.subtitle}</p>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || resendLoading}
                required
              />
            </div>

            <div className="form-group">
              <label>{t.codeLabel}</label>
              <input
                type="text"
                maxLength={6}
                placeholder={t.codePlaceholder}
                value={verificationCode}
                onChange={(e) =>
                  setVerificationCode(e.target.value.replace(/\D/g, ""))
                }
                disabled={loading}
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? "Loading..." : t.verifyButton}
            </button>

            <button
              type="button"
              className="resend-button"
              onClick={handleResend}
              disabled={resendLoading}
            >
              {resendLoading ? "Loading..." : t.resendButton}
            </button>

            <p className="login-link">
              <Link href="/login">{t.backToLogin}</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
