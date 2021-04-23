import { Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Pipe({
  name: 'isInvalidControl',
  pure: false
})
export class IsInvalidControlPipe implements PipeTransform {

  transform(form: FormGroup | FormControl, field?: string, errorName?: string, checkDirty = false): boolean {
    const control = field ? form.get(field) : form;
    const invalid = errorName ? !!control.getError(errorName) : control.invalid;
    const modifiedControl = checkDirty ? control.dirty || control.touched : control.touched;
    return invalid && modifiedControl;
  }

}
