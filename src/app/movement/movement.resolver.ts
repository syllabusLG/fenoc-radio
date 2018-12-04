import {Resolve} from '@angular/router';
import {Injectable} from '@angular/core';
import {MovementService} from './movement.service';


@Injectable()
export class MovementResolver implements Resolve<any>{

  constructor(private movementService: MovementService){}

  resolve(){
    return this.movementService.getAll();
  }
}
