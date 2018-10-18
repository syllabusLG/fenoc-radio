import {Resolve} from '@angular/router';
import {Injectable} from '@angular/core';
import {AdresseService} from './adresse.service';


@Injectable()
export class AdresseResolver implements Resolve<any>{

  constructor(private adresseService: AdresseService){}

  resolve(){
    return this.adresseService.getAll();
  }
}
