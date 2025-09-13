import Equipo from "./Equipo.interface";
import Escenario from "./Escenario.interface";
import Noticia from "./Noticia.interface";

interface Torneo {
  _id: string;
  name: string;
  organizerId: string;
  description: string;
  format: 'elimination' | 'league' | 'mixed';
  maxTeams: number;
  image: string;
  status: 'inscripcion' | 'fase_grupos' | 'fase_eliminacion' | 'finalizado';
  teams: Equipo[];
  noticias: Noticia[];
  requestTeams: Equipo[];
  createdAt: string;
  champion?: Equipo;
  standings?: {
    teamId: string;
    wins: number;
    losses: number;
    matchesPlayed: number;
  }[] | null;
  escenarios: Escenario[];
  eliminationBracket?: any;
}

export default Torneo;