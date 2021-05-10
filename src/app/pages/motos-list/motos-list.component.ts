import { Component, OnInit } from '@angular/core';
import { MotosService } from '../../services/motos.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-motos-list',
  templateUrl: './motos-list.component.html',
  styleUrls: ['./motos-list.component.scss']
})
export class MotosListComponent implements OnInit {
  userId: string;
  loading = false;

  constructor(public motosService: MotosService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('user');

    this.loading = true;
    this.motosService.getMotos(this.userId)
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
    return;
  }
}
