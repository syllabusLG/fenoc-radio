import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CrudService} from '../../../model/crud.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DataModel} from '../../../model/data.model';
import { saveAs } from 'file-saver';
import {CookieService} from 'ngx-cookie-service';


@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.css']
})


export class SampleComponent implements OnInit {


  @Input()
  title: string;

  @Input()
  data: any;

  @Input()
  service: CrudService;

  @Input()
  initItem: any;

  @Input()
  initForm: FormGroup;

  @Input()
  dataModelList: DataModel[];

  crudForm: FormGroup;

  operation: string = 'add';

  selectedItem: any;


  constructor(private fb: FormBuilder, private cookieService: CookieService){
    this.createForm();
  }

  ngOnInit(){
    this.init();
  }


  createForm(){
    this.initForm ? this.crudForm = this.initForm : this.crudForm = this.fb.group({});
  }

  loadData(){
    this.service.getAll().subscribe(
      data => {this.data = data},
      error => { console.log('An error was occured.')},
      () => { console.log('loading data was done.')}
    );
  }

  add(){
    const p = this.crudForm.value;
    this.service.add(p).subscribe(
      res => {
        this.cookieService.set('createUser', p.firstName+' '+p.lastName);
        this.init();
        this.loadData();
      }
    );
  }

  update(){
    this.service.update(this.selectedItem)
      .subscribe(
        res => {
          this.cookieService.set('updateUser', this.selectedItem.firstName+' '+this.selectedItem.lastName);
          this.init();
          this.loadData();
        }
      );
  }

  init(){
    this.selectedItem = this.initItem;
    this.createForm();
  }

  delete(){
    this.service.delete(this.selectedItem.id).
    subscribe(
      res =>{
        this.cookieService.set('deleteUser', this.selectedItem.firstName+' '+this.selectedItem.lastName);
        this.selectedItem = this.initItem;
        this.loadData();
      }
    );
  }

  downloadFile(data: any) {
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'));
    csv.unshift(header.join(';'));
    let csvArray = csv.join('\r\n');
    var blob = new Blob([csvArray], {type: 'text/csv' })
    saveAs(blob, this.title+".csv");
  }


}
