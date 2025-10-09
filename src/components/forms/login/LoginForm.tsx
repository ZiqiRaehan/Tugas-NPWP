"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./LoginForm.css";

export default function LoginForm() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState<"id" | "en">("id");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaCode, setCaptchaCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Translations
  const translations = {
    id: {
      title: "Masuk ke akun",
      subtitle: "Akses tugas, catatan, dan proyek Anda kapan saja, di mana saja - dan jaga semuanya tetap berjalan di satu tempat.",
      leftTitle: "Anda dapat dengan mudah",
      leftSubtitle: "Dapatkan akses hub pribadi Anda untuk kejelasan dan produktivitas",
      idLabel: "ID Pengguna",
      idPlaceholder: "Masukkan NIK atau Email",
      passwordLabel: "Kata Sandi",
      passwordPlaceholder: "Masukkan kata sandi Anda",
      captchaLabel: "Captcha",
      captchaPlaceholder: "Masukkan kode captcha",
      forgotPassword: "Lupa kata sandi?",
      loginButton: "Masuk",
      newUser: "Pengguna baru?",
      registerLink: "Daftar di sini",
      errorNoAccount: "Belum ada akun. Silakan register dulu.",
      errorInvalid: "NIK/Email atau kata sandi salah",
      errorCaptcha: "Kode captcha tidak valid"
    },
    en: {
      title: "Sign in to account",
      subtitle: "Access your tasks, notes, and projects anytime, anywhere - and keep everything flowing in one place.",
      leftTitle: "You can easily",
      leftSubtitle: "Get access your personal hub for clarity and productivity",
      idLabel: "User ID",
      idPlaceholder: "Enter NIK or Email",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      captchaLabel: "Captcha",
      captchaPlaceholder: "Enter captcha code",
      forgotPassword: "Forgot password?",
      loginButton: "Sign In",
      newUser: "New user?",
      registerLink: "Sign up here",
      errorNoAccount: "No account found. Please register first.",
      errorInvalid: "Invalid NIK/Email or password",
      errorCaptcha: "Invalid captcha code"
    }
  };

  const t = translations[language];

  // Generate captcha on mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate captcha
    if (captchaInput.toUpperCase() !== captchaCode) {
      setError(t.errorCaptcha);
      generateCaptcha();
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setError(t.errorNoAccount);
      return;
    }

    const user = JSON.parse(storedUser);

    // Auto-detect if input is email or NIK
    // Email contains @ symbol, NIK is numeric
    const isEmail = userId.includes("@");
    
    // Check if user ID matches either NIK or Email
    const isValid = 
      (isEmail && user.email === userId && user.password === password) ||
      (!isEmail && user.nik === userId && user.password === password);

    if (isValid) {
      localStorage.setItem("token", "dummy-token");
      router.push("/dashboard");
    } else {
      setError(t.errorInvalid);
      generateCaptcha();
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Left Side - Gradient Background */}
        <div className="login-left">
          <div className="logo">✱</div>
          <div className="left-content">
            <p className="left-subtitle">{t.leftTitle}</p>
            <h1 className="left-title">{t.leftSubtitle}</h1>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="login-right">
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

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-header">
            <div className="form-icon">✱</div>
            <h2>{t.title}</h2>
            <p className="form-subtitle">{t.subtitle}</p>
          </div>

          {/* User ID Input - NIK or Email */}
          <div className="form-group">
            <label>{t.idLabel}</label>
            <input
              type="text"
              placeholder={t.idPlaceholder}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
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

          {/* Forgot Password */}
          <div className="forgot-password">
            <Link href="/forgot-password">{t.forgotPassword}</Link>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            {t.loginButton}
          </button>

          {/* Register Link */}
          <p className="register-link">
            {t.newUser}{" "}
            <Link href="/kategoriRegister">{t.registerLink}</Link>
          </p>
        </form>
      </div>
      </div>
    </div>
  );
}
