import { Component, OnInit } from '@angular/core';
import { MotosService } from '../../services/motos.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Commons } from '../../utils/commons.util';
import { MotoModel } from '../../models/moto.model';

@Component({
  selector: 'app-motos-list',
  templateUrl: './motos-list.component.html',
  styleUrls: ['./motos-list.component.scss']
})
export class MotosListComponent implements OnInit {
  public motos: MotoModel[] = [];
  userId: string;
  loading = false;

  constructor(public motosService: MotosService, private route: ActivatedRoute,
              private commons: Commons, private router: Router) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('user');

    this.loading = true;
    this.motosService.getMotos(this.userId)
      .then(motos => this.motos = motos)
      .catch(() => {
        this.loading = false;
        Swal.fire({
          title: 'Se ha producido un error',
          text: 'No se ha podido descargar el listado de motos',
          icon: 'error',
          allowOutsideClick: false
        });
      })
      .finally(() => this.loading = false);
  }

  async deleteMoto(id: string): Promise<void> {
    const result = await Swal.fire({
      title: '¿Está seguro?',
      text: 'La moto se eliminará de la base de datos',
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
      text: 'Eliminando moto',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    this.commons.forceLast(this.motosService.deleteMoto(id))
      .then(() => {
        this.motos.splice(this.motos.findIndex(moto => moto.id === id), 1);
        Swal.fire({
          title: 'Moto eliminada',
          text: 'La moto se eliminó correctamente',
          icon: 'success',
          allowOutsideClick: false
        });
      }).catch(() => {
        Swal.fire({
          title: 'Se ha producido un error',
          text: 'No se ha podido eliminar la moto',
          icon: 'error',
          allowOutsideClick: false
        });
      });
  }

  navBack(): any {
    this.router.navigate(['/usersList']);
  }
}
