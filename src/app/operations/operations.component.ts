import { Component, OnInit } from '@angular/core';
import {MovementService} from '../movement/movement.service';
import {saveAs} from 'file-saver';
import {CookieService} from 'ngx-cookie-service';
import {Individus} from '../shared/individus.model';
import {IndividusService} from '../individus/individus.service';
import {Compte} from '../shared/compte.model';
import {CompteService} from '../compte/compte.service';
import {Audit} from '../shared/audit.model';
import {AppService} from '../app.service';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})
export class OperationsComponent implements OnInit {

  dateBefore: any;
  dateAfter: any;
  name: string;
  filter: string;
  pageOperations: any;
  currentPage: number = 0;
  size: number = 5;
  pages: Array<number>;
  individus: Individus[];
  selectedIndividu: Individus;
  comptes: Compte[];
  selectedCompte: Compte;
  //operations: Mouvements[];

  constructor(private movementService: MovementService,
              private individuService: IndividusService,
              private compteService: CompteService,
              private cookieService: CookieService,
              private appService: AppService) { }

  ngOnInit() {
  }

  loadOperations(){
    let dateBeforeFormat = this.fillDate(this.dateBefore);
    let dateAfterFormat = this.fillDate(this.dateAfter);
    let audit: Audit = new Audit();
    this.movementService.movementsByDate(this.selectedCompte.numCompte,dateBeforeFormat, dateAfterFormat, this.currentPage, this.size, this.filter)
      .subscribe(data => {
        this.pageOperations = data;
        this.pages = new Array<number>(data['totalPages']);
        this.cookieService.set('operations', this.cookieService.get('operations')+';Operations: search movement according to positions');
        audit.operations = 'Operations: search movement according to positions';
        this.appService.saveAudit(audit);
      }, error1 => {
        console.log(error1);
      });
  }
  searchMovementByDate(){
    this.loadOperations();
  }
  gotoPage(i: number){
    this.currentPage = i;
    this.loadOperations();
  }
  individusByName(event){
    this.individuService.getIndividusByName(event).subscribe(data =>{
      this.individus = data;
    }, error => {
      console.log(error);
    });
  }
  comptesByIndividu(){
    this.compteService.getComptesByIndividu(this.selectedIndividu.nui).subscribe(data =>{
      this.comptes = data;
    }, error =>{
      console.log(error);
    });
  }
  /*downloadFile(data: any) {
    let file = 'operations_' + new Date() + '.csv';
    this.cookieService.set('operationReportCSV', 'Telechargement du fichier: '+file);
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'));
    csv.unshift(header.join(';'));
    let csvArray = csv.join('\r\n');
    var blob = new Blob([csvArray], {type: 'text/csv'})
    saveAs(blob, file);
  }
*/
  fillDate(date:any){
    if(date && (date.indexOf('-') > -1)) {
      let year = new Date(Date.parse(date)).getFullYear();
      let month = String(new Date(Date.parse(date)).getMonth() + 1);
      let day = String(new Date(Date.parse(date)).getDate());
      if (Number(day) >= 1 && Number(day) <= 9) {
        day = '0' + day;
      }
      if(Number(month) >= 1 && Number(month) <= 9) {
        month = '0' + month;
      }
      return day + '/' + month + '/' + year;
    }
  }

}
