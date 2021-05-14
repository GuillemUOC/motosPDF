import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MotoModel } from '../../models/moto.model';
import { TreatmentModel } from '../../models/treatment.model';
import { UserModel } from '../../models/user.model';
import { UsersService } from '../../services/users.service';
import { MotosService } from '../../services/motos.service';
import { TreatmentsService } from '../../services/treatments.service';
import { Commons } from '../../utils/commons.util';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent implements OnInit {
  user = new UserModel();
  moto = new MotoModel();
  treatment = new TreatmentModel();

  constructor(private router: Router, private route: ActivatedRoute, private usersService: UsersService,
              private motosService: MotosService, private treatmentsService: TreatmentsService,
              private commons: Commons) { }

  ngOnInit(): void {
    this.user.id = this.route.snapshot.paramMap.get('user');
    this.moto.id = this.route.snapshot.paramMap.get('moto');
    this.treatment.id = this.route.snapshot.paramMap.get('treatment');

    const loadingData = Promise.all([
      this.usersService.getUser(this.user.id),
      this.motosService.getMoto(this.moto.id),
      this.treatmentsService.getTreatment(this.treatment.id)
    ]);
    Swal.fire({
      title: 'Espere',
      text: 'Cargango datos para generar el PDF',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();
    this.commons.forceLast(loadingData)
      .then(([user, moto, treatment]) => {
        this.user = user;
        this.moto = moto;
        this.treatment = treatment;
        Swal.close();
      })
      .catch(() => {
        Swal.fire({
          title: 'Se ha producido un error',
          text: 'No se ha podido obtener la información para generar el PDF',
          icon: 'error',
          allowOutsideClick: false
        }).then(() => this.navBack());
      });
  }

  navBack(): any {
    this.router.navigate(['/treatmentsList', this.user.id, this.moto.id]);
  }
}
