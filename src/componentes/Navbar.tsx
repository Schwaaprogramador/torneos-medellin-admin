"use client";
import Link from "next/link";
import { navConfig } from "@/componentes/navConfig";

interface NavbarProps {
  role: "admin" | "organizador" | "jugador";
}

export default function Navbar({ role }: NavbarProps) {
  const menuItems = navConfig[role] || [];

  return (
    <header className="bg-slate-800 text-white shadow-md">
      <nav className="max-w-7xl mx-auto flex items-center gap-6 px-6 py-3">
        {/* Logo o título */}
        <Link href="/" className="text-xl font-bold text-yellow-400">
          Torneos Medellín
        </Link>

        {/* Menú dinámico */}
        <div className="flex gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="hover:text-yellow-400 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Espaciador flexible */}
        <div className="flex-1" />

        {/* Botón de perfil o logout */}
        <button className="bg-yellow-500 text-black px-4 py-1 rounded-lg hover:bg-yellow-400 transition">
          Cerrar sesión
        </button>
      </nav>
    </header>
  );
}
