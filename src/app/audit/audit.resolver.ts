import {Resolve} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuditService} from './audit.service';


@Injectable()
export class AuditResolver implements Resolve<any>{

  constructor(private auditService: AuditService){}

  resolve(){
    return this.auditService.getAll();
  }
}
