import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { MotoModel } from '../../models/moto.model';
import Swal from 'sweetalert2';
import { Commons } from '../../utils/commons.util';
import { MotosService } from '../../services/motos.service';
import { FormUtils } from '../../utils/form.util';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-moto-form',
  templateUrl: './moto-form.component.html',
  styleUrls: ['./moto-form.component.scss']
})
export class MotoFormComponent implements OnInit {
  moto = new MotoModel();
  form: FormGroup;

  constructor(private formUtils: FormUtils, private fb: FormBuilder, private commons: Commons,
              private motosService: MotosService, private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.moto.user = this.route.snapshot.paramMap.get('user');
    const id = this.route.snapshot.paramMap.get('moto');

    if (id !== 'new') {
      Swal.fire({
        title: 'Espere',
        text: 'Cargango datos de la moto',
        icon: 'info',
        allowOutsideClick: false
      });
      Swal.showLoading();

      this.commons.forceLast(this.motosService.getMoto(id))
        .then((moto: MotoModel) => {
          this.moto = moto ? moto : this.moto;
          this.createForm();
          Swal.close();
        })
        .catch(() => {
          Swal.fire({
            title: 'Se ha producido un error',
            text: 'No se ha podido obtener la información de la moto',
            icon: 'error',
            allowOutsideClick: false
          }).then(() => {
            this.router.navigate(['/motosList', this.moto.user]);
          });
        });
    }

    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      registration: [this.moto.registration, Validators.required, this.validateRegistration.bind(this)],
      kilometers: [this.moto.kilometers, this.formUtils.validateOnlyIntegers()],
      model: [this.moto.model, Validators.required],
      brand: [this.moto.brand, Validators.required]
    });
  }

  validateRegistration(control: FormControl): any {
    if (!control.value) {
      return Promise.resolve(null);
    }

    return new Promise(resolve => {
      this.commons.forceLast(this.motosService.isRegistrationRepeated(control.value, this.moto.user, this.moto.id))
        .then(repeated => resolve(repeated ? { repeated } : null))
        .catch(() => resolve(null));
    });
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
      text: this.moto.id ? 'Guardando moto' : 'Actualizado moto',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    const formData = this.form.value;
    // tslint:disable-next-line: radix
    // formData.kilometers = parseInt(formData.kilometers);
    const moto: MotoModel = { ...this.moto, ...formData };
    const action = this.moto.id ?
      this.motosService.updateMoto.bind(this.motosService, moto) :
      this.motosService.createMoto.bind(this.motosService, moto);

    this.commons.forceLast(action())
      .then(() => {
        Swal.fire({
          title: this.moto.id ? 'Moto actualizada' : 'Moto guardada',
          text: 'La información de la moto se guardó correctamente',
          icon: 'success',
          allowOutsideClick: false
        }).then(() => {
          this.router.navigate(['/motosList', moto.user]);
        });
      }).catch(() => {
        Swal.fire({
          title: 'Se ha producido un error',
          text: 'Se ha producido un error al intentar guardar la información de la moto',
          icon: 'error',
          allowOutsideClick: false
        });
      });
  }

  navBack(): any {
    this.router.navigate(['/motosList', this.moto.user]);
  }
}
