'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Torneo {
  _id: string;
  name: string;
  format: 'elimination' | 'league' | 'mixed';
  maxTeams: number;
  image: string;
  status: 'inscripcion' | 'fase_grupos' | 'fase_eliminacion' | 'finalizado';
  acceptedTeams: any[];
  requestTeams: any[];
  createdAt: string;
}

export default function OrganizadorTorneosPage() {
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTorneos = async () => {
      try {
        const response = await fetch('http://localhost:4000/torneos', {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Error al cargar los torneos');
        }

        const data = await response.json();
        setTorneos(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los torneos. Inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchTorneos();
  }, []);

  const getFormatName = (format: string) => {
    const formats = {
      elimination: 'Eliminación Directa',
      league: 'Liga',
      mixed: 'Mixto'
    };
    return formats[format as keyof typeof formats] || format;
  };

  const getStatusName = (status: string) => {
    const statuses = {
      inscripcion: 'Inscripción',
      fase_grupos: 'Fase de Grupos',
      fase_eliminacion: 'Fase de Eliminación',
      finalizado: 'Finalizado'
    };
    return statuses[status as keyof typeof statuses] || status;
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
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-6 text-white flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">
            Mis Torneos
          </h1>
          <p className="text-slate-200">
            Administra tus torneos y crea nuevos eventos
          </p>
        </div>
        <Link 
          href="/organizador/torneos/nuevo" 
          className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Crear Torneo
        </Link>
      </div>

      {/* Lista de Torneos */}
      {torneos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {torneos.map((torneo) => (
            <div key={torneo._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col">
              <div className="h-40 bg-gray-200 relative">
                {torneo.image ? (
                  <img 
                    src={torneo.image} 
                    alt={torneo.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-400 text-lg">Sin imagen</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  {getStatusName(torneo.status)}
                </div>
              </div>
              
              <div className="p-4 flex-grow">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{torneo.name}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Formato: {getFormatName(torneo.format)}</p>
                  <p>Equipos: {torneo.acceptedTeams.length}/{torneo.maxTeams}</p>
                  <p>Solicitudes pendientes: {torneo.requestTeams.length}</p>
                  <p>Creado: {new Date(torneo.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <Link 
                  href={`/organizador/torneos/${torneo._id}`}
                  className="block text-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors w-full"
                >
                  Administrar
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center border border-gray-200">
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-yellow-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-800 mb-2">No tienes torneos creados</h4>
          <p className="text-gray-500 mb-4">Comienza creando tu primer torneo</p>
          <Link 
            href="/organizador/torneos/nuevo"
            className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3 rounded-lg font-medium transition-colors text-lg"
          >
            Crear Mi Primer Torneo
          </Link>
        </div>
      )}

      {/* Mensaje de Error */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
  