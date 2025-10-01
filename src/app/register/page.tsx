"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const user = { name, email, password };
    localStorage.setItem("user", JSON.stringify(user)); // simpan user ke localStorage
    alert("Registrasi berhasil! Silakan login.");
    router.push("/login");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <input
        type="text"
        placeholder="Nama"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full mb-3"
      />
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
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full">
        Register
      </button>
    </form>
  );
}
