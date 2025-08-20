"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NuevoEquipoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    image: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.name.trim()) {
      setError("El nombre del equipo es obligatorio");
      setLoading(false);
      return;
    }

    try {
      // Obtener el ID del usuario del localStorage
      const userData = localStorage.getItem("userData");
      const userId = userData ? JSON.parse(userData)._id : null;

      if (!userId) {
        setError("No se pudo obtener la información del usuario");
        setLoading(false);
        return;
      }

      // Crear el objeto de equipo para enviar al backend
      const equipoData = {
        name: formData.name,
        image: formData.image || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop",
        capitan: userId,
        players: [userId],
        userId: userId // Campo necesario para el backend según equipos.service.js
      };

      // Enviar la solicitud al backend
      const response = await fetch("http://localhost:4000/equipos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(equipoData),
        credentials: "include"
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el equipo");
      }

      // Redireccionar a la página de equipos
      router.push("/jugador/equipos");
      router.refresh();
    } catch (error: any) {
      setError(error.message || "Error al crear el equipo");
      console.error("Error al crear equipo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold text-yellow-400 mb-2">
          Crear Nuevo Equipo
        </h1>
        <p className="text-slate-200">
          Completa el formulario para crear tu nuevo equipo
        </p>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Equipo *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Ej: Los Tigres"
              required
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              URL de la Imagen (opcional)
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Si no proporcionas una imagen, se usará una imagen predeterminada.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className={`${loading ? 'bg-yellow-300' : 'bg-yellow-500 hover:bg-yellow-400'} text-black px-6 py-2 rounded-lg font-medium transition-colors flex items-center`}
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Creando...' : 'Crear Equipo'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-500 hover:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <h3 className="text-lg font-medium text-blue-800 mb-2">¿Qué sigue después de crear tu equipo?</h3>
        <ul className="list-disc list-inside text-blue-700 space-y-1">
          <li>Podrás invitar jugadores a unirse a tu equipo</li>
          <li>Inscribir tu equipo en torneos disponibles</li>
          <li>Gestionar la alineación y estrategia de tu equipo</li>
        </ul>
      </div>
    </div>
  );
}