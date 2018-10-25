import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CompteService} from "./compte.service";
import {Compte} from "../shared/compte.model";
import { saveAs } from 'file-saver';


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
  size: number = 2;
  pages: Array<number>;

  comptes: Compte[];
  compteForm: FormGroup;
  operation: string = '';
  selectedCompte: Compte;


  constructor(private compteService: CompteService, private fb: FormBuilder, private route: ActivatedRoute) {
    this.createForm();
  }

  ngOnInit() {
    this.initCompte();
    this.comptes = this.route.snapshot.data.comptes;
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

  searchComptes() {
    this.loadComptes();
  }

  gotoPage(i: number) {
    this.currentPage = i;
    this.loadComptes();
  }

  updateCompte() {
    this.compteService.update(this.selectedCompte).subscribe(
      res => {
        this.initCompte();
        this.loadComptes();
      }
    )
  }

  deleteCompte() {
    this.compteService.delete(this.selectedCompte.numCompte).subscribe(
      res => {
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
    let file = 'compte_report_' + new Date() + '.csv';
    console.log('------', file);
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'));
    csv.unshift(header.join(';'));
    let csvArray = csv.join('\r\n');
    var blob = new Blob([csvArray], {type: 'text/csv'})
    saveAs(blob, file);
  }
}
