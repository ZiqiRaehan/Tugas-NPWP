"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setError("Belum ada akun. Silakan register dulu.");
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.email === email && user.password === password) {
      localStorage.setItem("token", "dummy-token");
      router.push("/dashboard");
    } else {
      setError("Email atau password salah");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full mb-3"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full mb-3"
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-3">
        Login
      </button>
      
      {/* Tambahan link ke Register */}
      <p className="text-sm text-gray-600 text-center">
        Belum punya akun?{" "}
        <Link href="/register" className="text-blue-500 underline">
          Daftar di sini
        </Link>
      </p>
    </form>
  );
}
