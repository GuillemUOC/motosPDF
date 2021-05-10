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
              private motosService: MotosService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.moto.user = this.route.snapshot.paramMap.get('user');

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
    console.log(this.form.value);

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
  }

}
