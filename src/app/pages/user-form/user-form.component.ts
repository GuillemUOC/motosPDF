import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { FormUtils } from '../../utils/form.util';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  form: FormGroup;

  constructor(private usersService: UsersService, private fb: FormBuilder, private formUtils: FormUtils) {
    this.createForm();
  }

  ngOnInit(): void {
  }

  createForm(): void {
    this.form = this.fb.group({
      dni: [, [Validators.required, this.validateDni.bind(this)]],
      name: [, [Validators.required]],
      surname: [, [Validators.required]],
      phone: [, [Validators.required, this.formUtils.validatePhone()]],
      mail: [, [Validators.required, this.formUtils.validateEmail()]],
    });
  }

  // Promise<ErrorValidate>

  validateDni(control: FormControl): any {
    if (!control.value) {
      return Promise.resolve(null);
    }

    return new Promise(resolve => {
      this.usersService.isDniRepeated(control.value).then(repeated => {
        console.log(repeated);
        resolve({ repeated: repeated });
      })
    });
  }


  saveForm(): void {
    // console.log(this.form.get('pasatiempos'));

    if (this.form.invalid || this.form.pending) {
      this.formUtils.markFormAsTouched(this.form);
      return;
    }
  }


}
