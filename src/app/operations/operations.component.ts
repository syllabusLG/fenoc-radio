import { Component, OnInit } from '@angular/core';
import {MovementService} from '../movement/movement.service';
import {saveAs} from 'file-saver';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-operations',
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.css']
})
export class OperationsComponent implements OnInit {

  dateBefore: any;
  dateAfter: any;
  pageOperations: any;
  currentPage: number = 0;
  size: number = 5;
  pages: Array<number>;
  //operations: Mouvements[];

  constructor(private movementService: MovementService,
              private cookieService: CookieService) { }

  ngOnInit() {
  }

  loadOperations(){
    let dateBeforeFormat = this.fillDate(this.dateBefore);
    let dateAfterFormat = this.fillDate(this.dateAfter);
    console.log("Date before format: "+dateBeforeFormat);
    console.log("Date after format: "+dateAfterFormat);
    this.movementService.movementsByDate(dateBeforeFormat, dateAfterFormat, this.currentPage, this.size)
      .subscribe(data => {
        console.log(data);
        this.pageOperations = data;
        this.pages = new Array<number>(data['totalPages']);
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
