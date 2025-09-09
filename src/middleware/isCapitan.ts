'use client';

import { NextRequest, NextResponse } from 'next/server';
import { API_URL } from '@/configs/url';

export async function isCapitan(req: NextRequest) {
  try {
    // Obtener el ID del equipo de la URL
    const pathname = req.nextUrl.pathname;
    const match = pathname.match(/\/jugador\/equipos\/admin\/([^\/]+)/);
    
    if (!match) {
      return NextResponse.redirect(new URL('/jugador/equipos', req.url));
    }
    
    const equipoId = match[1];
    
    // Obtener información del usuario del localStorage
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (!userData) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
      }
      
      const user = JSON.parse(userData);
      
      // Verificar si el usuario es el capitán del equipo
      const response = await fetch(`${API_URL}/equipos/${equipoId}`);
      if (!response.ok) {
        return NextResponse.redirect(new URL('/jugador/equipos', req.url));
      }
      
      const equipo = await response.json();
      
      // Comprobar si el usuario es el capitán
      const isUserCapitan = equipo.capitan === user.id || 
                           (equipo.capitan && equipo.capitan._id === user.id);
      
      if (!isUserCapitan) {
        return NextResponse.redirect(new URL(`/jugador/equipos/${equipoId}`, req.url));
      }
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error('Error en middleware isCapitan:', error);
    return NextResponse.redirect(new URL('/jugador/equipos', req.url));
  }
}