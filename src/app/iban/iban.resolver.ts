import {Resolve} from '@angular/router';
import {Injectable} from '@angular/core';
import {IbanService} from './iban.service';


@Injectable()
export class IbanResolver implements Resolve<any>{

  constructor(private ibanService: IbanService){}

  resolve(){
    return this.ibanService.getAll();
  }
}
