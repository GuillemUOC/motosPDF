import { Pipe, PipeTransform } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Pipe({
  name: 'isPendingControl',
  pure: false
})
export class IsPendingControlPipe implements PipeTransform {

  transform(form: FormGroup | FormControl, field?: string, errorName?: string): boolean {
    const control = field ? form.get(field) : form;
    return errorName ?
      control.getError(errorName) === null :
      control.pending;
  }


}
