export default function UnauthorizedPage() {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-3xl font-bold text-red-600">Acceso denegado 🚫</h1>
        <p className="text-gray-600 mt-2">No tienes permisos para entrar aquí.</p>
      </div>
    );
  }
  