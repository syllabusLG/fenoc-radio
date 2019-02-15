import {Compte} from './compte.model';
import {Instruments} from './instruments.model';

export class Positions {

  constructor(public idPosition?: number,
              public instruments?: Instruments,
              public quantiteInstrument?: number,
              public pruInstrument?: number,
              public dateUpdate?: any,
              public compte?: Compte){}
}
