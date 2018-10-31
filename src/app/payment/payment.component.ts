import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import { saveAs } from 'file-saver';
import {PaymentService} from "./payment.service";
import {Payment} from "../shared/payment.model";

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

  constructor(private paymentService: PaymentService, private fb: FormBuilder, private route: ActivatedRoute) {
    this.createForm();
  }

  ngOnInit() {

    this.initPayment();
    this.payments = this.route.snapshot.data.payments;
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
    console.log(this.selectedPayment);
    this.paymentService.update(this.selectedPayment).subscribe(
      res=>{
        this.initPayment();
        this.loadPayments();
      }
    )
  }

  deletePayment(){
    this.paymentService.delete(this.selectedPayment.bic).subscribe(
      res=>{
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
    let file = 'Payment_report_'+ new Date()+'.csv';
    console.log('------', file);
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


}