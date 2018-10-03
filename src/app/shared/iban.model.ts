import {Individus} from './individus.model';

export class Iban {
  constructor(public iban?: string,
              public bic?: string,
              public individu?: Individus){}
}
