import {Resolve} from '@angular/router';
import {Injectable} from '@angular/core';
import {PaymentService} from './payment.service';


@Injectable()
export class PaymentResolver implements Resolve<any>{

  constructor(private ibanService: PaymentService){}

  resolve(){
    return this.ibanService.getAll();
  }
}
