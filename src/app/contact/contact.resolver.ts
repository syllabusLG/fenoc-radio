import {Resolve} from '@angular/router';
import {Injectable} from '@angular/core';
import {ContactService} from './contact.service';


@Injectable()
export class ContactResolver implements Resolve<any>{

  constructor(private contactService: ContactService){}

  resolve(){
    return this.contactService.getAll();
  }
}
