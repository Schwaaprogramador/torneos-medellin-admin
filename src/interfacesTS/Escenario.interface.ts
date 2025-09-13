import Torneo from "./Torneo.interface";

interface Escenario {
    _id: string;
    name: string;
    direccion: string;
    torneos: Torneo[];
    image: string;
    public: boolean;
    createdAt: string;
    updatedAt: string;
}

export default Escenario;