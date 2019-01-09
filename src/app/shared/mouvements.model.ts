import {Compte} from './compte.model';

export class Mouvements {

  constructor(public numMouvement?: string,
              public sens?: string,
              public refInstrument?: string,
              public quantiteInstrument?: number,
              public nav?: string,
              public pruInstrument?: number,
              public dateCompte?: any,
              public dateValeur?: any,
              public dateOperation?: any,
              public compte?: Compte,
              public idEntityMere?: string){}
}
