import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Pipe({
  name: 'isPendingControl',
  pure: false
})
export class IsPendingControlPipe implements PipeTransform {

  transform(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return  control.pending;
  }


}
