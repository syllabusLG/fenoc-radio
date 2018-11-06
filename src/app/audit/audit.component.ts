import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {Adresse} from "../shared/adresse.model";
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
  motCle:string='';
  currentPage:number=0;
  size:number=5;
  pages:Array<number>;

  audits: Audit[];
  auditForm: FormGroup;
  operation: string='';
  selectedAudit: Adresse;
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private auditService: AuditService){}

  ngOnInit() {
    this.initAudit();
    this.audits =  this.route.snapshot.data.audit;
    this.loadAudits();
  }

  createForm(){
    this.auditForm = this.fb.group({
      id: ['', Validators.required],
      loginDate: '',
      uploadFileName: '',
      errorFileName: '',
      reportFileName: '',
    });
  }
  initAudit(){
    this.selectedAudit = new Audit();
    this.createForm();
  }
  gotoPage(i:number){
    this.currentPage = i;
    this.loadAudits();
  }
  editDetails(){

  }
  loadAudits() {
    this.auditService.search(this.motCle, this.currentPage, this.size)
      .subscribe(data => {
        this.pageAudits = data;
        this.pages = new Array(data['totalPages']);
      }, error => {
        console.log(error);
      });
  }

  searchAudit(){
    this.loadAudits();
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

}
