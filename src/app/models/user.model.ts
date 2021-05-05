export class UserModel {
  id?: string;
  dni: string;
  name: string;
  surname: string;
  phone: number;
  mail: string;
  timestamp: number;
  motos: number;

  constructor() {
    this.timestamp = new Date().getTime();
    this.motos = 0;
  }
}
