"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Torneo {
  _id: string;
  name: string;
  organizerId: string;
  format: "elimination" | "league" | "mixed";
  maxTeams: number;
  image: string;
  status: "inscripcion" | "fase_grupos" | "fase_eliminacion" | "finalizado";
  acceptedTeams: any[];
  requestTeams: any[];
  createdAt: string;
}

interface Jugador {
  _id: string;
  name: string;
  email: string;
}

export default function JugadorTorneosPage() {
  const router = useRouter();
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [jugador, setJugador] = useState<Jugador | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTorneo, setNewTorneo] = useState({
    name: "",
    format: "elimination" as "elimination" | "league" | "mixed",
    maxTeams: 8,
    image: "",
    username: "" // Campo requerido por el middleware de admin
  });

  // Cargar torneos desde el backend
  useEffect(() => {
    const fetchTorneos = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/torneos');
        
        if (!response.ok) {
          throw new Error('Error al cargar los torneos');
        }
        
        const data = await response.json();
        setTorneos(data);
      } catch (err: any) {
        console.error('Error fetching torneos:', err);
        setError(err.message || 'Error al cargar los torneos');
      } finally {
        setLoading(false);
      }
    };

    fetchTorneos();
  }, []);

  const handleCreateTorneo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTorneo.name.trim() || !newTorneo.username.trim()) {
      setError('El nombre del torneo y el usuario administrador son obligatorios');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/torneos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTorneo.name,
          format: newTorneo.format,
          maxTeams: newTorneo.maxTeams,
          image: newTorneo.image,
          username: newTorneo.username,
          status: 'inscripcion'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al crear el torneo');
      }

      const nuevoTorneo = await response.json();
      setTorneos([...torneos, nuevoTorneo]);
      setNewTorneo({ 
        name: "", 
        format: "elimination", 
        maxTeams: 8, 
        image: "",
        username: ""
      });
      setShowCreateForm(false);
      setError(null);
    } catch (err: any) {
      console.error('Error creating tournament:', err);
      setError(err.message || 'Error al crear el torneo');
    } finally {
      setLoading(false);
    }
  };

  const handleInscribirEquipo = async (torneoId: string) => {
    try {
      // Aquí implementarías la lógica para inscribir un equipo
      // Por ahora solo mostramos un mensaje
      alert('Funcionalidad de inscripción de equipo en desarrollo');
    } catch (err) {
      console.error('Error inscribiendo equipo:', err);
      setError('Error al inscribir el equipo');
    }
  };

  if (loading && torneos.length === 0) {
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
          Torneos Disponibles
        </h1>
        <p className="text-slate-200">
          Explora y participa en los torneos activos con tu equipo
        </p>
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Formulario de Creación */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Crear Nuevo Torneo</h3>
          <form onSubmit={handleCreateTorneo} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Usuario Administrador *
              </label>
              <input
                type="text"
                id="username"
                value={newTorneo.username}
                onChange={(e) => setNewTorneo({ ...newTorneo, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Nombre de usuario del administrador"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Debe ser un usuario con perfil de administrador
              </p>
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Torneo *
              </label>
              <input
                type="text"
                id="name"
                value={newTorneo.name}
                onChange={(e) => setNewTorneo({ ...newTorneo, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="Ej: Copa Primavera"
                required
              />
            </div>
            <div>
              <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-2">
                Formato del Torneo *
              </label>
              <select
                id="format"
                value={newTorneo.format}
                onChange={(e) => setNewTorneo({ ...newTorneo, format: e.target.value as "elimination" | "league" | "mixed" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              >
                <option value="elimination">Eliminación Directa</option>
                <option value="league">Liga (Todos contra Todos)</option>
                <option value="mixed">Mixto (Grupos + Eliminación)</option>
              </select>
            </div>
            <div>
              <label htmlFor="maxTeams" className="block text-sm font-medium text-gray-700 mb-2">
                Número Máximo de Equipos *
              </label>
              <input
                type="number"
                id="maxTeams"
                value={newTorneo.maxTeams}
                onChange={(e) => setNewTorneo({ ...newTorneo, maxTeams: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                min="2"
                max="32"
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
                value={newTorneo.image}
                onChange={(e) => setNewTorneo({ ...newTorneo, image: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className={`bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-lg font-medium transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Creando...' : 'Crear Torneo'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-500 hover:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Torneos */}
      {torneos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {torneos.map((torneo) => (
            <div key={torneo._id} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              {/* Imagen del Torneo */}
              <div className="h-48 bg-gradient-to-br from-yellow-400 to-yellow-500 relative">
                <img
                  src={torneo.image || "https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?w=150&h=150&fit=crop"}
                  alt={torneo.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?w=150&h=150&fit=crop";
                  }}
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                    {torneo.acceptedTeams?.length || 0} equipos
                  </span>
                </div>
              </div>

              {/* Información del Torneo */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800">{torneo.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    torneo.status === 'inscripcion' ? 'bg-green-100 text-green-800' :
                    torneo.status === 'fase_grupos' ? 'bg-blue-100 text-blue-800' :
                    torneo.status === 'fase_eliminacion' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {torneo.status === 'inscripcion' ? 'Inscripción' :
                     torneo.status === 'fase_grupos' ? 'Fase de Grupos' :
                     torneo.status === 'fase_eliminacion' ? 'Eliminatorias' :
                     'Finalizado'}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Creado: {new Date(torneo.createdAt).toLocaleDateString('es-ES')}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Equipos: {(torneo.acceptedTeams?.length || 0)}/{torneo.maxTeams}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Formato: {
                      torneo.format === 'elimination' ? 'Eliminación Directa' :
                      torneo.format === 'league' ? 'Liga' : 'Mixto'
                    }
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex space-x-2">
                  <button 
                    onClick={() => router.push(`/jugador/torneos/${torneo._id}`)}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                  >
                    Ver Detalles
                  </button>
                  {torneo.status === 'inscripcion' && (
                    <button 
                      onClick={() => handleInscribirEquipo(torneo._id)}
                      className="flex-1 bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                    >
                      Inscribir Equipo
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-800 mb-2">No hay torneos disponibles</h4>
          <p className="text-gray-500 mb-4">Actualmente no hay torneos disponibles para inscripción</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3 rounded-lg font-medium transition-colors text-lg"
          >
            Crear Mi Primer Torneo
          </button>
        </div>
      )}

      {/* Información Adicional */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 Consejos para Torneos</h3>
        <ul className="text-blue-700 space-y-2 text-sm">
          <li>• Revisa los requisitos de cada torneo antes de inscribir a tu equipo</li>
          <li>• Asegúrate de tener suficientes jugadores para cumplir con el mínimo requerido</li>
          <li>• Mantente atento a las fechas de inicio y cierre de inscripciones</li>
          <li>• Participa en torneos para ganar puntos y mejorar el ranking de tu equipo</li>
        </ul>
      </div>
    </div>
  );
}