"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "../../../configs/url";
import Link from "next/link";
import Equipo from "@/interfacesTS/Equipo.interface";

interface Jugador {
  id: string;
  name: string;
  email: string;
  type: string;
}

export default function JugadorEquiposPage() {
  const router = useRouter();
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [jugador, setJugador] = useState<Jugador | null>(null);
  const [loading, setLoading] = useState(true);


  // Obtener datos del usuario y sus equipos
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Obtener información del usuario del localStorage
        const userData = localStorage.getItem("user");
        if (!userData) {
          console.error("No se encontró información del usuario");
          setLoading(false);
          return;
        }

        const parsedData = JSON.parse(userData);
        setJugador(parsedData); // El objeto completo contiene id, name, etc.

        // Obtener los datos del usuario incluyendo myteams populado
        const response = await fetch(`${API_URL}/usuarios/${parsedData.id}`);
        if (!response.ok) {
          throw new Error("Error al obtener los datos del usuario");
        }
        const userData2 = await response.json();
        
        // Usar directamente myteams que ya viene populado desde el backend
        setEquipos(userData2.myteams || []);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);



  const handleDeleteEquipo = async (equipoId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este equipo?")) {
      try {
        const response = await fetch(`${API_URL}/equipos/${equipoId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setEquipos(equipos.filter((equipo) => equipo._id !== equipoId));
        } else {
          alert("Error al eliminar el equipo");
        }
      } catch (error) {
        console.error("Error al eliminar el equipo:", error);
        alert("Error al conectar con el servidor");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold text-yellow-400 mb-2">
          Mis Equipos
        </h1>
        <p className="text-slate-200">
          Gestiona tus equipos y crea nuevos para participar en torneos
        </p>
      </div>

      {/* Botón Crear Equipo */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Equipos ({equipos.length})
        </h2>
        <button
          onClick={() => router.push("/jugador/equipos/nuevo")}
          className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Crear Nuevo Equipo</span>
        </button>
      </div>



      {/* Lista de Equipos */}
      {equipos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipos.map((equipo) => (
            <div key={equipo._id} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              {/* Imagen del Equipo */}
              <div className="h-48 bg-gradient-to-br from-yellow-400 to-yellow-500 relative">
                <img
                  src={equipo.image}
                  alt={equipo.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                    {Array.isArray(equipo.players) ? equipo.players.length : 0} jugadores
                  </span>
                </div>
              </div>

              {/* Información del Equipo */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800">{equipo.name}</h3>
                  {(equipo.capitan === jugador?.id || (equipo.capitan && equipo.capitan._id === jugador?.id)) && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      Capitán
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Creado: {new Date(equipo.createdAt).toLocaleDateString('es-ES')}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Torneos: {equipo.torneos ? equipo.torneos.length : 0}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex space-x-2">
                  <Link href={`/jugador/equipos/${equipo._id}`} className="flex-1">
                    <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                      Ver Detalles
                    </button>
                  </Link>
                  {(equipo.capitan === jugador?.id || (equipo.capitan && equipo.capitan._id === jugador?.id)) && (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => router.push(`/jugador/equipos/admin/${equipo._id}`)}
                            className="bg-yellow-500 hover:bg-yellow-400 text-black py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteEquipo(equipo._id)}
                            className="bg-red-500 hover:bg-red-400 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Estado Vacío */
        <div className="bg-white rounded-lg shadow-lg p-12 text-center border border-gray-200">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">No tienes equipos aún</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Crea tu primer equipo para comenzar a participar en torneos. Los equipos te permiten unirte a competiciones y jugar junto a otros jugadores.
          </p>
          <button
            onClick={() => router.push("/jugador/equipos/nuevo")}
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3 rounded-lg font-medium transition-colors text-lg"
          >
            Crear Mi Primer Equipo
          </button>
        </div>
      )}

      {/* Información Adicional */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 Consejos para tu Equipo</h3>
        <ul className="text-blue-700 space-y-2 text-sm">
          <li>• Elige un nombre memorable y representativo para tu equipo</li>
          <li>• Invita a jugadores que complementen tus habilidades</li>
          <li>• Participa en torneos para ganar puntos y experiencia</li>
          <li>• Como capitán, puedes gestionar la composición del equipo</li>
        </ul>
      </div>
    </div>
  );
}
  