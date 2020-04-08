import {Individus} from './individus.model';

export class Salarie {
  constructor(public employeeId?: string,
              public employeeStatus?: string,
              public company_CD?: string,
              public hireDate?: any,
              public departDate?: any,
              public individu?: Individus){}

}
