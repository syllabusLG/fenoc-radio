import {Individus} from './individus.model';

export class Contact {
  constructor( public homePhone?: string,
               public businessPhone?: string,
               public cellPhone?: string,
               public personalEmail?: string,
               public businessEmail?: string,
               public individu?: Individus){}
}
