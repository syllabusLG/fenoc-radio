import {Individus} from './individus.model';

export class Salarie {
  constructor(public employeeId?: string,
              public employeeStatus?: string,
              public company_CD?: string,
              public spc?: string,
              public level_1?: string,
              public level_2?: string,
              public level_3?: string,
              public level_4?: string,
              public level_5?: string,
              public hireDate?: any,
              public departDate?: any,
              public lastHireDate?: any,
              public lastDepartDate?: any,
              public branch_CD?: string,
              public statut?: string,
              public vip?: string,
              public mySensitive?: string,
              public dateEndSensitive?: any,
              public individu?: Individus){}
}
