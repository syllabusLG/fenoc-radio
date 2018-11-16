import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { saveAs } from 'file-saver';
import {IndividusService} from "./individus.service";
import {Individus} from "../shared/individus.model";
import {CookieService} from 'ngx-cookie-service';
import {COUNTRY} from '../shared/countries.code';


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
  size: number = 5;
  pages: Array<number>;

  individus: Individus[];
  individusForm: FormGroup;
  operation: string = '';
  selectedIndividu: Individus;
  @Input()
  listcountries:any;

  constructor(private individusService: IndividusService,
              private cookieService: CookieService,
              private fb: FormBuilder,
              private route: ActivatedRoute) {
    this.createForm();
  }

  ngOnInit() {
    this.initIndividu();
    this.individus = this.route.snapshot.data.individus;
    this.loadIndividus();
    this.listcountries = COUNTRY;
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
    let date = this.selectedIndividu.birthDate;
    if(date && (date.indexOf('-') > -1))
    {
      this.selectedIndividu.birthDate= this.fillDate(date);
    }
    this.individusService.update(this.selectedIndividu).subscribe(
      res => {
        this.cookieService.set('updateIndividu', this.selectedIndividu.nui);
        this.initIndividu();
        this.loadIndividus();
      }
    )
  }

  deleteIndividu() {
    this.individusService.delete(this.selectedIndividu.nui).subscribe(
      res => {
        this.cookieService.set('deleteIndividu', this.selectedIndividu.nui);
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
    let file = 'individus_' + new Date() + '.csv';
    this.cookieService.set('individuReportCSV', file);
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'));
    csv.unshift(header.join(';'));
    let csvArray = csv.join('\r\n');
    var blob = new Blob([csvArray], {type: 'text/csv'})
    saveAs(blob, file);
  }


  parse(value: any): Date | null {
    if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
      const str = value.split('/');

      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);

      return new Date(year, month, date);
    } else if((typeof value === 'string') && value === '') {
      return new Date();
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }

  fillDate(date:any){
    if(date && (date.indexOf('-') > -1)) {
      let year = new Date(Date.parse(date)).getFullYear();
      let month = new Date(Date.parse(date)).getMonth() + 1;
      let day = new Date(Date.parse(date)).getDate();
      let dateFormat = day + '/' + month + '/' + year;
      if(day>=1&&day<=9)
      {
        dateFormat = '0'+day + '/' + month + '/' + year;
      }
      return dateFormat;
    }
  }
}

