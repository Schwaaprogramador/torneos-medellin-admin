import Equipo from "./Equipo.interface";

interface Partido {
  _id: string;
  teamA: Equipo;
  teamB: Equipo;
  score: {
    teamA: number;
    teamB: number;
  };
};

export default Partido;