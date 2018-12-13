import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ContactService} from "./contact.service";
import {Contact} from "../shared/contact.model";
import { saveAs } from 'file-saver';
import {Individus} from '../shared/individus.model';
import {CookieService} from 'ngx-cookie-service';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  @ViewChild('reportContact')
  reportContact: ElementRef;

  pageContacts: any;
  motCle: string = '';
  currentPage: number = 0;
  size: number = 5;
  pages: Array<number>;

  contacts: Contact[];
  contactForm: FormGroup;
  operation: string = '';
  selectedContact: Contact;


  constructor(private contactService: ContactService,
              private cookieService: CookieService,
              private fb: FormBuilder,
              private route: ActivatedRoute) {
    this.createForm();
  }

  ngOnInit() {
    this.initCompte();
    this.contacts = this.changeIndividu(this.route.snapshot.data.contacts);
    this.loadContacts();
  }

  createForm() {
    this.contactForm = this.fb.group({
      idContact: '',
      homePhone: '',
      businessPhone: '',
      cellPhone: '',
      personalEmail: '',
      businessEmail: '',
      civility: '',
      individu: ['', Validators.required],
    });
  }

  loadContacts() {
    this.contactService.search(this.motCle, this.currentPage, this.size)
      .subscribe(data => {
        this.pageContacts = data;
        this.pages = new Array(data['totalPages']);
      }, error => {
        console.log(error);
      });
  }

  searchContacts() {
    this.loadContacts();
  }

  gotoPage(i: number) {
    this.currentPage = i;
    this.loadContacts();
  }

  updateContact() {
    this.contactService.update(this.selectedContact).subscribe(
      res => {
        this.cookieService.set('updateContact', this.selectedContact.businessPhone);
        this.initCompte();
        this.loadContacts();
      }
    )
  }

  deleteContact() {
    this.contactService.delete(this.selectedContact.idContact).subscribe(
      res => {
        this.cookieService.set('deleteContact', this.selectedContact.businessPhone);
        this.selectedContact = new Contact();
        this.loadContacts();
      }
    );
  }

  initCompte() {
    this.selectedContact = new Contact();
    this.createForm();
  }


  downloadFile(data: any) {
    let file = 'contacts_' + new Date() + '.csv';
    this.cookieService.set('contactReportCSV', file);
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'));
    csv.unshift(header.join(';'));
    let csvArray = csv.join('\r\n');
    var blob = new Blob([csvArray], {type: 'text/csv'})
    saveAs(blob, file);
  }
  changeIndividu(contacts: Contact[]){
    for(let i = 0; i < contacts.length; i++){
      let individu: Individus = new Individus();
      individu.firstName = contacts[i].individu.firstName;
      individu.lastName = contacts[i].individu.lastName;
      contacts[i].individu = individu;
    }
    return contacts;
  }
}

