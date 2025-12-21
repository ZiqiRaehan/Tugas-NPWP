"use client";

import KategoriRegister from "@/components/kategoriRegister/kategoriRegister";
import { useAuth } from "@/hooks/useAuth";

export default function KategoriRegisterPage() {
  useAuth();
  return <KategoriRegister />;
}
