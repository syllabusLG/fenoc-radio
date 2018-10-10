import {Adresse} from './adresse.model';

export class Fiscalite {
  constructor(public nif?: string,
              public adresse?: Adresse){}
}
