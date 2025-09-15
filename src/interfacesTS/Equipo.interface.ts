import Usuario from "./Usuario.interface";

interface Equipo {
  _id: string;  
  name: string;
  capitan: Usuario; // Puede ser un objeto populado o un string ID
  image: string;
  public: boolean;
  players: Usuario[]; // Puede ser un array de objetos populados o strings ID
  playersRequest: Usuario[];
  torneos?: string[];
  createdAt: string;
}

export default Equipo;
