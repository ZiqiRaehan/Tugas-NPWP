"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./RegisterForm.css";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [nik, setNik] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [language, setLanguage] = useState<"id" | "en">("id");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("");

  // Translations
  const translations = {
    id: {
      title: "Buat akun baru",
      subtitle: "Daftar sekarang untuk mengakses semua fitur dan mulai mengelola tugas, catatan, dan proyek Anda.",
      leftTitle: "Bergabunglah dengan kami",
      leftSubtitle: "Mulai perjalanan produktivitas Anda hari ini",
      nameLabel: "Nama Lengkap",
      namePlaceholder: "Masukkan nama lengkap Anda",
      nikLabel: "NIK",
      nikPlaceholder: "Masukkan 16 digit NIK",
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
      errorCaptcha: "Kode captcha tidak valid",
      errorNikInvalid: "NIK harus 16 digit angka",
      errorEmailInvalid: "Format email tidak valid",
      errorPasswordLength: "Kata sandi minimal 6 karakter",
      errorAllFields: "Semua field harus diisi",
      successMessage: "Registrasi berhasil! Silakan login.",
      selectedKategori: "Kategori Terpilih",
      changeKategori: "Ubah"
    },
    en: {
      title: "Create new account",
      subtitle: "Register now to access all features and start managing your tasks, notes, and projects.",
      leftTitle: "Join us today",
      leftSubtitle: "Start your productivity journey today",
      nameLabel: "Full Name",
      namePlaceholder: "Enter your full name",
      nikLabel: "NIK",
      nikPlaceholder: "Enter 16-digit NIK",
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
      errorCaptcha: "Invalid captcha code",
      errorNikInvalid: "NIK must be 16 digits",
      errorEmailInvalid: "Invalid email format",
      errorPasswordLength: "Password must be at least 6 characters",
      errorAllFields: "All fields are required",
      successMessage: "Registration successful! Please login.",
      selectedKategori: "Selected Category",
      changeKategori: "Change"
    }
  };

  const t = translations[language];

  // Get kategori display name
  const getKategoriName = (kategori: string) => {
    const kategoriNames = {
      perorangan: language === "id" ? "Perorangan" : "Individual",
      instansi: language === "id" ? "Instansi Pemerintah" : "Government Agency", 
      badan: language === "id" ? "Badan" : "Entity",
      pmse: language === "id" ? "Pemungut PPN PMSE Luar Negeri" : "Foreign PMSE VAT Collector"
    };
    return kategoriNames[kategori as keyof typeof kategoriNames] || kategori;
  };

  // Check if user has selected kategori, redirect if not
  useEffect(() => {
    const kategori = localStorage.getItem("selectedKategori");
    if (!kategori) {
      router.push("/kategoriRegister");
      return;
    }
    setSelectedKategori(kategori);
    generateCaptcha();
  }, [router]);

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput("");
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateNik = (nik: string) => {
    return /^\d{16}$/.test(nik);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate all fields are filled
    if (!name || !nik || !email || !password || !confirmPassword) {
      setError(t.errorAllFields);
      return;
    }

    // Validate NIK
    if (!validateNik(nik)) {
      setError(t.errorNikInvalid);
      return;
    }

    // Validate email
    if (!validateEmail(email)) {
      setError(t.errorEmailInvalid);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError(t.errorPasswordLength);
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      setError(t.errorPasswordMismatch);
      generateCaptcha();
      return;
    }

    // Validate captcha
    if (captchaInput.toUpperCase() !== captchaCode) {
      setError(t.errorCaptcha);
      generateCaptcha();
      return;
    }

    // Save user data
    const user = { name, nik, email, password };
    localStorage.setItem("user", JSON.stringify(user));
    
    alert(t.successMessage);
    router.push("/login");
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

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-header">
              <div className="form-icon">✱</div>
              <h2>{t.title}</h2>
              <p className="form-subtitle">{t.subtitle}</p>
              {selectedKategori && (
                <div className="selected-kategori">
                  <span className="kategori-label">{t.selectedKategori}:</span>
                  <span className="kategori-value">{getKategoriName(selectedKategori)}</span>
                  <Link href="/kategoriRegister" className="change-kategori-btn">
                    {t.changeKategori}
                  </Link>
                </div>
              )}
            </div>

            {/* Name Input */}
            <div className="form-group">
              <label>{t.nameLabel}</label>
              <input
                type="text"
                placeholder={t.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* NIK and Email Row */}
            <div className="form-row">
              {/* NIK Input */}
              <div className="form-group">
                <label>{t.nikLabel}</label>
                <input
                  type="text"
                  placeholder={t.nikPlaceholder}
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  maxLength={16}
                  required
                />
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
                />
              </div>
            </div>

            {/* Password Row */}
            <div className="form-row">
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
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
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
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>
            </div>

            {/* Captcha */}
            <div className="form-group">
              <label>{t.captchaLabel}</label>
              <div className="captcha-container">
                <div className="captcha-display">
                  <span className="captcha-code">{captchaCode}</span>
                  <button
                    type="button"
                    className="refresh-captcha"
                    onClick={generateCaptcha}
                    title="Refresh"
                  >
                    🔄
                  </button>
                </div>
                <input
                  type="text"
                  placeholder={t.captchaPlaceholder}
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && <div className="error-message">{error}</div>}

            {/* Submit Button */}
            <button type="submit" className="submit-button">
              {t.registerButton}
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

