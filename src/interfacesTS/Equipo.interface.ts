interface Equipo {
  _id: string;  
  name: string;
  capitan: any; // Puede ser un objeto populado o un string ID
  image: string;
  public: boolean;
  players: any[]; // Puede ser un array de objetos populados o strings ID
  playersRequest: any[];
  torneos?: string[];
  createdAt: string;
}

export default Equipo;
