import {Individus} from './individus.model';

export class Adresse {
  constructor(public numberStreet?: number,
              public street?: string,
              public additionalAdress_1?: string,
              public additionalAdress_2?: string,
              public additionalAdress_3?: string,
              public codePostal?: string,
              public city?: string,
              public country?: string,
              public individu?: Individus){}
}
