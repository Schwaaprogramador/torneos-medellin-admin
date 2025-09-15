export const navConfig = {
    admin: [
      { label: "Dashboard", path: "/admin/dashboard" },
      { label: "Usuarios", path: "/admin/users" },
      { label: "Torneos", path: "/admin/tournaments" },
      { label: "Organizadores", path: "/admin/organizadores" },
    ],
    organizador: [
      { label: "Mis Torneos", path: "/organizador/torneos" },
      { label: "Crear Torneo", path: "/organizador/torneos/nuevo" },
      // Las noticias se crean desde el ID del torneo
      //{ label: "Crear Noticia", path: "/organizador/torneos/noticias/crear" },
    ],
    jugador: [
      { label: "Dashboard", path: "/jugador/dashboard" },
      { label: "Mis Equipos", path: "/jugador/equipos" },
      { label: "Buscar Equipo", path: "/jugador/equipos/search" },
      { label: "Torneos", path: "/jugador/torneos" },
      { label: "Equipos", path: "/jugador/equipos/accepted" },
    ],
  };
  