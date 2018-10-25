import {Resolve} from '@angular/router';
import {Injectable} from '@angular/core';
import {CompteService} from "./compte.service";


@Injectable()
export class CompteResolver implements Resolve<any>{

  constructor(private competService: CompteService){}

  resolve(){
    return this.competService.getAll();
  }
}
