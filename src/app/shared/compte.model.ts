import {Individus} from './individus.model';

export class Compte {

  constructor(public numCompte?: string,
              public libCompte?: string,
              public type?: string,
              public ouvert?: string,
              public lettrage?: string,
              public statutAff?: string,
              public typage?: string,
              public idCptPc?: number,
              public typeCompte?: string,
              public individu?: Individus){}
}
