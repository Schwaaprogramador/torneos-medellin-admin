'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { API_URL } from '@/configs/url';

interface Torneo {
  _id: string;
  name: string;
  organizerId: string;
  format: 'elimination' | 'league' | 'mixed';
  maxTeams: number;
  image: string;
  status: 'inscripcion' | 'fase_grupos' | 'fase_eliminacion' | 'finalizado';
  acceptedTeams: any[];
  requestTeams: any[];
  createdAt: string;
  champion?: any;
  standings?: any[];
  eliminationBracket?: any;
}

interface Equipo {
  _id: string;
  name: string;
  logo?: string;
  players?: any[];
}

export default function TorneoDetallePage() {
  const params = useParams();
  const router = useRouter();
  const [torneo, setTorneo] = useState<Torneo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInscriptionForm, setShowInscriptionForm] = useState(false);
  const [inscriptionData, setInscriptionData] = useState({
    teamId: '',
    teamName: '',
    captainName: '',
    captainEmail: '',
    phoneNumber: ''
  });

  const torneoId = params.id as string;

  useEffect(() => {
    const fetchTorneo = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/torneos/${torneoId}`);
        
        if (!response.ok) {
          throw new Error('Torneo no encontrado');
        }
        
        const data = await response.json();
        setTorneo(data);
      } catch (err: any) {
        console.error('Error fetching tournament:', err);
        setError(err.message || 'Error al cargar el torneo');
      } finally {
        setLoading(false);
      }
    };

    if (torneoId) {
      fetchTorneo();
    }
  }, [torneoId]);

  const handleInscription = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inscriptionData.teamName.trim() || !inscriptionData.captainName.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/torneos/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tournamentId: torneoId,
          teamName: inscriptionData.teamName,
          captainName: inscriptionData.captainName,
          captainEmail: inscriptionData.captainEmail,
          phoneNumber: inscriptionData.phoneNumber
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al inscribir el equipo');
      }

      // Recargar el torneo para ver los cambios
      const updatedResponse = await fetch(`http://localhost:4000/torneos/${torneoId}`);
      const updatedData = await updatedResponse.json();
      setTorneo(updatedData);
      
      setShowInscriptionForm(false);
      setInscriptionData({
        teamId: '',
        teamName: '',
        captainName: '',
        captainEmail: '',
        phoneNumber: ''
      });
      setError(null);
      
      alert('¡Inscripción enviada exitosamente! El organizador revisará tu solicitud.');
    } catch (err: any) {
      console.error('Error inscribing team:', err);
      setError(err.message || 'Error al inscribir el equipo');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'inscripcion': return 'bg-green-100 text-green-800';
      case 'fase_grupos': return 'bg-blue-100 text-blue-800';
      case 'fase_eliminacion': return 'bg-purple-100 text-purple-800';
      case 'finalizado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'inscripcion': return 'Inscripción Abierta';
      case 'fase_grupos': return 'Fase de Grupos';
      case 'fase_eliminacion': return 'Eliminatorias';
      case 'finalizado': return 'Finalizado';
      default: return status;
    }
  };

  const getFormatText = (format: string) => {
    switch (format) {
      case 'elimination': return 'Eliminación Directa';
      case 'league': return 'Liga (Todos contra Todos)';
      case 'mixed': return 'Mixto (Grupos + Eliminación)';
      default: return format;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (error || !torneo) {
    return (
      <div className="space-y-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Torneo no encontrado'}
        </div>
        <button
          onClick={() => router.push('/jugador/torneos')}
          className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Volver a Torneos
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con imagen */}
      <div className="relative h-64 rounded-lg overflow-hidden">
        <img
          src={torneo.image || "https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?w=800&h=400&fit=crop"}
          alt={torneo.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?w=800&h=400&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-4xl font-bold text-yellow-400 mb-2">{torneo.name}</h1>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(torneo.status)}`}>
              {getStatusText(torneo.status)}
            </span>
            <span className="text-white text-sm">
              {torneo.acceptedTeams?.length || 0} / {torneo.maxTeams} equipos
            </span>
          </div>
        </div>
      </div>

      {/* Información Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Detalles del Torneo */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Información del Torneo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Formato</label>
                <p className="text-gray-800 font-medium">{getFormatText(torneo.format)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Capacidad</label>
                <p className="text-gray-800 font-medium">{torneo.maxTeams} equipos máximo</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Fecha de Creación</label>
                <p className="text-gray-800 font-medium">
                  {new Date(torneo.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Equipos Inscritos</label>
                <p className="text-gray-800 font-medium">
                  {torneo.acceptedTeams?.length || 0} equipos confirmados
                </p>
              </div>
            </div>
          </div>

          {/* Equipos Participantes */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Equipos Participantes</h2>
            {torneo.acceptedTeams && torneo.acceptedTeams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {torneo.acceptedTeams.map((equipo: any, index: number) => (
                  <div key={equipo._id || index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{equipo.name || `Equipo ${index + 1}`}</p>
                      <p className="text-sm text-gray-600">Confirmado</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-gray-500">Aún no hay equipos confirmados</p>
              </div>
            )}
          </div>

          {/* Solicitudes Pendientes */}
          {torneo.requestTeams && torneo.requestTeams.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Solicitudes Pendientes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {torneo.requestTeams.map((solicitud: any, index: number) => (
                  <div key={solicitud._id || index} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">?</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{solicitud.teamName || `Solicitud ${index + 1}`}</p>
                      <p className="text-sm text-gray-600">Pendiente de revisión</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Acciones */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Acciones</h3>
            <div className="space-y-3">
              {torneo.status === 'inscripcion' && (
                <button
                  onClick={() => setShowInscriptionForm(true)}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-3 rounded-lg font-medium transition-colors"
                >
                  Inscribir Mi Equipo
                </button>
              )}
              <button
                onClick={() => router.push('/jugador/torneos')}
                className="w-full bg-gray-500 hover:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors"
              >
                Volver a Torneos
              </button>
            </div>
          </div>

          {/* Estadísticas Rápidas */}
          <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Equipos Confirmados:</span>
                <span className="font-medium">{torneo.acceptedTeams?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Solicitudes Pendientes:</span>
                <span className="font-medium">{torneo.requestTeams?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cupos Disponibles:</span>
                <span className="font-medium">{torneo.maxTeams - (torneo.acceptedTeams?.length || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario de Inscripción Modal */}
      {showInscriptionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Inscribir Equipo</h3>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleInscription} className="space-y-4">
              <div>
                <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Equipo *
                </label>
                <input
                  type="text"
                  id="teamName"
                  value={inscriptionData.teamName}
                  onChange={(e) => setInscriptionData({ ...inscriptionData, teamName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Ej: Los Tigres"
                  required
                />
              </div>

              <div>
                <label htmlFor="captainName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Capitán *
                </label>
                <input
                  type="text"
                  id="captainName"
                  value={inscriptionData.captainName}
                  onChange={(e) => setInscriptionData({ ...inscriptionData, captainName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Tu nombre completo"
                  required
                />
              </div>

              <div>
                <label htmlFor="captainEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email del Capitán *
                </label>
                <input
                  type="email"
                  id="captainEmail"
                  value={inscriptionData.captainEmail}
                  onChange={(e) => setInscriptionData({ ...inscriptionData, captainEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono de Contacto *
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={inscriptionData.phoneNumber}
                  onChange={(e) => setInscriptionData({ ...inscriptionData, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="+57 300 123 4567"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Enviando...' : 'Enviar Inscripción'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowInscriptionForm(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
