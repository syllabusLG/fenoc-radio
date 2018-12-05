import {Compte} from './compte.model';

export class Positions {

  constructor(public idPosition?: string,
              public refInstrument?: string,
              public quantiteInstrument?: number,
              public pruInstrument?: string,
              public dateUpdate?: any,
              public compte?: Compte){}
}
