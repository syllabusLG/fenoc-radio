import {Individus} from './individus.model';

export class Adresse {
  constructor(public id?: string,
              public numberStreet?: number,
              public street?: string,
              public additionalAdress_1?: string,
              public additionalAdress_2?: string,
              public additionalAdress_3?: string,
              public codePostal?: string,
              public city?: string,
              public country?: string,
              public nif?: string,
              public typeAdresse?: string,
              public individu?: Individus){}
}
