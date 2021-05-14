export class UserModel {
  id: string;
  dni: string;
  name: string;
  surname: string;
  phone: number;
  mail: string;
  timestamp: number;
  motos: number;

  constructor() {
    this.id = null;
    this.dni = null;
    this.name = null;
    this.surname = null;
    this.phone = null;
    this.mail = null;
    this.timestamp = new Date().getTime();
    this.motos = 0;
  }
}
