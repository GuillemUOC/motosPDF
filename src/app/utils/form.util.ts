import { Injectable } from '@angular/core';
import { FormGroup, FormArray, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormUtils {
  markFormAsTouched(formGroup: FormGroup | FormArray): void {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormAsTouched(control);
      }
      control.markAsTouched();
    });
  }

  // ....................................................................
  // GLOBAL VALIDATIONS
  // ....................................................................
  
  validatePhone(): any {
    return Validators.pattern('^\\d{9}$');
  }

  validateEmail(): any {
    return Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$');
  }
}
