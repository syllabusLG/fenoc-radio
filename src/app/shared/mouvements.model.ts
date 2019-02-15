import {Compte} from './compte.model';
import {Instruments} from './instruments.model';
import {Positions} from './position.model';

export class Mouvements {

  constructor(public numMouvement?: string,
              public sens?: string,
              public instruments?: Instruments,
              public quantiteInstrument?: number,
              public nav?: number,
              public pruInstrument?: number,
              public dateCompte?: any,
              public dateValeur?: any,
              public dateOperation?: any,
              public compte?: Compte,
              public position?: Positions,
              public idEntityMere?: string){}
}
