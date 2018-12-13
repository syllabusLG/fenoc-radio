import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { saveAs } from 'file-saver';
import {PaymentService} from "./payment.service";
import {Payment} from "../shared/payment.model";
import {CookieService} from 'ngx-cookie-service';
import {Individus} from '../shared/individus.model';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  @ViewChild('reportPayment')
  reportPayment: ElementRef;

  pagePayments:any;
  motCle:string='';
  currentPage:number=0;
  size:number=5;
  pages:Array<number>;

  payments: Payment[];
  paymentForm: FormGroup;
  operation: string='';
  selectedPayment: Payment;
  showClear: boolean = false;

  constructor(private paymentService: PaymentService,
              private cookieService: CookieService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) {
    this.createForm();
  }

  ngOnInit() {

    this.initPayment();
    this.payments = this.changeIndividu(this.route.snapshot.data.payments);
    this.loadPayments();
  }

  createForm(){
    this.paymentForm = this.fb.group({
      iban: '',
      bic: '',
      otherPayment:'',
      individu: ['', Validators.required],
    });
  }

  loadPayments(){
    this.paymentService.search(this.motCle, this.currentPage, this.size)
      .subscribe(data=>{
        this.pagePayments = data;
        this.pages = new Array(data['totalPages']);
      }, error=>{
        console.log(error);
      });
  }

  searchPayment(){
    this.loadPayments();
  }

  gotoPage(i:number){
    this.currentPage = i;
    this.loadPayments();
  }

  updatePayment(){
    this.paymentService.update(this.selectedPayment).subscribe(
      res=>{
        this.cookieService.set('updatePayment', this.selectedPayment.bic);
        this.initPayment();
        this.loadPayments();
      }
    )
  }

  deletePayment(){
    this.paymentService.delete(this.selectedPayment.bic).subscribe(
      res=>{
        this.cookieService.set('deletePayment', this.selectedPayment.bic);
        this.selectedPayment = new Payment();
        this.loadPayments();
      }
    );
  }

  initPayment(){
    this.selectedPayment = new Payment();
    this.createForm();
  }

  downloadFile(data: any) {
    let file = 'payments_'+ new Date()+'.csv';
    this.cookieService.set('paymentReportCSV', file);
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'));
    csv.unshift(header.join(';'));
    let csvArray = csv.join('\r\n');
    var blob = new Blob([csvArray], {type: 'text/csv' })
    saveAs(blob, file);
  }

  changedIban($event){
    this.selectedPayment.iban = "";
  }
  changedOtherPayment($event){
    this.selectedPayment.otherPayment = "";
  }

  changeIndividu(payments: Payment[]){
    for(let i = 0; i < payments.length; i++){
      let individu: Individus = new Individus();
      individu.firstName = payments[i].individu.firstName;
      individu.lastName = payments[i].individu.lastName;
      payments[i].individu = individu;
    }
    return payments;
  }


}
