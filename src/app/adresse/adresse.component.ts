import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Adresse} from '../shared/adresse.model';
import {ActivatedRoute} from '@angular/router';
import { saveAs } from 'file-saver';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdresseService} from './adresse.service';
import * as jsPDF from 'jspdf';
import {Individus} from '../shared/individus.model';
import {CookieService} from 'ngx-cookie-service';
import {COUNTRY} from '../shared/countries.code';
import {SearchInputComponent} from "../search-input/search-input.component";

declare const $;
@Component({
  selector: 'app-adresse',
  templateUrl: './adresse.component.html',
  styleUrls: ['./adresse.component.css']
})
export class AdresseComponent implements OnInit {

  @ViewChild('reportAdresse')
  reportAdresse: ElementRef;

  pageAdresses:any;
  motCle:string='';
  currentPage:number=0;
  size:number=20;
  pages:Array<number>;

  adresses: Adresse[];
  adresseForm: FormGroup;
  operation: string='';
  selectedAdresse: Adresse;
  @Input()
  listcountries:any;


  constructor(private adresseService: AdresseService,
              private cookieService: CookieService,
              private fb: FormBuilder,
              private route: ActivatedRoute) {
    this.createForm();
  }

  ngOnInit() {
    this.initAdresse();
    this.adresses = this.changeIndividu(this.route.snapshot.data.adresses);
    this.loadAdresses();
    this.listcountries = COUNTRY;
  }

  changeIndividu(adresses: Adresse[]){
    for(let i = 0; i < adresses.length; i++){
      let individu: Individus = new Individus();
      individu.firstName = adresses[i].individu.firstName;
      individu.lastName = adresses[i].individu.lastName;
      adresses[i].individu = individu;
    }
    return adresses;
  }
  createForm(){
    this.adresseForm = this.fb.group({
      id: ['', Validators.required],
      individu: ['', Validators.required],
      numberStreet: '',
      street: '',
      additionalAdress_1: '',
      additionalAdress_2: '',
      additionalAdress_3: '',
      codePostal: '',
      city: '',
      country: '',
      resident: '',
      nif: '',
      typeAdresse: '',
    });
  }
  loadAdresses(){
    this.adresseService.search(this.motCle, this.currentPage, this.size)
      .subscribe(data=>{
        this.pageAdresses = data;
        this.pages = new Array(data['totalPages']);
      }, error=>{
        console.log(error);
      });
  }
  searchAdresse(event:any){
    this.motCle = event;
    this.loadAdresses();
  }
  gotoPage(i:number){
    this.currentPage = i;
    this.loadAdresses();
  }
  addAdresse(){
    const  adr = this.adresseForm.value;
    this.adresseService.add(adr).subscribe(
      res=>{
        this.initAdresse();
        this.loadAdresses();
      }
    );
  }
  updateAdresse(){
    this.adresseService.update(this.selectedAdresse).subscribe(
      res=>{
        this.cookieService.set('updateAdresse', this.selectedAdresse.street);
        this.initAdresse();
        this.loadAdresses();
      }
    )
  }
  deleteAdresse(){
    this.adresseService.delete(this.selectedAdresse.id).subscribe(
      res=>{
        this.cookieService.set('deleteAdresse', this.selectedAdresse.street);
        this.selectedAdresse = new Adresse();
        this.loadAdresses();
      }
    );
  }
  initAdresse(){
    this.selectedAdresse = new Adresse();
    this.createForm();
  }

  downloadFile(data: any) {
    let file = 'adresses_'+ new Date()+'.csv';
    this.cookieService.set('adresseReportCSV', file);
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'));
    csv.unshift(header.join(';'));
    let csvArray = csv.join('\r\n');
    var blob = new Blob([csvArray], {type: 'text/csv' })
    saveAs(blob, file);
  }

  public downloadReportPDF(){
    let doc = new jsPDF();
    let file = "reportAdresse"+new Date()+".pdf";
    let  specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };
    let report = this.reportAdresse.nativeElement;

    doc.fromHTML(report.innerHTML, 15, 15, {
      'width': 190,
      'elementHandlers': specialElementHandlers
    });

    doc.save(file);

  }

}
