export class TreatmentModel {
  id?: string;
  reason?: string;
  comments?: string;
  resolved?: boolean;
  resolution?: string;
  timestamp?: number;
  moto?: string;

  constructor() {
    this.resolved = false;
    this.timestamp = new Date().getTime();
  }
}
