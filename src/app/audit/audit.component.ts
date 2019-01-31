import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { saveAs } from 'file-saver';
import {ActivatedRoute} from "@angular/router";
import {AuditService} from "./audit.service";
import {Audit} from "../shared/audit.model";

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent implements OnInit {
  @ViewChild('reportAudit')
  reportAudit: ElementRef;

  pageAudits:any;
  isAllAudit = true;
  pageDateAudits: any;
  motCle:string='';
  dateBefore: any;
  dateAfter: any;
  currentPage:number=0;
  size:number=5;
  currentPageDate: number=0;
  sizeDate:number=5;

  pages:Array<number>;
  pagesDate:Array<number>;

  audits: Audit[];
  auditForm: FormGroup;
  operation: string='';
  selectedAudit: Audit;
  selectedAuditDate: Audit;
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private auditService: AuditService){
    this.createForm();
  }

  ngOnInit() {
    this.initAudit();
    this.initAuditDate();
    this.audits =  this.route.snapshot.data.audit;
    this.loadAudits();
  }

  createForm(){
    this.auditForm = this.fb.group({
      id: ['', Validators.required],
      loginDate: '',
      dateAction: '',
      uploadFileName: '',
      errorFileName: '',
      reportFileName: '',
      individuReportCSV: '',
      salarieReportCSV: '',
      contactReportCSV: '',
      paymentReportCSV: '',
      adresseReportCSV: '',
      compteReportCSV: '',
      updateIndividu: '',
      updateSalarie: '',
      updateContact: '',
      updatePayment: '',
      updateAdresse: '',
      updateCompte: '',
      deleteIndividu: '',
      deleteSalarie: '',
      deleteContact: '',
      deletePayment: '',
      deleteAdresse: '',
      deleteCompte: '',
      habilitation: '',
      createUser:'',
      deleteUser:'',
      updateUser:'',
      updateMouvement: '',
      deleteMouvement: '',
      updatePosition: '',
      deletePosition: '',
      uploadMovementFile: '',
      uploadPositionFile: '',
      exportMovementCSV: '',
      exportPositionCSV: '',
      operations: ''
    });
  }
  initAudit(){
    this.selectedAudit = new Audit();
    this.createForm();
  }
  initAuditDate(){
    this.selectedAuditDate = new Audit();
    this.createForm();
  }
  gotoPage(i:number){
    this.currentPage = i;
    this.loadAudits();
  }
  gotoPageDate(i:number){
    this.currentPageDate = i;
    this.loadAuditDate();
  }

  loadAudits() {
    this.auditService.search(this.motCle, this.currentPage, this.size)
      .subscribe(data => {
        this.pageAudits = data;
        this.isAllAudit = true;
        this.pages = new Array(data['totalPages']);
      }, error => {
        console.log(error);
      });
  }

  searchAudit(){
    this.loadAudits();
  }
  loadAuditDate(){
    console.log("Date before= ---"+ this.dateBefore);
    console.log("Date after= ---"+ this.dateAfter);

    console.log("Date before format= ---"+ this.fillDate(this.dateBefore));
    console.log("Date after format= ---"+ this.fillDate(this.dateAfter));
    let dateBeforeFormat = this.fillDate(this.dateBefore);
    let dateAfterFormat = this.fillDate(this.dateAfter);
    this.isAllAudit = false;
    this.auditService.auditsByDate(dateBeforeFormat, dateAfterFormat, this.currentPageDate, this.sizeDate)
      .subscribe(data => {
        this.pageDateAudits = data;
        console.log(data);
        this.isAllAudit = false;
        this.pagesDate = new Array<number>(data['totalPages']);
        console.log(this.isAllAudit)
      }, error => {
        console.log(error);
      });
  }
  searchAuditDate(){
    this.loadAuditDate();
  }
  downloadFile(data: any) {
    let file = 'audit_report_'+ new Date()+'.csv';
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'));
    csv.unshift(header.join(';'));
    let csvArray = csv.join('\r\n');
    var blob = new Blob([csvArray], {type: 'text/csv' })
    saveAs(blob, file);
  }
  fillDate(date:any){
    if(date && (date.indexOf('-') > -1)) {
      let year = new Date(Date.parse(date)).getFullYear();
      let month = String(new Date(Date.parse(date)).getMonth() + 1);
      let day = String(new Date(Date.parse(date)).getDate());
      let hh = String(new Date(Date.parse(date)).getHours());
      let mm = String(new Date(Date.parse(date)).getMinutes());
      let ss = String(new Date(Date.parse(date)).getSeconds());
      if (Number(day) >= 1 && Number(day) <= 9) {
        day = '0' + day;
      }
      if(Number(month) >= 1 && Number(month) <= 9) {
        month = '0' + month;
      }
      if(Number(hh) >= 0 && Number(hh) <= 9){
        hh = '0' + hh;
      }
      if(Number(mm) >= 0 && Number(mm) <= 9){
        mm = '0' + mm;
      }
      if(Number(ss) >= 0 && Number(ss) <= 9){
        ss = '0' + ss;
      }
      return day + '/' + month + '/' + year+' '+hh+':'+mm+':'+ss;
    }
  }

}
