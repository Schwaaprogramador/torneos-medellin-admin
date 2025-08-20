'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface NuevoTorneo {
  name: string;
  format: 'elimination' | 'league' | 'mixed';
  maxTeams: number;
  image: string;
}

export default function NuevoTorneoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [torneo, setTorneo] = useState<NuevoTorneo>({
    name: '',
    format: 'elimination',
    maxTeams: 8,
    image: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!torneo.name.trim()) {
      setError('El nombre del torneo es obligatorio');
      setLoading(false);
      return;
    }

    try {
      // Llamada real a la API para crear el torneo
      const response = await fetch('http://localhost:4000/torneos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...torneo,
          // El organizerId se asignará en el backend usando el token
          status: 'inscripcion'
        }),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al crear el torneo');
      }
      
      // Redirigir a la lista de torneos
      router.push('/organizador/torneos');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al crear el torneo. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold text-yellow-400 mb-2">
          Crear Nuevo Torneo
        </h1>
        <p className="text-slate-200">
          Configura los detalles de tu nuevo torneo
        </p>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Torneo
            </label>
            <input
              type="text"
              id="name"
              value={torneo.name}
              onChange={(e) => setTorneo({ ...torneo, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Ej: Copa Primavera"
              required
            />
          </div>
          
          <div>
            <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-2">
              Formato del Torneo
            </label>
            <select
              id="format"
              value={torneo.format}
              onChange={(e) => setTorneo({ ...torneo, format: e.target.value as 'elimination' | 'league' | 'mixed' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              <option value="elimination">Eliminación Directa</option>
              <option value="league">Liga (Todos contra Todos)</option>
              <option value="mixed">Mixto (Grupos + Eliminación)</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="maxTeams" className="block text-sm font-medium text-gray-700 mb-2">
              Número Máximo de Equipos
            </label>
            <input
              type="number"
              id="maxTeams"
              value={torneo.maxTeams}
              onChange={(e) => setTorneo({ ...torneo, maxTeams: parseInt(e.target.value) })}
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
              value={torneo.image}
              onChange={(e) => setTorneo({ ...torneo, image: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-lg font-medium transition-colors flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Creando...' : 'Crear Torneo'}
            </button>
            
            <button
              type="button"
              onClick={() => router.push('/organizador/torneos')}
              className="bg-gray-500 hover:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
      
      {/* Información Adicional */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 Consejos para tu Torneo</h3>
        <ul className="text-blue-700 space-y-2 text-sm">
          <li>• Define claramente el formato y las reglas del torneo</li>
          <li>• Establece un número adecuado de equipos según el formato</li>
          <li>• Considera la duración total del torneo al planificar</li>
          <li>• Añade una imagen atractiva para promocionar tu torneo</li>
        </ul>
      </div>
    </div>
  );
}