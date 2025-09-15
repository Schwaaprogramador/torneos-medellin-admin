
import Equipo from "./Equipo.interface";
import Torneo from "./Torneo.interface";


interface Usuario {
  _id: string;
  name: string;
  email: string;
  image: string;
  public: boolean;
  mytournaments: Torneo[];
  type: "admin" | "jugador" | "organizador";
  myteams: Equipo[];
  teams: Equipo[];
  points: number;
}

export default Usuario;