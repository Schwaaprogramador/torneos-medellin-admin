// middleware.js
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const AUTH_ROUTES = ["/admin", "/organizador", "/jugador"];
const JWT_SECRET = process.env.JWT_SECRET || 'arrozconpollo';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Verificar si la ruta está protegida
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      // Si no hay token -> redirigir al login
      console.log('No token found, redirecting to login');
      return NextResponse.redirect(new URL("/", req.url));
    }

    try {
      // Validar token con tu secret
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('Token verified successfully');

      // Si todo bien, continuar
      return NextResponse.next();
    } catch (err) {
      console.error("JWT inválido:", err);
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

// Configurar qué rutas aplicar
export const config = {
  matcher: ["/admin/:path*", "/organizador/:path*", "/jugador/:path*"],
};
