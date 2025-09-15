'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/configs/url';
import Usuario from '@/interfacesTS/Usuario.interface';
import Equipo from '@/interfacesTS/Equipo.interface';

export default function EquiposAceptadosPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserTeams = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          router.push('/');
          return;
        }

        const user = JSON.parse(userData);
        const response = await fetch(`${API_URL}/usuarios/${user.id}`);
        
        if (!response.ok) {
          throw new Error('Error al obtener los equipos');
        }

        const data = await response.json();
        console.log(data)
        setUsuario(data);
      } catch (error) {
        console.error('Error:', error);
        setError('Error al cargar los equipos');
      } finally {
        setLoading(false);
      }
    };

    fetchUserTeams();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Mis Equipos</h1>
          <button
            onClick={() => router.push('/jugador/equipos')}
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Buscar Equipos
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {usuario?.teams && usuario.teams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {usuario.teams.map((equipo: Equipo) => (
              <div
                key={equipo._id}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={equipo.image || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=300&fit=crop"}
                    alt={equipo.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h2 className="text-white text-xl font-semibold">{equipo.name}</h2>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <img
                      src={equipo.capitan?.image || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=50&h=50&fit=crop"}
                      alt={equipo.capitan?.name || "Capitán"}
                      className="w-8 h-8 rounded-full object-cover border-2 border-yellow-500"
                    />
                    <span className="text-sm text-gray-600">
                      Capitán: {equipo.capitan?.name || "No especificado"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>{equipo.players?.length || 0} jugadores</span>
                    <span>{equipo.torneos?.length || 0} torneos</span>
                  </div>

                  <button
                    onClick={() => router.push(`/jugador/equipos/${equipo._id}`)}
                    className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg font-medium transition-colors"
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No estás en ningún equipo
            </h3>
            <p className="text-gray-600 mb-6">
              Únete a un equipo para participar en torneos y competir con otros jugadores
            </p>
            <button
              onClick={() => router.push('/jugador/equipos')}
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Explorar Equipos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}