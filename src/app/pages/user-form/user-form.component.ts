import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Commons } from '../../utils/commons.util';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from '../../models/user.model';
import { FormUtils } from '../../utils/form.util';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  user = new UserModel();
  form: FormGroup;

  constructor(private usersService: UsersService, private fb: FormBuilder,
              private formUtils: FormUtils, private commons: Commons,
              private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('user');

    if (id !== 'new') {
      Swal.fire({
        title: 'Espere',
        text: 'Cargango datos del usuario',
        icon: 'info',
        allowOutsideClick: false
      });
      Swal.showLoading();

      this.commons.forceLast(this.usersService.getUser(id))
        .then((user: UserModel) => {
          this.user = user;
          this.createForm();
          Swal.close();
        })
        .catch(() => {
          Swal.fire({
            title: 'Se ha producido un error',
            text: 'No se ha podido obtener la información del usuario',
            icon: 'error',
            allowOutsideClick: false
          }).then(() => this.navBack());
        });
    }

    this.createForm();
  }

  createForm(): void {
    this.form = this.fb.group({
      dni: [this.user.dni, Validators.required, this.validateDni.bind(this)],
      name: [this.user.name, Validators.required],
      surname: [this.user.surname, Validators.required],
      phone: [this.user.phone, [Validators.required, this.formUtils.validatePhone()]],
      mail: [this.user.mail, [Validators.required, this.formUtils.validateEmail()]]
    });
  }

  validateDni(control: FormControl): any {
    if (!control.value) {
      return Promise.resolve(null);
    }

    return new Promise(resolve => {
      this.commons.forceLast(this.usersService.isDniRepeated(control.value, this.user.id))
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
      text: this.user.id ? 'Guardando usuario' : 'Actualizado usuario',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    const formData = this.form.value;
    // tslint:disable-next-line: radix
    formData.phone = parseInt(formData.phone);
    const user: UserModel = { ...this.user, ...formData };
    const action = this.usersService[ this.user.id ? 'updateUser' : 'createUser'](user);
    this.commons.forceLast(action)
      .then(() => {
        Swal.fire({
          title: this.user.id ? 'Usuario actualizado' : 'Usuario guardado',
          text: 'La información del usuario se guardó correctamente',
          icon: 'success',
          allowOutsideClick: false
        }).then(() => {
          if (!this.user.id) {
            this.usersService.resetConfiguration();
          }
          this.navBack();
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

  navBack(): any {
    this.router.navigate(['/usersList']);
  }
}
