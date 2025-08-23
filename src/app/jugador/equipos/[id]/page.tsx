"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function EquipoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  const [equipo, setEquipo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const paramsUse = use(params);
  console.log(paramsUse)

  useEffect(() => {
    const fetchEquipo = async () => {
      try {
        const response = await fetch(`http://localhost:4000/equipos/${paramsUse.id}`);
        const data = await response.json();
        setEquipo(data);
      } catch (error) {
        console.error("Error fetching equipo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipo();
  }, [paramsUse.id]);

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

  if (!equipo) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Equipo no encontrado</h2>
          <button 
            onClick={() => router.push('/jugador/equipos')}
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Volver a equipos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <img 
              src={equipo.image || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop"} 
              alt={equipo.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-yellow-500"
            />
          </div>
          <div className="flex-grow">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{equipo.name}</h2>
            <p className="text-gray-600 mb-4">Capitán: {equipo.capitan?.name || "No especificado"}</p>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
              <p className="text-yellow-700">Este equipo está participando en {equipo.torneos?.length || 0} torneos.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700">Jugadores:</h3>
                <ul className="mt-2 space-y-2">
                  {equipo.players?.map((player: any) => (
                    <li key={player._id} className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                      <span>{player.name}</span>
                    </li>
                  )) || <li className="text-gray-500">No hay jugadores registrados</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex space-x-4">
          <button 
            onClick={() => router.push('/jugador/equipos')}
            className="bg-gray-500 hover:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}