"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Escenario from "@/interfacesTS/Escenario.interface";
import { API_URL } from "@/configs/url";

type FormData = {
  tournamentId: string;
  escenarioId?: string;
  tittle: string;
  body: string;
  img?: string;
};

type FormErrors = {
  tittle?: string;
  body?: string;
};

export default function CrearNoticiaPage() {
  const router = useRouter();
  const { tournamentId } = useParams();
  const [loading, setLoading] = useState(false);
  const [escenarios, setEscenarios] = useState<Escenario[]>([]);
  const [formData, setFormData] = useState<FormData>({
    tournamentId: tournamentId as string,
    escenarioId: "",
    tittle: "",
    body: "",
    img: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const fetchEscenarios = async () => {
      try {
        const res = await fetch(`${API_URL}/escenarios`);
        if (!res.ok) throw new Error("Error al cargar escenarios");
        const data = await res.json();
        setEscenarios(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchEscenarios();
  }, []);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.tittle) {
      newErrors.tittle = "El título es requerido";
    }
    if (!formData.body) {
      newErrors.body = "El contenido es requerido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/noticias`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error al crear la noticia");

      router.push(`/organizador/torneos/${formData.tournamentId}`);
      router.refresh();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gray-800 px-6 py-4">
          <h2 className="text-2xl font-bold text-yellow-400">Crear Nueva Noticia</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="escenarioId" className="block text-sm font-medium text-gray-700">
              Escenario
            </label>
            <select
              id="escenarioId"
              name="escenarioId"
              value={formData.escenarioId}
              onChange={handleChange}
              className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            >
              <option value="">Selecciona un escenario</option>
              {escenarios.map((escenario) => (
                <option key={escenario._id} value={escenario._id}>
                  {escenario.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="tittle" className="block text-sm font-medium text-gray-700">
              Título
            </label>
            <input
              type="text"
              id="tittle"
              name="tittle"
              value={formData.tittle}
              onChange={handleChange}
              className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            />
            {errors.tittle && <p className="mt-1 text-sm text-red-600">{errors.tittle}</p>}
          </div>

          <div>
            <label htmlFor="body" className="block text-sm font-medium text-gray-700">
              Contenido
            </label>
            <textarea
              id="body"
              name="body"
              rows={4}
              value={formData.body}
              onChange={handleChange}
              className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            />
            {errors.body && <p className="mt-1 text-sm text-red-600">{errors.body}</p>}
          </div>

          <div>
            <label htmlFor="img" className="block text-sm font-medium text-gray-700">
              URL de la Imagen (Opcional)
            </label>
            <input
              type="text"
              id="img"
              name="img"
              value={formData.img}
              onChange={handleChange}
              className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-md font-medium hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creando..." : "Crear Noticia"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}