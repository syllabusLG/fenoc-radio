import {Resolve} from '@angular/router';
import {PositionService} from './position.service';
import {Injectable} from '@angular/core';

@Injectable()
export class PositionResolver implements Resolve<any>{

  constructor(private positionService: PositionService){}

  resolve(){
    return this.positionService.getAll();
  }
}
