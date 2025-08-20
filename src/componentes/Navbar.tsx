"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { navConfig } from "@/componentes/navConfig";

interface NavbarProps {
  role: "admin" | "organizador" | "jugador";
}

export default function Navbar({ role }: NavbarProps) {
  const router = useRouter();
  const menuItems = navConfig[role] || [];

  const handleLogout = () => {
    // Eliminar datos del localStorage
    localStorage.removeItem('userData');
    
    // Eliminar la cookie de token
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Redireccionar a la página de login
    router.push('/');
  };

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

        {/* Botón de logout */}
        <button 
          onClick={handleLogout}
          className="bg-yellow-500 text-black px-4 py-1 rounded-lg hover:bg-yellow-400 transition"
        >
          Cerrar sesión
        </button>
      </nav>
    </header>
  );
}
