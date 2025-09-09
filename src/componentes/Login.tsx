'use client';

import { useState, FormEvent, JSX } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/configs/url";

export default function LoginPage(): JSX.Element {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${API_URL}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
        credentials: "include",
      });
      console.log(response.body)
      if (!response.ok) {
        throw new Error("Credenciales incorrectas");
      }

      const data: { id: string; email: string; type: string , name: string} =
        await response.json();
      
      // Guardamos en localStorage
      localStorage.setItem("user", JSON.stringify(data));

      // Redirección según rol
      switch (data.type) {
        case "admin":
          router.push("/admin/dashboard");
          break;
        case "organizador":
          router.push("/organizador/torneos");
          break;
        case "jugador":
          router.push("/jugador/dashboard");
          break;
        default:
          router.push("/");
          break;
      }
    } catch (err) {
      console.error(err);
      setError("Usuario o contraseña inválidos");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-slate-800 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-900 shadow-lg rounded-2xl border border-slate-700">
        <h2 className="text-2xl font-bold text-center text-yellow-400">
          Iniciar Sesión
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Usuario
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-black bg-yellow-500 rounded-lg hover:bg-yellow-400 transition"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </main>
  );
}
