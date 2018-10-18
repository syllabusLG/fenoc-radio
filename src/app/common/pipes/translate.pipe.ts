import { Pipe, PipeTransform } from '@angular/core';
import {Resources} from "../i18n/resources";

@Pipe({name: 'translate'})
export class TranslatePipe implements PipeTransform {
  transform(value: string): string {
    let trans = this.getTranslations()[value];
    return (trans)? trans : value;
  }

  private getTranslations(): any {
    return Resources.getResources();
  }
}
