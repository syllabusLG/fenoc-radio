import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CompteService} from "./compte.service";
import {Compte} from "../shared/compte.model";
import { saveAs } from 'file-saver';
import {Individus} from '../shared/individus.model';
import {CookieService} from 'ngx-cookie-service';


@Component({
  selector: 'app-compte',
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.css']
})
export class CompteComponent implements OnInit {


  @ViewChild('reportCompte')
  reportCompte: ElementRef;

  pageComptes: any;
  motCle: string = '';
  currentPage: number = 0;
  size: number = 20;
  pages: Array<number>;

  comptes: Compte[];
  compteForm: FormGroup;
  operation: string = '';
  selectedCompte: Compte;



  constructor(private compteService: CompteService,
              private cookieService: CookieService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              ) {
    this.createForm();
  }

  ngOnInit() {
    this.initCompte();
    this.comptes = this.changeIndividu(this.route.snapshot.data.comptes);
    this.loadComptes();
  }

  createForm() {
    this.compteForm = this.fb.group({
      numCompte: '',
      libCompte: '',
      type: '',
      ouvert: '',
      lettrage: '',
      statutAff: '',
      typage: '',
      idCptPc: '',
      typeCompte: '',
      individu: ['', Validators.required],
    });
  }

  loadComptes() {
    this.compteService.search(this.motCle, this.currentPage, this.size)
      .subscribe(data => {
        this.pageComptes = data;
        this.pages = new Array(data['totalPages']);
      }, error => {
        console.log(error);
      });
  }

  searchComptes(event : any) {
    this.motCle = event;
    this.loadComptes();
  }

  gotoPage(i: number) {
    this.currentPage = i;
    this.loadComptes();
  }

  updateCompte() {
    this.compteService.update(this.selectedCompte).subscribe(
      res => {
        this.cookieService.set('updateCompte', String(this.selectedCompte.numCompte));
        this.initCompte();
        this.loadComptes();
      }
    )
  }

  deleteCompte() {
    this.compteService.delete(this.selectedCompte.numCompte).subscribe(
      res => {
        this.cookieService.set('deleteCompte', String(this.selectedCompte.numCompte));
        this.selectedCompte = new Compte();
        this.loadComptes();
      }
    );
  }

  initCompte() {
    this.selectedCompte = new Compte();
    this.createForm();
  }


  downloadFile(data: any) {
    let file = 'comptes' + new Date() + '.csv';
    this.cookieService.set('compteReportCSV', file);
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'));
    csv.unshift(header.join(';'));
    let csvArray = csv.join('\r\n');
    var blob = new Blob([csvArray], {type: 'text/csv'})
    saveAs(blob, file);
  }
  changeIndividu(comptes: Compte[]){
    for(let i = 0; i < comptes.length; i++){
      let individu: Individus = new Individus();
      individu.firstName = comptes[i].individu.firstName;
      individu.lastName = comptes[i].individu.lastName;
      comptes[i].individu = individu;
    }
    return comptes;
  }
}
