export interface User {
  id?: string;
  dni: string;
  name: string;
  surname: string;
  phone: number;
  mail: string;
  timestamp: Date;
  motos: [];
}
