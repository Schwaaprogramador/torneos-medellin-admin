'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/configs/url';

interface CapitanGuardProps {
  equipoId: string;
  children: ReactNode;
}

export default function CapitanGuard({ equipoId, children }: CapitanGuardProps) {
  const router = useRouter();
  const [isCapitan, setIsCapitan] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkCapitan = async () => {
      try {
        // Obtener información del usuario del localStorage
        const userData = localStorage.getItem('user');
        if (!userData) {
          router.push('/auth/login');
          return;
        }
        
        const user = JSON.parse(userData);
        
        // Verificar si el usuario es el capitán del equipo
        const response = await fetch(`${API_URL}/equipos/${equipoId}`);
        if (!response.ok) {
          router.push('/jugador/equipos');
          return;
        }
        
        const equipo = await response.json();
        
        // Comprobar si el usuario es el capitán
        const userIsCapitan = equipo.capitan === user.id || 
                             (equipo.capitan && equipo.capitan._id === user.id);
        
        setIsCapitan(userIsCapitan);
        
        if (!userIsCapitan) {
          router.push(`/jugador/equipos/${equipoId}`);
        }
      } catch (error) {
        console.error('Error al verificar capitán:', error);
        router.push('/jugador/equipos');
      } finally {
        setLoading(false);
      }
    };

    checkCapitan();
  }, [equipoId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return isCapitan ? <>{children}</> : null;
}