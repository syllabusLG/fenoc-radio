import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {SalarieService} from "./salarie.service";
import {Salarie} from "../shared/salarie.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {saveAs} from 'file-saver';


@Component({
  selector: 'app-salarie',
  templateUrl: './salarie.component.html',
  styleUrls: ['./salarie.component.css']
})
export class SalarieComponent implements OnInit {

  @ViewChild('reportSalarie')
  reportSalarie: ElementRef;

  pageSalaries: any;
  motCle: string = '';
  currentPage: number = 0;
  size: number = 2;
  pages: Array<number>;

  salaries: Salarie[];
  salarieForm: FormGroup;
  operation: string = '';
  selectedSalarie: Salarie;

    constructor(private salarieService: SalarieService, private fb: FormBuilder, private route: ActivatedRoute) {
    this.createForm();
  }

  ngOnInit() {
    this.initSalarie();
    this.salaries = this.route.snapshot.data.salaries;
    console.log(this.salaries);

    this.loadSalaries();
  }

  createForm() {
    this.salarieForm = this.fb.group({
      employeeId: ['', Validators.required],
      employeeStatus: '',
      company_CD: '',
      hireDate: '',
      departDate: '',
      lastHireDate: '',
      lastDepartDate: '',
      statut: '',
      mySensitive: '',
      dateEndSensitive: '',
      individu: ['', Validators.required],
    });
  }

  loadSalaries() {
    this.salarieService.search(this.motCle, this.currentPage, this.size)
      .subscribe(data => {
        this.pageSalaries = data;
        this.pages = new Array(data['totalPages']);
      }, error => {
        console.log(error);
      });
  }

  searchSalarie() {
    this.loadSalaries();
  }

  gotoPage(i: number) {
    this.currentPage = i;
    this.loadSalaries();
  }

  updateSalarie() {
    this.salarieService.update(this.selectedSalarie).subscribe(
      res => {
        this.initSalarie();
        this.loadSalaries();
      }
    )
  }

  deleteSalarie() {
    this.salarieService.delete(this.selectedSalarie.employeeId).subscribe(
      res => {
        this.selectedSalarie = new Salarie();
        this.loadSalaries();
      }
    );
  }

  initSalarie() {
    this.selectedSalarie = new Salarie();
    this.createForm();
  }

  downloadFile(data: any) {

    let file = 'salarie_report_' + new Date() + '.csv';
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
