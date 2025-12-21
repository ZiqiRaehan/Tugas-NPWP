"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./Navbar.css";

export default function Navbar() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Check if user is logged in
        const token = sessionStorage.getItem("token");
        const userData = sessionStorage.getItem("user");

        if (token && userData) {
            setIsLoggedIn(true);
            setUser(JSON.parse(userData));
        }

        // Handle navbar scroll effect
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);

        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        setIsLoggedIn(false);
        setUser(null);
        router.push("/login");
    };

    const getInitials = (email?: string) => {
        return email ? email.substring(0, 2).toUpperCase() : "U";
    };

    return (
        <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
            <div className="nav-content">
                <Link href="/" className="logo">
                    <span className="logo-icon">✱</span>
                    NPWP App
                </Link>

                <div className="nav-links">
                    {isLoggedIn ? (
                        <div className="user-info" ref={dropdownRef}>
                            <button
                                className="profile-trigger"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <span className="profile-name">Halo, {user?.name || user?.email?.split('@')[0]}</span>
                                <div className="profile-avatar">
                                    {getInitials(user?.email || user?.name)}
                                </div>
                            </button>

                            {isDropdownOpen && (
                                <div className="dropdown-menu">
                                    <Link href="/dashboard" className="dropdown-item">
                                        <span className="dropdown-icon">📊</span>
                                        Dashboard
                                    </Link>
                                    <Link href="/settings" className="dropdown-item">
                                        <span className="dropdown-icon">⚙️</span>
                                        Dashboard Setting
                                    </Link>
                                    <Link href="/profile" className="dropdown-item">
                                        <span className="dropdown-icon">👤</span>
                                        Profile Setting
                                    </Link>
                                    <Link href="/kategoriRegister" className="dropdown-item">
                                        <span className="dropdown-icon">📝</span>
                                        Buat NPWP
                                    </Link>
                                    <div className="dropdown-divider"></div>
                                    <button onClick={handleLogout} className="dropdown-item">
                                        <span className="dropdown-icon">🚪</span>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="nav-button-outline">
                                Masuk
                            </Link>
                            <Link href="/register" className="nav-button-primary">
                                Daftar
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
