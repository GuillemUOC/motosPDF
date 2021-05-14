export class TreatmentModel {
  id: string;
  reason: string;
  comments: string;
  resolved: boolean;
  resolution: string;
  timestamp: number;
  moto: string;

  constructor() {
    this.id = null;
    this.reason = null;
    this.comments = null;
    this.resolved = false;
    this.resolution = null;
    this.timestamp = new Date().getTime();
  }
}
