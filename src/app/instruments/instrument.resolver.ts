import {Resolve} from '@angular/router';
import {InstrumentService} from './instrument.service';
import {Injectable} from '@angular/core';
@Injectable()
export class InstrumentResolver implements Resolve<any>{

  constructor(private instrumentService: InstrumentService){}

  resolve(){
    return this.instrumentService.getAll();
  }
}
