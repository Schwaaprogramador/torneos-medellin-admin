"use client";
import { API_URL } from "@/configs/url";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Team {
  _id: string;
  name: string;
  image?: string;
  players: string[];
  createdAt: string;
}

interface Jugador {
  _id: string;
  name: string;
  email: string;
  image: string;
  type: "admin" | "jugador" | "organizador";
  myteams: Team[];
  points: number;
  createdAt: string;
}

export default function JugadorDashboardPage() {
  const [jugador, setJugador] = useState<Jugador | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        
        if (!userStr) {
          throw new Error('No user data found');
        }
        
        const user = JSON.parse(userStr);
        
        if (!user.id) {
          throw new Error('User ID not found');
        }

        const response = await fetch(`${API_URL}/usuarios/${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        console.log(data);
        setJugador({
          _id: data._id,
          name: data.name,
          email: data.email,
          image: data.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          type: data.type,
          myteams: data.myteams || [],
          points: data.points || 0,
          createdAt: data.createdAt
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Error al cargar los datos del jugador. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!jugador) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl text-gray-600">No se pudieron cargar los datos del jugador</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header del Dashboard */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold text-yellow-400 mb-2">
          Dashboard del Jugador
        </h1>
        <p className="text-slate-200">
          Bienvenido a tu panel de control personal
        </p>
      </div>

      {/* Información Principal del Jugador */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tarjeta de Perfil */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-yellow-400">
              <img
                src={jugador.image}
                alt={jugador.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">{jugador.name}</h2>
            <p className="text-gray-600 mb-3">{jugador.email}</p>
            <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
              {jugador.type.charAt(0).toUpperCase() + jugador.type.slice(1)}
            </span>
          </div>
        </div>

        {/* Tarjeta de Estadísticas */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Puntos Totales</span>
              <span className="text-2xl font-bold text-yellow-500">{jugador.points}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Equipos Creados</span>
              <span className="text-2xl font-bold text-blue-500">{jugador.myteams.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Miembro desde</span>
              <span className="text-sm text-gray-500">
                {new Date(jugador.createdAt).toLocaleDateString('es-ES')}
              </span>
            </div>
          </div>
        </div>

        {/* Tarjeta de Acciones Rápidas */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            <button 
              onClick={() => router.push('/jugador/equipos/nuevo')}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Crear Nuevo Equipo
            </button>
            <button 
              onClick={() => router.push('/jugador/equipos')}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Ver Mis Equipos
            </button>
            <button 
              onClick={() => router.push('/jugador/torneos')}
              className="w-full bg-blue-500 hover:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Buscar Torneos
            </button>
          </div>
        </div>
      </div>

      {/* Sección de Equipos */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Mis Equipos</h3>
          <button 
            onClick={() => router.push('/jugador/equipos/nuevo')}
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + Nuevo Equipo
          </button>
        </div>
        
        {jugador.myteams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jugador.myteams.map((equipo) => (
              <div key={equipo._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-yellow-400 transition-colors">
                <div className="flex items-center space-x-4">
                  {equipo.image ? (
                    <img 
                      src={equipo.image} 
                      alt={equipo.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center">
                      <span className="text-black font-bold text-xl">
                        {equipo.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-lg">{equipo.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-500">
                        {equipo.players.length} jugadores
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-500">
                        Creado el {new Date(equipo.createdAt).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">No tienes equipos aún</h4>
            <p className="text-gray-500 mb-4">Crea tu primer equipo para comenzar a participar en torneos</p>
            <button 
              onClick={() => router.push('/jugador/equipos/nuevo')}
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Crear Primer Equipo
            </button>
          </div>
        )}
      </div>

      {/* Sección de Actividad Reciente */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Actividad Reciente</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Te uniste al equipo "Los Tigres"</span>
            <span className="text-sm text-gray-400 ml-auto">Hace 2 días</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Ganaste 50 puntos en el torneo "Copa Primavera"</span>
            <span className="text-sm text-gray-400 ml-auto">Hace 1 semana</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600">Creaste el equipo "Los Halcones"</span>
            <span className="text-sm text-gray-400 ml-auto">Hace 2 semanas</span>
          </div>
        </div>
      </div>
    </div>
  );
}