"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/configs/url";
import Torneo from "@/interfacesTS/Torneo.interface";

export default function TournamentDetailPage() {
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState<Torneo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const res = await fetch(`${API_URL}/torneos/${tournamentId}`);
        if (!res.ok) throw new Error("Error al cargar el torneo");
        const data = await res.json();
        setTournament(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [tournamentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
        <p className="text-xl text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
        <p className="text-xl text-red-600">{error || "Torneo no encontrado"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="bg-gray-800 rounded-t-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-yellow-400">{tournament.name}</h1>
          <p className="text-gray-300 mt-2">{tournament.description}</p>
        </div>

        {/* Información General */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Información General</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Formato: 
                  <span className="text-gray-800 font-medium ml-2">{tournament.format}</span>
                </p>
                <p className="text-gray-600">Estado: 
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 ml-2">
                    {tournament.status}
                  </span>
                </p>
                <p className="text-gray-600">Equipos Máximos: 
                  <span className="text-gray-800 font-medium ml-2">{tournament.maxTeams || "Sin límite"}</span>
                </p>
              </div>
              <div>
               
                <p className="text-gray-600">Fecha de Creación: 
                  <span className="text-gray-800 font-medium ml-2">
                    {new Date(tournament.createdAt).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Equipos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Equipos Participantes */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gray-800 px-6 py-4">
              <h2 className="text-xl font-bold text-yellow-400">Equipos Participantes</h2>
            </div>
            <div className="p-6">
              {tournament.teams.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {tournament.teams.map((team) => (
                    <li key={team._id} className="py-3">
                      <p className="text-gray-800">{team.name}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No hay equipos participantes aún</p>
              )}
            </div>
          </div>

          {/* Equipos Solicitantes */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gray-800 px-6 py-4">
              <h2 className="text-xl font-bold text-yellow-400">Solicitudes Pendientes</h2>
            </div>
            <div className="p-6">
              {tournament.requestTeams.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {tournament.requestTeams.map((team) => (
                    <li key={team._id} className="py-3 flex justify-between items-center">
                      <p className="text-gray-800">{team.name}</p>
                      <div className="space-x-2">
                        <button className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
                          Aceptar
                        </button>
                        <button className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
                          Rechazar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No hay solicitudes pendientes</p>
              )}
            </div>
          </div>
        </div>

        {/* Tabla de Posiciones (si es formato liga o mixto) */}
        {(tournament.format === "league" || tournament.format === "mixed") && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="bg-gray-800 px-6 py-4">
              <h2 className="text-xl font-bold text-yellow-400">Tabla de Posiciones</h2>
            </div>
            
          </div>
        )}

        {/* Campeón (si está finalizado) */}
        {tournament.status === "finalizado" && tournament.champion && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-yellow-500 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900">Campeón del Torneo</h2>
            </div>
            <div className="p-6 text-center">
              <p className="text-2xl font-bold text-gray-800">{tournament.champion.name}</p>
            </div>
          </div>
        )}

        
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
            <div className="bg-gray-800 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-yellow-400">Noticias del Torneo</h2>
              <Link 
                href={`/organizador/torneos/noticias/crear/${tournament._id}`}
                className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-md font-medium hover:bg-yellow-400 transition"
              >
                Crear Noticia
              </Link>
            </div>
            <div className="p-6">
              {tournament.noticias && tournament.noticias.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tournament.noticias.map((noticia) => (
                    <div key={noticia._id} className="border border-gray-200 rounded-lg overflow-hidden">
                      {noticia.img && (
                        <div 
                          className="h-48 bg-cover bg-center"
                          style={{ backgroundImage: `url(${noticia.img})` }}
                        />
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{noticia.tittle}</h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {new Date(noticia.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-gray-700 line-clamp-3">{noticia.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center">No hay noticias disponibles</p>
              )}
            </div>
          </div>
      </div>
    </div>
  );
}