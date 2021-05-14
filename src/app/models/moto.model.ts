export class MotoModel {
  id: string;
  registration: string;
  brand: string;
  model: string;
  kilometers: number;
  timestamp: number;
  treatments: number;
  user: string;

  constructor() {
    this.id = null;
    this.registration = null;
    this.brand = null;
    this.model = null;
    this.kilometers = null;
    this.timestamp = new Date().getTime();
    this.treatments = 0;
    this.user = null;
  }
}
