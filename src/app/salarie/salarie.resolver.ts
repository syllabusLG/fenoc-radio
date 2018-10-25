import {Resolve} from '@angular/router';
import {Injectable} from '@angular/core';
import {SalarieService} from './salarie.service';


@Injectable()
export class SalarieResolver implements Resolve<any>{

  constructor(private salarieService: SalarieService){}

  resolve(){
    return this.salarieService.getAll();
  }
}
