"use client";

import Navbar from "@/components/navbar/Navbar";
import { useAuth } from "@/hooks/useAuth";

export default function SettingsPage() {
    useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="p-6 pt-24">
                <h1 className="text-2xl font-bold mb-4">Dashboard Settings</h1>
                <p className="text-gray-600">Halaman pengaturan dashboard akan muncul di sini.</p>
            </div>
        </div>
    );
}
