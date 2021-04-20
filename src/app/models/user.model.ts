export class UserModel {
  id: string;
  dni: string;
  name: string;
  surname: string;
  phone: number;
  timestamp: Date;
  motos: [];

  constructor() {
    this.motos = [];
  }
}