"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";

export default function DashboardPage() {
  useAuth();
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-6 pt-24">
        <h1 className="text-2xl font-bold mb-4">Selamat datang di Dashboard 🎉</h1>
        <p>Anda berhasil login tanpa API (pakai sessionStorage).</p>
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}