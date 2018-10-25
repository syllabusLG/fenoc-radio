import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { saveAs } from 'file-saver';
import {IndividusService} from "./individus.service";
import {Individus} from "../shared/individus.model";


@Component({
  selector: 'app-individus',
  templateUrl: './individus.component.html',
  styleUrls: ['./individus.component.css']
})
export class IndividusComponent implements OnInit {
  @ViewChild('reportIndividu')
  reportIndividu: ElementRef;

  pageIndividus: any;
  motCle: string = '';
  currentPage: number = 0;
  size: number = 2;
  pages: Array<number>;

  individus: Individus[];
  individusForm: FormGroup;
  operation: string = '';
  selectedIndividu: Individus;


  constructor(private individusService: IndividusService, private fb: FormBuilder, private route: ActivatedRoute) {
    this.createForm();
  }

  ngOnInit() {
    this.initIndividu();
    this.individus = this.route.snapshot.data.individus;
    console.log(this.individus);
    this.loadIndividus();
  }

  createForm() {
    this.individusForm = this.fb.group({
      nui: '',
      civility: '',
      lastName: '',
      useName: '',
      firstName: '',
      birthDate: '',
      birthPlace: '',
      birthCountry: '',
      birthCountryLib: '',
      nationality: '',
    });
  }

  loadIndividus() {
    this.individusService.search(this.motCle, this.currentPage, this.size)
      .subscribe(data => {
        this.pageIndividus = data;
        this.pages = new Array(data['totalPages']);
      }, error => {
        console.log(error);
      });
  }

  searchIndividus() {
    this.loadIndividus();
  }

  gotoPage(i: number) {
    this.currentPage = i;
    this.loadIndividus();
  }

  updateIndividu() {
    this.individusService.update(this.selectedIndividu).subscribe(
      res => {
        this.initIndividu();
        this.loadIndividus();
      }
    )
  }

  deleteIndividu() {
    this.individusService.delete(this.selectedIndividu.nui).subscribe(
      res => {
        this.selectedIndividu = new Individus();
        this.loadIndividus();
      }
    );
  }

  initIndividu() {
    this.selectedIndividu = new Individus();
    this.createForm();
  }


  downloadFile(data: any) {
    let file = 'Individus' + new Date() + '.csv';
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

