import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Commons } from '../../utils/commons.util';
import { TreatmentModel } from '../../models/treatment.model';
import { TreatmentsService } from '../../services/treatments.service';

@Component({
  selector: 'app-treatments-list',
  templateUrl: './treatments-list.component.html',
  styleUrls: ['./treatments-list.component.scss']
})
export class TreatmentsListComponent implements OnInit {
  public treatments: TreatmentModel[] = [];
  userId: string;
  motoId: string;
  loading = false;

  constructor(public treatmentsService: TreatmentsService, private route: ActivatedRoute,
              private commons: Commons, private router: Router) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('user');
    this.motoId = this.route.snapshot.paramMap.get('moto');

    this.loading = true;
    this.treatmentsService.getTreatments(this.motoId)
      .then(treatments => this.treatments = treatments)
      .catch(() => {
        this.loading = false;
        Swal.fire({
          title: 'Se ha producido un error',
          text: 'No se ha podido descargar el listado de tratamientos',
          icon: 'error',
          allowOutsideClick: false
        });
      })
      .finally(() => this.loading = false);
  }

  async deleteTreatment(id: string): Promise<void> {
    const result = await Swal.fire({
      title: '¿Está seguro?',
      text: 'El tratamiento se eliminará de la base de datos',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    });

    if (result.isDismissed) {
      return;
    }

    Swal.fire({
      title: 'Espere',
      text: 'Eliminando tratamiento',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    this.commons.forceLast(this.treatmentsService.deleteTreatment(id))
      .then(() => {
        this.treatments.splice(this.treatments.findIndex(moto => moto.id === id), 1);
        Swal.fire({
          title: 'Tratamiento eliminado',
          text: 'El tratamiento se eliminó correctamente',
          icon: 'success',
          allowOutsideClick: false
        });
      }).catch(() => {
        Swal.fire({
          title: 'Se ha producido un error',
          text: 'No se ha podido eliminar el tratamiento',
          icon: 'error',
          allowOutsideClick: false
        });
      });
  }

  navBack(): any {
    this.router.navigate(['/motosList', this.userId]);
  }
}
