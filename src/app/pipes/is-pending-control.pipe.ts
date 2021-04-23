import { Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Pipe({
  name: 'isPendingControl',
  pure: false
})
export class IsPendingControlPipe implements PipeTransform {

  transform(form: FormGroup | FormControl, field?: string, errorName?: string): boolean {
    const control = field ? form.get(field) : form;
    const invalid = errorName ? control.getError(errorName) === null : control.pending;
    return invalid && control.dirty;
  }

}
