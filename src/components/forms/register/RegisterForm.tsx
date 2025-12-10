"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "@/config/api";
import "./RegisterForm.css";

export default function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [language, setLanguage] = useState<"id" | "en">("id");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  // API Base URL
  // const API_BASE_URL = "https://api.mizstudio.my.id/api/auth";

  // Translations
  const translations = {
    id: {
      title: "Buat akun baru",
      subtitle: "Daftar sekarang untuk mengakses semua fitur dan mulai mengelola tugas, catatan, dan proyek Anda.",
      leftTitle: "Bergabunglah dengan kami",
      leftSubtitle: "Mulai perjalanan produktivitas Anda hari ini",
      emailLabel: "Email",
      emailPlaceholder: "Masukkan alamat email Anda",
      passwordLabel: "Kata Sandi",
      passwordPlaceholder: "Buat kata sandi yang kuat",
      confirmPasswordLabel: "Konfirmasi Kata Sandi",
      confirmPasswordPlaceholder: "Ulangi kata sandi",
      captchaLabel: "Captcha",
      captchaPlaceholder: "Masukkan kode captcha",
      registerButton: "Daftar",
      alreadyHaveAccount: "Sudah punya akun?",
      loginLink: "Masuk di sini",
      errorPasswordMismatch: "Kata sandi tidak cocok",
      errorEmailInvalid: "Format email tidak valid",
      errorPasswordLength: "Kata sandi minimal 6 karakter",
      errorAllFields: "Semua field harus diisi",
      successMessage: "Registrasi berhasil! Silakan cek email untuk verifikasi.",
      selectedKategori: "Kategori Terpilih",
      changeKategori: "Ubah",
      errorNetwork: "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
    },
    en: {
      title: "Create new account",
      subtitle: "Register now to access all features and start managing your tasks, notes, and projects.",
      leftTitle: "Join us today",
      leftSubtitle: "Start your productivity journey today",
      emailLabel: "Email",
      emailPlaceholder: "Enter your email address",
      passwordLabel: "Password",
      passwordPlaceholder: "Create a strong password",
      confirmPasswordLabel: "Confirm Password",
      confirmPasswordPlaceholder: "Re-enter password",
      captchaLabel: "Captcha",
      captchaPlaceholder: "Enter captcha code",
      registerButton: "Sign Up",
      alreadyHaveAccount: "Already have an account?",
      loginLink: "Sign in here",
      errorPasswordMismatch: "Passwords do not match",
      errorEmailInvalid: "Invalid email format",
      errorPasswordLength: "Password must be at least 6 characters",
      errorAllFields: "All fields are required",
      successMessage: "Registration successful! Please check your email for verification.",
      selectedKategori: "Selected Category",
      changeKategori: "Change",
      errorNetwork: "Cannot connect to server. Check your internet connection."
    }
  };

  const t = translations[language];





  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!email || !password || !confirmPassword) {
      setError(t.errorAllFields);
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError(t.errorEmailInvalid);
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(t.errorPasswordLength);
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError(t.errorPasswordMismatch);
      setLoading(false);
      return;
    }



    try {
      // Call register API
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store email for verification page
        sessionStorage.setItem("register_email", email);

        // Show success message
        alert(data.message || t.successMessage);

        // Redirect to verification page
        router.push(`/verif?email=${encodeURIComponent(email)}`);
      } else {
        // Handle error response from API
        setError(data.message || t.errorAllFields);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(t.errorNetwork);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        {/* Left Side - Gradient Background */}
        <div className="register-left">
          <div className="logo">✱</div>
          <div className="left-content">
            <p className="left-subtitle">{t.leftTitle}</p>
            <h1 className="left-title">{t.leftSubtitle}</h1>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="register-right">
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

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-header">
              <div className="form-icon">✱</div>
              <h2>{t.title}</h2>
              <p className="form-subtitle">{t.subtitle}</p>

            </div>

            {/* Email Input */}
            <div className="form-group">
              <label>{t.emailLabel}</label>
              <input
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label>{t.passwordLabel}</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label>{t.confirmPasswordLabel}</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t.confirmPasswordPlaceholder}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>



            {/* Error Message */}
            {error && <div className="error-message">{error}</div>}

            {/* Submit Button */}
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Loading..." : t.registerButton}
            </button>

            {/* Login Link */}
            <p className="login-link">
              {t.alreadyHaveAccount}{" "}
              <Link href="/login">{t.loginLink}</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}