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
    ],
    jugador: [
      { label: "Dashboard", path: "/jugador/dashboard" },
      { label: "Mis Equipos", path: "/jugador/equipos" },
      { label: "Unirme a Torneo", path: "/jugador/torneos" },
    ],
  };
  