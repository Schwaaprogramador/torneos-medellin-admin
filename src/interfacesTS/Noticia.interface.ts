interface Noticia {
  _id: string;
  userId: string;
  tournamentId: string;
  escenarioId?: string;
  tittle: string;
  body: string;
  img?: string;
  createdAt: string;
  updatedAt: string;
};

export default Noticia;