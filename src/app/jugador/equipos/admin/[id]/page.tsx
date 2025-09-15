'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { API_URL } from '@/configs/url';
import CapitanGuard from '@/componentes/CapitanGuard';
import Equipo from '@/interfacesTS/Equipo.interface';

export default function EditarEquipoPage({ params }: { params: Promise<{ id: string }> }) {
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const paramsUse = use(params);
  
  // Form state
  const [nombre, setNombre] = useState('');
  const [imagen, setImagen] = useState('');
  const [esPublico, setEsPublico] = useState(true);

  useEffect(() => {
    const fetchEquipo = async () => {
      try {
        const response = await fetch(`${API_URL}/equipos/${paramsUse.id}`);
        
        if (!response.ok) {
          throw new Error('No se pudo obtener la información del equipo');
        }
        
        const data = await response.json();
        setEquipo(data);
        
        // Inicializar el formulario con los datos del equipo
        setNombre(data.name);
        setImagen(data.image || '');
        setEsPublico(data.public);
      } catch (error) {
        console.error('Error al obtener equipo:', error);
        setError('No se pudo cargar la información del equipo');
      } finally {
        setLoading(false);
      }
    };


    fetchEquipo();
  }, [paramsUse.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Obtener el token del usuario
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('Usuario no autenticado');
      }
      
      const user = JSON.parse(userData);
      
      const response = await fetch(`${API_URL}/equipos/${paramsUse.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: nombre,
          image: imagen,
          public: esPublico,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el equipo');
      }
      
      const updatedEquipo = await response.json();
      setEquipo(updatedEquipo);
      setSuccess('Equipo actualizado correctamente');
      
      // Limpiar el mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error: any) {
      console.error('Error al actualizar equipo:', error);
      setError(error.message || 'Error al actualizar el equipo');
    } finally {
      setSaving(false);
    }
  };

  
  
  const handleAcceptPlayer = async (playerId: string) => {
          try {
          const response = await fetch(`${API_URL}/equipos/accept`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: playerId,
              teamId: paramsUse.id,
            }),
          });
                    
          if (response.ok) {
            // Actualizar el estado del equipo
            const updatedTeam = await response.json();
            setEquipo(updatedTeam);
            setSuccess('Jugador aceptado correctamente');
          } else {
            throw new Error('Error al aceptar al jugador');
          }
        } catch (error) {
          setError('Error al procesar la solicitud');
        }
                }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-64 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CapitanGuard equipoId={paramsUse.id}>
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Equipo</h2>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <p className="text-green-700">{success}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Equipo
              </label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="imagen" className="block text-sm font-medium text-gray-700 mb-1">
                URL de la Imagen (opcional)
              </label>
              <input
                type="text"
                id="imagen"
                value={imagen}
                onChange={(e) => setImagen(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              
              {imagen && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Vista previa:</p>
                  <img 
                    src={imagen} 
                    alt="Vista previa" 
                    className="w-32 h-32 rounded-full object-cover border-2 border-yellow-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop";
                    }}
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={esPublico}
                  onChange={(e) => setEsPublico(e.target.checked)}
                  className="h-4 w-4 text-yellow-500 focus:ring-yellow-400 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Equipo público (visible para todos)</span>
              </label>
            </div>
            
            <div className="pt-4 flex space-x-4">
              <button
                type="submit"
                disabled={saving}
                className={`${saving ? 'bg-yellow-300' : 'bg-yellow-500 hover:bg-yellow-400'} text-black px-6 py-2 rounded-lg font-medium transition-colors`}
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              
              <button 
                type="button"
                onClick={() => router.push(`/jugador/equipos/${paramsUse.id}`)}
                className="bg-gray-500 hover:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
          
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Jugadores del Equipo</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {equipo?.players?.map((player, index) => (
  <div
    key={player._id ?? `player-${index}`}
    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
  >
    <img 
      src={player.image || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop"} 
      alt={player.name}
      className="w-10 h-10 rounded-full object-cover border border-gray-200"
    />
    <span className="text-gray-700">{player.name}</span>
  </div>
))}

            </div>
            
            {(!equipo?.players || equipo.players.length === 0) && (
              <p className="text-gray-500 italic">No hay jugadores en este equipo</p>
            )}
            {/* Nueva sección para solicitudes pendientes */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Solicitudes Pendientes</h3>
            
            <div className="flex gap-4">
              {equipo?.playersRequest?.map((player) => (
                <div key={player._id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={player.image || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop"} 
                      alt={player.name}
                      className="w-10 h-10 rounded-full object-cover border border-yellow-200"
                    />
                    <span className="text-gray-700 mx-2">{player.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAcceptPlayer(player._id)}
                      className="bg-green-500 hover:bg-green-400 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Aceptar
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const response = await fetch(`${API_URL}/equipos/${paramsUse.id}/reject-player/${player._id}`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            }
                          });
                          
                          if (response.ok) {
                            // Actualizar el estado del equipo
                            const updatedTeam = await response.json();
                            setEquipo(updatedTeam);
                            setSuccess('Jugador rechazado correctamente');
                          } else {
                            throw new Error('Error al rechazar al jugador');
                          }
                        } catch (error) {
                          setError('Error al procesar la solicitud');
                        }
                      }}
                      className="bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {(!equipo?.playersRequest || equipo.playersRequest.length === 0) && (
              <p className="text-gray-500 italic">No hay solicitudes pendientes</p>
            )}
          </div>
          </div>
        </div>
      </div>
    </CapitanGuard>
  );
}