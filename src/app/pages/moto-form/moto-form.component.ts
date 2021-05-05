import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MotoModel } from '../../models/moto.model';
import { FormUtils } from '../../utils/form.util';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-moto-form',
  templateUrl: './moto-form.component.html',
  styleUrls: ['./moto-form.component.scss']
})
export class MotoFormComponent implements OnInit {
  moto = new MotoModel();
  form: FormGroup;

  constructor(private formUtils: FormUtils, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      registration: [this.moto.registration, [Validators.required]],
      kilometers: [this.moto.kilometers, [this.formUtils.validateOnlyIntegers()]],
      model: [this.moto.model, [Validators.required]],
      brand: [this.moto.brand, [Validators.required]]
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
