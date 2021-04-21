import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getFormControl'
})
export class GetFormControlPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
