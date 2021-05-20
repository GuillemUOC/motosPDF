import { Component, OnInit } from '@angular/core';
import { TreatmentModel } from '../../models/treatment.model';
import { FormUtils } from '../../utils/form.util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Commons } from '../../utils/commons.util';
import { TreatmentsService } from '../../services/treatments.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-treatment-form',
  templateUrl: './treatment-form.component.html',
  styleUrls: ['./treatment-form.component.scss']
})
export class TreatmentFormComponent implements OnInit {
  userId: string;
  treatment = new TreatmentModel();
  form: FormGroup;

  constructor(private formUtils: FormUtils, private fb: FormBuilder, private commons: Commons,
              private treatmentsService: TreatmentsService, private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('user');
    this.treatment.moto = this.route.snapshot.paramMap.get('moto');
    const id = this.route.snapshot.paramMap.get('treatment');

    if (id !== 'new') {
      Swal.fire({
        title: 'Espere',
        text: 'Cargango datos del tratamiento',
        icon: 'info',
        allowOutsideClick: false
      });
      Swal.showLoading();

      this.commons.forceLast(this.treatmentsService.getTreatment(id))
        .then((treatment: TreatmentModel) => {
          this.treatment = treatment ? treatment : this.treatment;
          this.createForm();
          Swal.close();
        })
        .catch(() => {
          Swal.fire({
            title: 'Se ha producido un error',
            text: 'No se ha podido obtener la información del tratamiento',
            icon: 'error',
            allowOutsideClick: false
          }).then(() => this.navBack());
        });
    }

    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      reason: [this.treatment.reason, Validators.required],
      comments: [this.treatment.comments],
      resolved: [this.treatment.resolved],
      resolution: [this.treatment.resolution, Validators.required]
    });
    this.manageResolutionDisabled();
  }

  saveForm(): void {
    if (this.form.invalid || this.form.pending) {
      Swal.fire({
        title: 'No se puede guardar',
        text: 'Rellene todos los campos correctamente',
        icon: 'warning',
        allowOutsideClick: false
      });
      this.formUtils.markFormAsTouched(this.form);
      return;
    }

    Swal.fire({
      title: 'Espere',
      text: this.treatment.id ? 'Guardando tratamiento' : 'Actualizado tratamiento',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    const formData = this.form.value;
    formData.resolution = formData.resolution || null;
    const treatment: TreatmentModel = { ...this.treatment, ...formData };
    const action = this.treatmentsService[this.treatment.id ? 'updateTreatment' : 'createTreatment'](treatment);
    this.commons.forceLast(action)
      .then(() => {
        Swal.fire({
          title: this.treatment.id ? 'Tratamiento actualizado' : 'Tratamiento guardado',
          text: 'La información del tratamiento se guardó correctamente',
          icon: 'success',
          allowOutsideClick: false
        }).then(() => this.navBack());
      }).catch(() => {
        Swal.fire({
          title: 'Se ha producido un error',
          text: 'Se ha producido un error al intentar guardar la información del tratamiento',
          icon: 'error',
          allowOutsideClick: false
        });
      });
  }

  manageResolutionDisabled(): void {
    this.form.get('resolution')[this.form.value.resolved ? 'enable' : 'disable']();
  }


  navBack(): any {
    this.router.navigate(['/treatmentsList', this.userId, this.treatment.moto]);
  }
}
