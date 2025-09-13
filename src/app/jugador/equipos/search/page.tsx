'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/configs/url';
import Equipo from '@/interfacesTS/Equipo.interface';

export default function EquiposSearchPage() {
  const router = useRouter();
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [filteredEquipos, setFilteredEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'players'>('name');

  // Cargar equipos públicos desde el backend
  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/equipos/public`);
        
        if (!response.ok) {
          throw new Error('Error al cargar los equipos');
        }
        
        const data = await response.json();
        setEquipos(data);
        setFilteredEquipos(data);
      } catch (err: any) {
        console.error('Error fetching teams:', err);
        setError(err.message || 'Error al cargar los equipos');
      } finally {
        setLoading(false);
      }
    };

    fetchEquipos();
  }, []);

  // Filtrar y ordenar equipos
  useEffect(() => {
    let filtered = equipos.filter(equipo =>
      equipo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Ordenar equipos
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'players':
          return (b.players?.length || 0) - (a.players?.length || 0);
        default:
          return 0;
      }
    });

    setFilteredEquipos(filtered);
  }, [equipos, searchTerm, sortBy]);

  const handleJoinRequest = async (equipoId: string) => {
    try {
      // Aquí implementarías la lógica para solicitar unirse al equipo
      // Por ahora solo mostramos un mensaje
      alert('Funcionalidad de solicitud de unión en desarrollo');
    } catch (err) {
      console.error('Error requesting to join team:', err);
      setError('Error al solicitar unirse al equipo');
    }
  };

  const handleViewTeam = (equipoId: string) => {
    router.push(`/jugador/equipos/${equipoId}`);
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
          Buscar Equipos
        </h1>
        <p className="text-slate-200">
          Explora equipos públicos y encuentra el que mejor se adapte a ti
        </p>
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Búsqueda */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Equipo
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Escribe el nombre del equipo..."
            />
          </div>

          {/* Ordenar por */}
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
              Ordenar por
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'createdAt' | 'players')}
              className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="name">Nombre</option>
              <option value="createdAt">Más Recientes</option>
              <option value="players">Más Jugadores</option>
            </select>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Mostrando {filteredEquipos.length} de {equipos.length} equipos públicos
          </p>
        </div>
      </div>

      {/* Lista de Equipos */}
      {filteredEquipos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipos.map((equipo) => (
            <div key={equipo._id} className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              {/* Imagen del Equipo */}
              <div className="h-48 bg-gradient-to-br from-yellow-400 to-yellow-500 relative">
                <img
                  src={equipo.image || "https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?w=150&h=150&fit=crop"}
                  alt={equipo.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?w=150&h=150&fit=crop";
                  }}
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                    {equipo.players?.length || 0} jugadores
                  </span>
                </div>
              </div>

              {/* Información del Equipo */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800">{equipo.name}</h3>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    Público
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Capitán: {equipo.capitan?.name || 'No asignado'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Creado: {new Date(equipo.createdAt).toLocaleDateString('es-ES')}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Jugadores: {equipo.players?.length || 0}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleViewTeam(equipo._id)}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                  >
                    Ver Detalles
                  </button>
                  <button 
                    onClick={() => handleJoinRequest(equipo._id)}
                    className="flex-1 bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                  >
                    Solicitar Unirse
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-800 mb-2">
            {searchTerm ? 'No se encontraron equipos' : 'No hay equipos públicos disponibles'}
          </h4>
          <p className="text-gray-500 mb-4">
            {searchTerm 
              ? `No hay equipos que coincidan con "${searchTerm}"`
              : 'Actualmente no hay equipos públicos para mostrar'
            }
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Limpiar Búsqueda
            </button>
          )}
        </div>
      )}

      {/* Información Adicional */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 Consejos para Encontrar Equipos</h3>
        <ul className="text-blue-700 space-y-2 text-sm">
          <li>• Usa el buscador para encontrar equipos por nombre</li>
          <li>• Revisa el número de jugadores para ver si hay cupos disponibles</li>
          <li>• Contacta al capitán antes de solicitar unirte</li>
          <li>• Los equipos más nuevos suelen estar más abiertos a nuevos miembros</li>
        </ul>
      </div>
    </div>
  );
}
