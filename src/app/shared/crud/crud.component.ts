import {Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import { FormGroup} from '@angular/forms';

import { CrudService } from '../crud.service';
import { DataModel } from '../data.model';
import {Filemanagement} from "../../common/filemanagement";
import {CookieService} from 'ngx-cookie-service';
import {Audit} from '../audit.model';
import {AppService} from '../../app.service';
@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit {

  @ViewChild('content')
  content: ElementRef;

  @Input()
  title: string;

  @Input()
  data: any;

  @Input()
  service: CrudService;

  @Input()
  initItem: any;

  @Input()
  initForm: FormGroup;

  @Input()
  dataModelList: DataModel[];

  crudType = 'upload';

  typeOfReport: string = '';

  errors: any = {};

  constructor(private cookieService: CookieService,
              private appService: AppService){
  }

  ngOnInit(){
  }

  dataChanged($event){
    //this.data = this.data.concat($event);
  }

  handleErrors(allErrors: any = {}) {
    this.errors = allErrors;
  }

  public downloadPDF($event:any){
    let audit: Audit = new Audit();
    this.typeOfReport = 'affiliation';
    $event.preventDefault();
    $event.stopPropagation();
    Filemanagement.downloadPDF(this.content.nativeElement.innerHTML, this.typeOfReport);
    this.cookieService.set('fileUploadError', this.cookieService.get('fileUploadError')+';fileUploadError'+new Date()+'.pdf');
    audit.errorFileName = 'fileUploadError'+new Date()+'.pdf';
    this.appService.saveAudit(audit);
  }

  /*public downloadPDFModules($event:any){
    let audit: Audit = new Audit();
    this.typeOfReport = 'affiliation';
    $event.preventDefault();
    $event.stopPropagation();
    Filemanagement.downloadPDFModules(this.report.nativeElement.innerHTML, this.typeOfReport);
    this.currentStep = 4;
    this.cookieService.set('reportFileName', this.cookieService.get('reportFileName')+';reportFile'+new Date()+'.pdf');
    audit.reportFileName = 'reportFile'+new Date()+'.pdf';
    this.appService.saveAudit(audit);

  }*/

}
