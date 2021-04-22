import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Commons } from '../../utils/commons.util';
import { FormUtils } from '../../utils/form.util';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  form: FormGroup;

  constructor(private usersService: UsersService, private fb: FormBuilder, private formUtils: FormUtils,
              private commons: Commons, private route: Router) {
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm(): void {
    this.form = this.fb.group({
      dni: ['84392743P', Validators.required, this.validateDni.bind(this)],
      name: ['Marc', [Validators.required]],
      surname: ['Garcia Pop', [Validators.required]],
      phone: ['643204956', [Validators.required, this.formUtils.validatePhone()]],
      mail: ['margp@hotmail.com', [Validators.required, this.formUtils.validateEmail()]],
    });
  }

  validateDni(control: FormControl): any {
    if (!control.value) {
      return Promise.resolve(null);
    }

    return new Promise(resolve => {
      this.commons.forceLast(this.usersService.isDniRepeated(control.value))
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
      return;
    }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando usuario',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    const user = this.form.value;
    // tslint:disable-next-line: radix
    user.phone = parseInt(user.phone);

    this.commons.forceLast(this.usersService.createUser(user))
      .then(() => {
        Swal.fire({
          title: 'Usuario guardado',
          text: 'La información del usuario se guardó correctamente',
          icon: 'success',
          allowOutsideClick: false
        }).then(() => {
          this.usersService.filters = null;
          this.route.navigate(['/usersList']);
        });
      }).catch(() => {
        Swal.fire({
          title: 'Se ha producido un error',
          text: 'Se ha producido un error al intentar guardar la información del usuario',
          icon: 'error',
          allowOutsideClick: false
        });
      });
  }

}
