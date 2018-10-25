import {Resolve} from '@angular/router';
import {Injectable} from '@angular/core';
import {IndividusService} from './individus.service';


@Injectable()
export class IndividusResolver implements Resolve<any>{

  constructor(private individusService: IndividusService){}

  resolve(){
    return this.individusService.getAll();
  }
}
