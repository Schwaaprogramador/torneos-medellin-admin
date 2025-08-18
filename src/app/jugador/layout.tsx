// app/admin/layout.tsx
"use client";
import { ReactNode } from "react";
import Navbar from "@/componentes/Navbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar role="jugador" />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
