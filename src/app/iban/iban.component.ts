import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Salarie} from "../shared/salarie.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Iban} from "../shared/iban.model";
import { saveAs } from 'file-saver';
import {IbanService} from "./iban.service";

@Component({
  selector: 'app-iban',
  templateUrl: './iban.component.html',
  styleUrls: ['./iban.component.css']
})
export class IbanComponent implements OnInit {

  @ViewChild('reportIban')
  reportIban: ElementRef;

  pageIbans:any;
  motCle:string='';
  currentPage:number=0;
  size:number=5;
  pages:Array<number>;

  ibans: Salarie[];
  ibanForm: FormGroup;
  operation: string='';
  selectedIban: Iban;


  constructor(private ibanService: IbanService, private fb: FormBuilder, private route: ActivatedRoute) {
    this.createForm();
  }

  ngOnInit() {
    this.initIban();
    this.ibans = this.route.snapshot.data.ibans;
    this.loadIbans();
  }

  createForm(){
    this.ibanForm = this.fb.group({
      iban: '',
      bic: '',
      individu: ['', Validators.required],
    });
  }

  loadIbans(){
    this.ibanService.search(this.motCle, this.currentPage, this.size)
      .subscribe(data=>{
        this.pageIbans = data;
        this.pages = new Array(data['totalPages']);
      }, error=>{
        console.log(error);
      });
  }

  searchIban(){
    this.loadIbans();
  }

  gotoPage(i:number){
    this.currentPage = i;
    this.loadIbans();
  }

  updateIban(){
    this.ibanService.update(this.selectedIban).subscribe(
      res=>{
        this.initIban();
        this.loadIbans();
      }
    )
  }

  deleteIban(){
    this.ibanService.delete(this.selectedIban).subscribe(
      res=>{
        this.selectedIban = new Iban();
        this.loadIbans();
      }
    );
  }

  initIban(){
    this.selectedIban = new Iban();
    this.createForm();
  }


  downloadFile(data: any) {
    let file = 'iban_report_'+ new Date()+'.csv';
    console.log('------', file);
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'));
    csv.unshift(header.join(';'));
    let csvArray = csv.join('\r\n');
    var blob = new Blob([csvArray], {type: 'text/csv' })
    saveAs(blob, file);
  }

}
