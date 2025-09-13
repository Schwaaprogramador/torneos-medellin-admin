import Equipo from "./Equipo.interface";

interface Jugador {
  _id: string;
  name: string;
  email: string;
  image: string;
  public: boolean;
  mytournaments: string[];
  type: "admin" | "jugador" | "organizador";
  myteams: Equipo[];
  points: number;
  updatedAt: string;
  createdAt: string;
}
export default Jugador;
