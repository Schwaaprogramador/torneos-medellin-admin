import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Ruta para la edición de equipos
  if (request.nextUrl.pathname.startsWith('/jugador/equipos/admin/')) {
    // La verificación real se hace en el componente CapitanGuard
    // Este middleware solo está aquí para futuras implementaciones de seguridad
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Configurar las rutas que usarán este middleware
export const config = {
  matcher: [
    '/jugador/equipos/admin/:path*',
  ],
};