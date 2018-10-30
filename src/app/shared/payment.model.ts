import {Individus} from './individus.model';

export class Payment {
  constructor(public iban?: string,
              public bic?: string,
              public otherPayment?: string,
              public individu?: Individus){}
}
