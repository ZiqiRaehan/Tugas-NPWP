"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = sessionStorage.getItem("token");
    const userData = sessionStorage.getItem("user");
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">✱ NPWP App</span>
            </div>
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  <span className="text-gray-700">Halo, {user?.email || user?.name}</span>
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/kategoriRegister"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Selamat Datang di <span className="text-blue-600">NPWP App</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Kelola tugas, catatan, dan proyek Anda dengan mudah. 
            Akses semua fitur produktivitas dalam satu platform yang terintegrasi.
          </p>
          
          {!isLoggedIn ? (
            <div className="flex gap-4 justify-center">
              <Link
                href="/kategoriRegister"
                className="px-8 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition shadow-lg"
              >
                Mulai Sekarang
              </Link>
              <Link
                href="/login"
                className="px-8 py-3 border-2 border-blue-600 text-blue-600 text-lg rounded-lg hover:bg-blue-50 transition"
              >
                Masuk
              </Link>
            </div>
          ) : (
            <div className="flex gap-4 justify-center">
              <Link
                href="/dashboard"
                className="px-8 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition shadow-lg"
              >
                Buka Dashboard
              </Link>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">Kelola Tugas</h3>
            <p className="text-gray-600">
              Atur dan kelola semua tugas Anda dengan mudah dan efisien
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Pantau Proyek</h3>
            <p className="text-gray-600">
              Lacak progress proyek dan kolaborasi dengan tim Anda
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Aman & Terpercaya</h3>
            <p className="text-gray-600">
              Data Anda dilindungi dengan sistem keamanan tingkat tinggi
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 NPWP App. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}