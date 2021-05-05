export class MotoModel {
  id?: string;
  registration: string;
  brand: string;
  model: string;
  kilometers: number;
  timestamp: number;
  treatments: number;

  constructor() {
    this.timestamp = new Date().getTime();
    this.treatments = 0;
  }
}
