import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DataModel} from '../../data.model';
import {CrudService} from '../../crud.service';
import {COUNTRY} from '../../countries.code';
import * as jsPDF from 'jspdf';
import {Individus} from '../../individus.model';
import {Salarie} from '../../salarie.model';
import {Contact} from '../../contact.model';
import {Payment} from '../../payment.model';
import {Compte} from '../../compte.model';
import {Filemanagement} from "../../../common/filemanagement";
import {ReportCreateFileService} from '../../../report-create-file/report.create.file.service';
import {ReportUpdateFileService} from '../../../report-update-file/report.update.file.service';
import {ReportCreateFile} from '../../report.create.file.model';
import {ReportUpdateFile} from '../../report.update.file.model';
import {CookieService} from 'ngx-cookie-service';
import {Positions} from '../../position.model';
import {AuditService} from '../../../audit/audit.service';
import {Audit} from '../../audit.model';
import {AppService} from '../../../app.service';
import { NgxSpinnerService } from 'ngx-spinner';
//import { UploadedFileService } from '../../../services/uploaded-file.service';
//import {PhoneNumberUtil} from 'google-libphonenumber';
import { UploadedFileService } from '../../../common/services/uploaded-file.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})


export class UploadComponent implements OnInit {
  @ViewChild("fileUploadInput")
  fileUploadInput: any;

  @ViewChild('content')
  content: ElementRef;

  @ViewChild('report')
  report: ElementRef;

  //buttonVisible: number = 0;

  @Input()
  dataModelList: DataModel[];

  @Input()
  service: CrudService;

  @Output()
  updateData: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  errorMessages: EventEmitter<any> = new EventEmitter<any>();

  typeOfReport: string = '';
  downloadDate: any;
  downloadHour: any;
  companyName: string;
  dataArray:  any = null;
  individusDataArray: Individus[] = [];
  individusCreatedDataArray: Individus[] = [];
  individusUpdatedDataArray: Individus[] = [];
  salarieDataArray: Salarie[] = [];
  salarieCreatedDataArray: Salarie[] = [];
  salarieUpdatedDataArray: Salarie[] = [];
  contactDataArray: Contact[] = [];
  contactCreatedDataArray: Contact[] = [];
  contactUpdatedDataArray: Contact[] = [];
  paymentDataArray: Payment[] = [];
  paymentCreatedDataArray: Payment[] = [];
  paymentUpdatedDataArray: Payment[] = [];
  /*adresseDataArray: Adresse[] = [];
  adresseCreatedDataArray: Adresse[] = [];
  adresseUpdatedDataArray: Adresse[] = [];*/
  compteDataArray: Compte[] = [];
  positionDataArray: Positions[]=[];
  compteCreatedDataArray: Compte[] = [];
  compteUpdatedDataArray: Compte[] = [];

  nbreLigneRejete: number = 0;

  currentStep = 1;

  selectedStep = 1;

  dataFromServer: any = null;

  dataSentToServer: boolean = false;

  isControleFile: boolean = true;
  company_cd_required: boolean = true;
  company_cd_required_line: number= 2;
  company_cd_listErreurLine: number[] = [];
  company_cd_unique: boolean = true;

  employee_id_required: boolean = true;
  employee_id_required_line: number = 2;
  employeeIdListErrorLine: number[] = [];
  employeeIdWellFormatted: boolean = true;
  //employeeIdWellFormattedLine: number = 1;

  numIdentityUniqueRequired: boolean = true;
  numIdentityUniqueRequiredLine: number = 2;
  NUI_listErrorLine: number[] = [];

  noDuplicateNUI: boolean = true;
  noDuplicateNUILine: number = 2;
  noDuplicateNUIListErrorLine: number[] = [];


  civilityRequired: boolean = true;
  civilityRequiredLine: number = 2;
  civilityRequiredListErrorLine: number[] = [];
  civilityFalseListErrorLine: number[] = [];
  civilityFalseValue: boolean = true;

 /* statusGiven: boolean = true;
  statusGivenLine: number = 1;
  statusValid: boolean = true;*/

  employeStatusGiven: boolean = true;
  employeStatusGivenLine: number = 2;
  employeStatusGivenListErrorLine: number[] = [];
  employeStatusValidListErrorLine: number[] = [];
  employeStatusValid: boolean = true;

  /*vipGiven: boolean = true;
  vipGivenLine: number = 1;
  vipValid: boolean = true;*/

  /*sensitiveGiven: boolean = true;
  sensitiveGivenLine: number = 1;
  sensitiveValid: boolean = true;*/

  /*conformFlagSensitive: boolean = true;
  conformFlagSensitiveLine: number = 1;*/

  lastNameGiven: boolean = true;
  lastNameGivenline: number = 2;
  lastNameGivenListErrorLine: number[] = [];

  numberStreetIncomplet: boolean = true;
  numberStreetIncompletLine: number = 2;
  numberStreetIncompletListErrorLine: number[] = [];
  adressValid: boolean = true;
  adressValidLine: number = 2;
  adressValidListErrorLine: number[] = [];

  firstNameGiven: boolean = true;
  firstNameGivenline: number = 2;
  firstNameGivenListErrorLine: number[] = [];

  personalEmailValid: boolean = true;
  personalEmailValidLine: number = 2;
  personalEmailValidListErrorLine: number[] = [];

  businessEmailValid: boolean = true;
  businessEmailValidLine: number = 2;
  businessEmailValidListErrorLine: number[] = [];

  phoneValid: boolean = true;
  phoneValidLine: number = 2;

  insertCodePays: boolean = false;
  codePaysFound: boolean = true;
  codePaysFoundLine: number = 2;
  codePaysFoundListErrorLine: number[] = [];

  codeIsoNationalityValid: boolean = true;
  codeIsoNationalityValidLine: number = 2;
  codeIsoNationalityValidListErrorLine: number[] = [];

  listCodePays: string[] = [];
  listLibPays: string[] = [];

  codeIsoCountryValid: boolean = true;
  codeIsoCountryValidLine: number = 2;
  codeIsoCountryValidListErrorLine: number[] = [];

  listCodeCountry: string[] = [];
  listLibCountry: string[] = [];



  birthDateGiven: boolean = true;
  birthDateValid: boolean = true;
  birthDateValidLine: number = 2;
  birthDateGivenListErrorLine: number[] = [];
  birthDateValidListErrorLine: number[] = [];

  /*dateEndSensitiveValid: boolean = true;
  dateEndSensitiveValidLine: number = 1;*/

  hireDateValid: boolean = true;
  hireDateValidLine: number = 2;
  hireDateValidListErrorLine: number[] = [];

 /* lastHireDateValid: boolean = true;
  lastHireDateValidLine: number = 1;*/

  departDateValid: boolean = true;
  departDateValidLine: number = 2;
  departDateValidListErrorLine: number[] = [];

  /*lastDepartDateValid: boolean = true;
  lastDepartDateValidLine: number = 1;*/

  employeNoDepartDate: boolean = true;
  employeNoDepartDateLine: number = 2;
  employeNoDepartDateListErrorLine: number[] = [];

  employeDepartDate: boolean = true;
  employeDepartDateLine: number = 2;
  employeDepartDateListErrorLine: number[] = [];

  noEmployeeDuplicated = true;
  duplicateFirstName: string = '';
  duplicateLastName: string = '';

  bicGiven: boolean = true;
  bicGivenLine: number = 2;
  bicGivenListErrorLine: number[] = [];
  otherPaymentGiven: boolean = true;
  otherPaymentGivenLine: number = 2;
  otherPaymentGivenListErrorLine: number[] = [];

  ibanValid: boolean = true;
  ibanValidLine: number = 2;
  ibanValidListErrorLine: number[] = [];

  noIbanDuplicate: boolean = true;
  noIbanDuplicateLine: number = 2;
  noIbanDuplicateListErrorLine: number[] = [];

  bicValid: boolean = true;
  bicValidLine: number = 2;
  bicValidListErrorLine: number[] = [];

  bicIbanValid: boolean = true;
  bicIbanValidLine: number = 2;
  bicIbanValidListErrorLine: number[] = [];

  dataModelListFiltred: any;

  fileName: string = '';

  individuReportCreateFile: ReportCreateFile = new ReportCreateFile();
  individuReportUpdateFile: ReportUpdateFile = new ReportUpdateFile();

  salaryReportCreateFile: ReportCreateFile = new ReportCreateFile();
  salaryReportUpdateFile: ReportUpdateFile = new ReportUpdateFile();

  contactReportCreateFile: ReportCreateFile = new ReportCreateFile();
  contactReportUpdateFile: ReportUpdateFile = new ReportUpdateFile();

  paymentReportCreateFile: ReportCreateFile = new ReportCreateFile();
  paymentReportUpdateFile: ReportUpdateFile = new ReportUpdateFile();

  adresseReportCreateFile: ReportCreateFile = new ReportCreateFile();
  adresseReportUpdateFile: ReportUpdateFile = new ReportUpdateFile();

  compteReportCreateFile: ReportCreateFile = new ReportCreateFile();
  compteReportUpdateFile: ReportUpdateFile = new ReportUpdateFile();

  audit: Audit = new Audit();

  COUNTRY = COUNTRY;
  @Output() messageEvent = new EventEmitter<any>();
  BadHeaders: boolean = false;
  isuploaded: boolean;

  constructor(private cookieService: CookieService,
              private auditService: AuditService,
              private appService: AppService,
              private reportCreateFileService: ReportCreateFileService,
              private reportUpdateFileService: ReportUpdateFileService,
              private spinner: NgxSpinnerService,
              private fileUploadedService: UploadedFileService) { }

  ngOnInit() {
    this.dataModelListFiltred = this.dataModelList.filter(dataModel => !dataModel.readonly);
    this.fileUploadedService.currentuploadedfile.subscribe(isUploaded => this.isuploaded = isUploaded)
    }

    getBindHeadersDataModelListArray(headers){
    let bindArray = [];
    let index = 0;
    let getDataType = (header) => {
      let dataType = '';
      this.dataModelList.forEach(dataModel => {
        if(dataModel.columnName == header){
          dataType = dataModel.dataType;
        }
      });
      return dataType;
    };

    headers.forEach(header => {
      const bindItem = {
        columnName: header,
        dataType: getDataType(header),
        index: index
      }
      index++;
      bindArray.push(bindItem);
    });
    return bindArray;
  }

  controleHeaders (headers){
    let uploadHeaders = "nui;company_CD;employeeId;employeeStatus;civility;lastName;firstName;personalEmail;businessEmail;birthDate;birthPlace;birthCountry;nationality;hireDate;departDate;numberStreet;street;codePostal;city;country;additionalAdress_1;additionalAdress_2;additionalAdress_3;bic;iban;otherPayment;cellPhone;homePhone;businessPhone;numCompte;libCompte;type;ouvert;lettrage;statutAff;typage;idCptPc;nif";
    let uploadHeadersArray= uploadHeaders.split(";");
    for(let i=0; i<headers.length; i++) {
      let ind = headers[i];
      if (uploadHeadersArray.indexOf(headers[i]) <= -1) {
        this.BadHeaders = true;
        this.currentStep = -1;
        return true;
      }
    }
    return false;
  }
  controleFile(dataArray, file){
     let tabFile = file.split('_');
     if(tabFile[0].toLowerCase() !== dataArray[0].company_CD.toLowerCase()){
       this.currentStep = -1;
       return false;
     }
     if(tabFile[1].toLowerCase() !== 'affiliation'){
       this.currentStep = -1;
       return false;
     }
     if(!this.isDateFile(tabFile[2])) {
       this.currentStep = -1;
       return false;
     }
     return true;
  }
  buildDataArray(bindArray, csvRecordsArray){
    let dataArray = [];
    if(csvRecordsArray && csvRecordsArray.length>2){
      for(let i = 1; i<csvRecordsArray.length; i++){
        const dataCsv = csvRecordsArray[i].split(";");
        const dataCrud = {};
        bindArray.forEach(bindItem => {
          dataCrud[bindItem.columnName] = bindItem.dataType == 'number' ? Number(dataCsv[bindItem.index]) : dataCsv[bindItem.index];
        });

        dataArray.push(dataCrud);
      }

    }
    return dataArray;
  }

  buildIndividusDataArray(dataArray){

  /*  this.individuReportCreateFile.module = 'Individus';
    this.individuReportUpdateFile.module = 'Individus';
    for (let i = 0; i < dataArray.length; i++) {
      let individus: Individus = new Individus();
      if(dataArray[i].lastName.length !== 0 && dataArray[i].firstName.length !== 0 && dataArray[i].civility.length !== 0 &&
        (+dataArray[i].civility === 1 || +dataArray[i].civility === 2 || +dataArray[i].civility === 3) &&
         dataArray[i].birthDate.length !== 0 && this.isValidateDate(dataArray[i].birthDate) && this.isDateValide(dataArray[i].birthDate) && this.isAgeValide(dataArray[i].birthDate) &&
         dataArray[i].employeeStatus.length !== 0
        && (dataArray[i].employeeStatus.toUpperCase() === 'P' || dataArray[i].employeeStatus.toUpperCase() === 'S' || dataArray[i].employeeStatus.toUpperCase() === 'R')
        && this.listCodePays.includes(dataArray[i].birthCountry.toUpperCase())
        && this.listCodePays.includes(dataArray[i].nationality.toUpperCase())
        && this.listCodePays.includes(dataArray[i].country.toUpperCase())
        && dataArray[i].numberStreet.length !== 0 && dataArray[i].street.length !== 0
        && dataArray[i].city.length !== 0 && dataArray[i].codePostal.length !== 0 && dataArray[i].country.length !==0
        && dataArray[i].hireDate.length !== 0 && this.isValidateDate(dataArray[i].hireDate) && this.isDateValide(dataArray[i].hireDate) && this.isPossibleHireDate(dataArray[i].birthDate, dataArray[i].hireDate)
        && this.isPossibleDepartDate(dataArray[i].hireDate, dataArray[i].departDate)) {

        this.individusService.getOne(dataArray[i].nui).subscribe((data)=>{
          if(data !== null){
            this.individusUpdatedDataArray.push(data);
        }else{
          this.individusCreatedDataArray.push(data);
        }

      }, error =>{
        });
        individus.nui = dataArray[i].nui;
        individus.civility = dataArray[i].civility;
        individus.lastName = dataArray[i].lastName;
        //individus.useName = dataArray[i].useName;
        individus.firstName = dataArray[i].firstName;
        individus.birthDate = dataArray[i].birthDate;
        individus.birthPlace = dataArray[i].birthPlace;
        individus.birthCountry = dataArray[i].birthCountry;
        individus.nationality = dataArray[i].nationality;
        //individus.birthCountryLib = dataArray[i].lastName;*!/
        this.individusDataArray.push(individus);
      }else{
        this.nbreLigneRejete+=1;
        this.individuReportCreateFile.nbreLinesRejected = this.nbreLigneRejete;
        this.individuReportUpdateFile.nbreLinesRejected = this.nbreLigneRejete;
        this.salaryReportUpdateFile.nbreLinesRejected = this.nbreLigneRejete;
        this.salaryReportCreateFile.nbreLinesRejected = this.nbreLigneRejete;
        this.contactReportCreateFile.nbreLinesRejected = this.nbreLigneRejete;
        this.contactReportUpdateFile.nbreLinesRejected = this.nbreLigneRejete;
        this.paymentReportCreateFile.nbreLinesRejected = this.nbreLigneRejete;
        this.paymentReportUpdateFile.nbreLinesRejected = this.nbreLigneRejete;
        this.adresseReportCreateFile.nbreLinesRejected = this.nbreLigneRejete;
        this.adresseReportUpdateFile.nbreLinesRejected = this.nbreLigneRejete;
        this.compteReportCreateFile.nbreLinesRejected = this.nbreLigneRejete;
        this.compteReportUpdateFile.nbreLinesRejected = this.nbreLigneRejete;
      }

    }
*/
  }

  buildSalarieDataArray(dataArray){
   /* this.salaryReportCreateFile.module = 'Salarie';
    this.salaryReportUpdateFile.module = 'Salarie';
    for (let i = 0; i < dataArray.length; i++){
      let salarie: Salarie = new Salarie();
      let individu: Individus = new Individus();
      if(dataArray[i].lastName.length !== 0 && dataArray[i].firstName.length !== 0 && dataArray[i].civility.length !== 0 &&
        (+dataArray[i].civility === 1 || +dataArray[i].civility === 2 || +dataArray[i].civility === 3) &&
        dataArray[i].birthDate.length !== 0 && this.isValidateDate(dataArray[i].birthDate) && this.isDateValide(dataArray[i].birthDate) && this.isAgeValide(dataArray[i].birthDate) &&
        dataArray[i].employeeStatus.length !== 0
        && (dataArray[i].employeeStatus.toUpperCase() === 'P' || dataArray[i].employeeStatus.toUpperCase() === 'S' || dataArray[i].employeeStatus.toUpperCase() === 'R')
        && this.listCodePays.includes(dataArray[i].nationality.toUpperCase())
        && this.listCodePays.includes(dataArray[i].birthCountry.toUpperCase())
        && this.listCodePays.includes(dataArray[i].country.toUpperCase())
        && dataArray[i].numberStreet.length !== 0 && dataArray[i].street.length !== 0
        && dataArray[i].city.length !== 0 && dataArray[i].codePostal.length !== 0 && dataArray[i].country.length !==0
        && dataArray[i].hireDate.length !== 0 && this.isValidateDate(dataArray[i].hireDate) && this.isDateValide(dataArray[i].hireDate) && this.isPossibleHireDate(dataArray[i].birthDate, dataArray[i].hireDate)
        && this.isPossibleDepartDate(dataArray[i].hireDate, dataArray[i].departDate)){

        this.salarieService.getOne(dataArray[i].employeeId).subscribe((data)=>{
          if(data !== null){
            this.salarieUpdatedDataArray.push(data);
          }else {
            this.salarieCreatedDataArray.push(data);
          }
        });
        salarie.employeeId = dataArray[i].employeeId;
        salarie.employeeStatus = dataArray[i].employeeStatus;
        salarie.company_CD = dataArray[i].company_CD;
        this.companyName = dataArray[i].company_CD;
        salarie.hireDate = dataArray[i].hireDate;
        salarie.departDate = dataArray[i].departDate;
        individu.nui = dataArray[i].nui;
        salarie.individu = individu;
        this.salarieDataArray.push(salarie);
      }
    }*/
  }

  buildContactDataArray(dataArray){
    this.contactReportCreateFile.module = 'Contact';
    this.contactReportUpdateFile.module = 'Contact';
    //const phoneUtil = PhoneNumberUtil.getInstance();
    for (let i = 0; i < dataArray.length; i++){
      let contact: Contact = new Contact();
      let individu: Individus = new Individus();
      if(dataArray[i].lastName.length !== 0 && dataArray[i].firstName.length !== 0 && dataArray[i].civility.length !== 0 &&
        (+dataArray[i].civility === 1 || +dataArray[i].civility === 2 || +dataArray[i].civility === 3) &&
        dataArray[i].birthDate.length !== 0 && this.isValidateDate(dataArray[i].birthDate) && this.isDateValide(dataArray[i].birthDate) && this.isAgeValide(dataArray[i].birthDate) &&
        dataArray[i].employeeStatus.length !== 0
        && (dataArray[i].employeeStatus.toUpperCase() === 'P' || dataArray[i].employeeStatus.toUpperCase() === 'S' || dataArray[i].employeeStatus.toUpperCase() === 'R')
        && this.listCodePays.includes(dataArray[i].nationality.toUpperCase())
        && this.listCodePays.includes(dataArray[i].birthCountry.toUpperCase())
        && this.listCodePays.includes(dataArray[i].country.toUpperCase())
        && dataArray[i].numberStreet.length !== 0 && dataArray[i].street.length !== 0
        && dataArray[i].city.length !== 0 && dataArray[i].codePostal.length !== 0 && dataArray[i].country.length !==0
        && dataArray[i].hireDate.length !== 0 && this.isValidateDate(dataArray[i].hireDate) && this.isDateValide(dataArray[i].hireDate) && this.isPossibleHireDate(dataArray[i].birthDate, dataArray[i].hireDate)
        && this.isPossibleDepartDate(dataArray[i].hireDate, dataArray[i].departDate)){

        /*this.contactService.getOne(dataArray[i].employeeId.toUpperCase()+"_ID").subscribe((data) =>{
          if(data !== null){
            this.contactUpdatedDataArray.push(data);
          }else{
            this.contactCreatedDataArray.push(data);
          }
        });*/
        contact.idContact = dataArray[i].employeeId.toUpperCase()+"_ID";
        if(dataArray[i].homePhone.length !== 0){
          contact.homePhone = '+'+dataArray[i].homePhone;
        }
        if(dataArray[i].businessPhone.length !== 0){
          contact.businessPhone = '+'+dataArray[i].businessPhone;
        }
        if(dataArray[i].cellPhone.length !== 0){
          contact.cellPhone = '+'+dataArray[i].cellPhone;
        }
        //console.log('cellPhone: '+contact.cellPhone.startsWith('00'));
        //console.log(''+ phoneUtil. phoneUtil.isPossibleNumber(contact.cellPhone));
        individu.nui = dataArray[i].nui;
        contact.individu = individu;
        if(dataArray[i].personalEmail.length !== 0 && this.isValidateEmail(dataArray[i].personalEmail)){
          contact.personalEmail = dataArray[i].personalEmail;
        }
        if(dataArray[i].businessEmail.length !== 0 && this.isValidateEmail(dataArray[i].businessEmail)){
          contact.businessEmail = dataArray[i].businessEmail;
        }
        this.contactDataArray.push(contact);
      }
    }
  }

  buildPaymentDataArray(dataArray){
    this.paymentReportCreateFile.module = 'PAYMENT';
    this.paymentReportUpdateFile.module = 'PAYMENT';
    for (let i = 0; i < dataArray.length; i++){
      let payment: Payment = new Payment();
      let individu: Individus = new Individus();
      if(dataArray[i].lastName.length !== 0 && dataArray[i].firstName.length !== 0 && dataArray[i].civility.length !== 0 &&
        (+dataArray[i].civility === 1 || +dataArray[i].civility === 2 || +dataArray[i].civility === 3) &&
        dataArray[i].birthDate.length !== 0 && this.isValidateDate(dataArray[i].birthDate) && this.isDateValide(dataArray[i].birthDate) && this.isAgeValide(dataArray[i].birthDate) &&
        dataArray[i].employeeStatus.length !== 0
        && (dataArray[i].employeeStatus.toUpperCase() === 'P' || dataArray[i].employeeStatus.toUpperCase() === 'S' || dataArray[i].employeeStatus.toUpperCase() === 'R')
        && this.listCodePays.includes(dataArray[i].nationality.toUpperCase())
        && this.listCodePays.includes(dataArray[i].birthCountry.toUpperCase())
        && this.listCodePays.includes(dataArray[i].country.toUpperCase())
        && dataArray[i].numberStreet.length !== 0 && dataArray[i].street.length !== 0
        && dataArray[i].city.length !== 0 && dataArray[i].codePostal.length !== 0 && dataArray[i].country.length !==0
        && dataArray[i].hireDate.length !== 0 && this.isValidateDate(dataArray[i].hireDate) && this.isDateValide(dataArray[i].hireDate) && this.isPossibleHireDate(dataArray[i].birthDate, dataArray[i].hireDate)
        && this.isPossibleDepartDate(dataArray[i].hireDate, dataArray[i].departDate)){

        if(dataArray[i].iban.length !== 0  && dataArray[i].bic.length !== 0
          && this.isValidIBANNumber(dataArray[i].iban) && this.isBic(dataArray[i].bic)
          && dataArray[i].bic.substr(4,2) === dataArray[i].iban.substr(0, 2)){

          /*this.paymentService.getOne(dataArray[i].bic + dataArray[i].iban + dataArray[i].nui).subscribe((data)=>{
            if (data !== null){
              this.paymentUpdatedDataArray.push(data);
            } else {
              this.paymentCreatedDataArray.push(data);
            }
          });*/
          payment.id = dataArray[i].bic + dataArray[i].iban + dataArray[i].nui;
          payment.bic =  dataArray[i].bic;
          payment.iban = dataArray[i].iban;
          individu.nui = dataArray[i].nui;
          payment.individu = individu;
          this.paymentDataArray.push(payment);
        }
        if(dataArray[i].otherPayment.length !== 0 && dataArray[i].iban.length ===0 && dataArray[i].bic.length !== 0
           && this.isBic(dataArray[i].bic)){
          /*this.paymentService.getOne(dataArray[i].bic + dataArray[i].otherPayment + dataArray[i].nui).subscribe((data)=>{
            if (data !== null){
              this.paymentUpdatedDataArray.push(data);
            } else {
              this.paymentCreatedDataArray.push(data);
            }
          });*/
          payment.id = dataArray[i].bic + dataArray[i].otherPayment + dataArray[i].nui;
          payment.bic =  dataArray[i].bic;
          payment.otherPayment = dataArray[i].otherPayment;
          individu.nui = dataArray[i].nui;
          payment.individu = individu;
          this.paymentDataArray.push(payment);
        }
      }
    }
  }

  buildAdresseDataArray(dataArray){
    /*this.adresseReportCreateFile.module = 'Adresse';
    this.adresseReportUpdateFile.module = 'Adresse';
    for (let i = 0; i < dataArray.length; i++){
      let adresse: Adresse = new Adresse();
      let individu: Individus = new Individus();
      if(dataArray[i].lastName.length !== 0 && dataArray[i].firstName.length !== 0 && dataArray[i].civility.length !== 0 &&
        (+dataArray[i].civility === 1 || +dataArray[i].civility === 2 || +dataArray[i].civility === 3) &&
        dataArray[i].birthDate.length !== 0 && this.isValidateDate(dataArray[i].birthDate) && this.isDateValide(dataArray[i].birthDate) && this.isAgeValide(dataArray[i].birthDate) &&
        dataArray[i].employeeStatus.length !== 0
        && (dataArray[i].employeeStatus.toUpperCase() === 'P' || dataArray[i].employeeStatus.toUpperCase() === 'S' || dataArray[i].employeeStatus.toUpperCase() === 'R')
        && this.listCodePays.includes(dataArray[i].nationality.toUpperCase())
        && this.listCodePays.includes(dataArray[i].birthCountry.toUpperCase())
        && this.listCodePays.includes(dataArray[i].country.toUpperCase())
        && dataArray[i].numberStreet.length !== 0 && dataArray[i].street.length !== 0
        && dataArray[i].city.length !== 0 && dataArray[i].codePostal.length !== 0 && dataArray[i].country.length !==0
        && dataArray[i].hireDate.length !== 0 && this.isValidateDate(dataArray[i].hireDate) && this.isDateValide(dataArray[i].hireDate) && this.isPossibleHireDate(dataArray[i].birthDate, dataArray[i].hireDate)
        && this.isPossibleDepartDate(dataArray[i].hireDate, dataArray[i].departDate)){

        this.adresseService.getOne(dataArray[i].nui.toUpperCase() + dataArray[i].numberStreet).subscribe((data)=>{
          if(data !== null){
            this.adresseUpdatedDataArray.push(data);
          }else {
            this.adresseCreatedDataArray.push(data);
          }
        });
        if(dataArray[i].nif.length !== 0){
          adresse.id = dataArray[i].nui.toUpperCase() + dataArray[i].numberStreet
          if(dataArray[i].numberStreet.length !== 0){
            adresse.numberStreet = dataArray[i].numberStreet;
          }
          adresse.street = dataArray[i].street;
          adresse.additionalAdress_1 = dataArray[i].additionalAdress_1;
          adresse.additionalAdress_2 = dataArray[i].additionalAdress_2;
          adresse.additionalAdress_3 = dataArray[i].additionalAdress_3;
          adresse.codePostal = dataArray[i].codePostal;
          adresse.city = dataArray[i].city;
          adresse.country = dataArray[i].country;
          adresse.nif = dataArray[i].nif;
          adresse.typeAdresse = 'FISCALITE';
          individu.nui = dataArray[i].nui;
          adresse.individu = individu;

          this.adresseDataArray.push(adresse);
        }else {
          adresse.id = dataArray[i].nui.toUpperCase() + dataArray[i].numberStreet
          if(dataArray[i].numberStreet.length !== 0){
            adresse.numberStreet = dataArray[i].numberStreet;
          }
          adresse.street = dataArray[i].street;
          adresse.additionalAdress_1 = dataArray[i].additionalAdress_1;
          adresse.additionalAdress_2 = dataArray[i].additionalAdress_2;
          adresse.additionalAdress_3 = dataArray[i].additionalAdress_3;
          adresse.codePostal = dataArray[i].codePostal;
          adresse.city = dataArray[i].city;
          adresse.country = dataArray[i].country;
          adresse.typeAdresse = 'NORMALE';
          individu.nui = dataArray[i].nui;
          adresse.individu = individu;
          this.adresseDataArray.push(adresse);
        }
      }
    }*/
  }

  buildCompteDataArray(dataArray){
    this.compteReportCreateFile.module = 'Compte';
    this.compteReportUpdateFile.module = 'Compte';
    for (let i = 0; i < dataArray.length; i++){
      let compte: Compte = new Compte();
      let individu: Individus = new Individus();
      if(dataArray[i].lastName.length !== 0 && dataArray[i].firstName.length !== 0 && dataArray[i].civility.length !== 0 &&
        (+dataArray[i].civility === 1 || +dataArray[i].civility === 2 || +dataArray[i].civility === 3) &&
        dataArray[i].birthDate.length !== 0 && this.isValidateDate(dataArray[i].birthDate) && this.isDateValide(dataArray[i].birthDate) && this.isAgeValide(dataArray[i].birthDate) &&
        dataArray[i].employeeStatus.length !== 0
        && (dataArray[i].employeeStatus.toUpperCase() === 'P' || dataArray[i].employeeStatus.toUpperCase() === 'S' || dataArray[i].employeeStatus.toUpperCase() === 'R')
        && this.listCodePays.includes(dataArray[i].nationality.toUpperCase())
        && this.listCodePays.includes(dataArray[i].birthCountry.toUpperCase())
        && this.listCodePays.includes(dataArray[i].country.toUpperCase())
        && dataArray[i].numberStreet.length !== 0 && dataArray[i].street.length !== 0
        && dataArray[i].city.length !== 0 && dataArray[i].codePostal.length !== 0 && dataArray[i].country.length !==0
        && dataArray[i].hireDate.length !== 0 && this.isValidateDate(dataArray[i].hireDate) && this.isDateValide(dataArray[i].hireDate) && this.isPossibleHireDate(dataArray[i].birthDate, dataArray[i].hireDate)
        && this.isPossibleDepartDate(dataArray[i].hireDate, dataArray[i].departDate)){

 /*       this.compteService.getOne(dataArray[i].numCompte).subscribe((data)=>{
          if (data !== null){
            this.compteUpdatedDataArray.push(data);
          } else {
            this.compteCreatedDataArray.push(data);
          }
        });*/
        if ( dataArray[i].numCompte.length !== 0 && dataArray[i].idCptPc.length !== 0){
          //compte de type Cash
          compte.numCompte = dataArray[i].numCompte;
          compte.type = dataArray[i].type;
          compte.libCompte = dataArray[i].libCompte;
          compte.ouvert = dataArray[i].ouvert;
          compte.lettrage = dataArray[i].lettrage;
          compte.idCptPc = dataArray[i].idCptPc;
          compte.typeCompte = 'CASH';
          individu.nui = dataArray[i].nui;
          compte.individu = individu;
          this.compteDataArray.push(compte);
        }
        if ( dataArray[i].numCompte.length !== 0 && dataArray[i].idCptPc.length == 0 && (dataArray[i].statutAff.length !== 0 || dataArray[i].typage.length !== 0)){
          //compte de titSal
          compte.numCompte = dataArray[i].numCompte;
          compte.type = dataArray[i].type;
          compte.libCompte = dataArray[i].libCompte;
          compte.ouvert = dataArray[i].ouvert;
          compte.lettrage = dataArray[i].lettrage;
          compte.statutAff = dataArray[i].statutAff;
          compte.typage = dataArray[i].typage;
          compte.typeCompte = 'TIT';
          individu.nui = dataArray[i].nui;
          compte.individu = individu;
          this.compteDataArray.push(compte);

        }
      }

    }
  }
  /*buildFiscaliteDataArray(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      let fiscalite: Fiscalite = new Fiscalite();
      let adresse: Adresse = new Adresse();
      let individu: Individus = new Individus();
      this.fiscaliteService.getOne(dataArray[i].nif).subscribe((data)=>{
        if(data !== null){
          this.fiscaliteUpdatedDataArray.push(data);
        }else{
          this.fiscaliteCreatedDataArray.push(data);
        }
      })
      if (dataArray[i].nif.length !== 0){
        fiscalite.nif = dataArray[i].nif;
        individu.nui = dataArray[i].nui;
       // adresse.individu = individu;
        adresse.id = dataArray[i].nui.toUpperCase() + dataArray[i].numberStreet
        console.log('=========== Adresse: '+ adresse.id );
        fiscalite.adresse = adresse;
        this.fiscaliteDataArray.push(fiscalite);
      }
    }
  }*/

  selectFile($event){
    this.spinner.show();
    this.downloadDate = this.fillDate(new Date());
    this.downloadHour = this.fillDateHour(new Date());
    this.fileUploadedService.changeIsFileIsUploaded(true);
    let fileList = $event.srcElement.files;
    let file = fileList[0];
    if(file && file.name.endsWith(".csv")){
      this.fileName = file.name;
      this.cookieService.set('uploadFileName', this.cookieService.get('uploadFileName')+';'+file.name);
      this.audit.uploadFileName = file.name;
      this.appService.saveAudit(this.audit);
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0], 'ISO-8859-1');

      reader.onload = (data) => {

        let csvData = String(reader.result);
        //csvData = "data:text/csv;charset=utf-8,";
        let csvRecordsArray = csvData.split(/\r\n|\n/);
        // Check if the last row is empty. This works
        if(csvRecordsArray[csvRecordsArray.length-1] ===''){
          csvRecordsArray.pop()
        }
        let headers = csvRecordsArray && csvRecordsArray.length > 0 ? csvRecordsArray[0].split(";") : [];
        // bind headers with dataModelist
        let bindArray = this.getBindHeadersDataModelListArray(headers);

        //check is the headers are good or not
       this.BadHeaders = this.controleHeaders(headers);

        // create data bindArray
        this.dataArray = this.buildDataArray(bindArray, csvRecordsArray);

        if (!this.BadHeaders) {
         console.log(this.controleFile(this.dataArray, this.fileName));
        //Gestion des contrôles préalables
        this.controlePrealable(this.dataArray);
        //Gestion des contrôles du module individus
        this.controleModuleIndividu(this.dataArray);
        //Gestion des contrôles du module salarie
        this.controleModuleSalarie(this.dataArray);
        //Gestion des contrôles du module adresse
        this.controleModuleAdresse(this.dataArray);
        //Gestion des contrôles du module IBAN
        this.controleModuleIban(this.dataArray);

        //integration des données
        this.buildIndividusDataArray(this.dataArray);
        this.buildSalarieDataArray(this.dataArray);
        this.buildContactDataArray(this.dataArray);
        this.buildPaymentDataArray(this.dataArray);
        this.buildAdresseDataArray(this.dataArray);
        this.buildCompteDataArray(this.dataArray);
        //this.buildFiscaliteDataArray(this.dataArray);
      }
        this.spinner.hide();
        this.currentStep++;

        this.emmitErrors();

      };
    }
  }

  public emmitErrors() {
    this.errorMessages.emit({
      isControleFile: this.isControleFile,
      company_cd_unique: this.company_cd_unique,
      company_cd_required_line: this.company_cd_required_line,
      company_cd_listErreurLine: this.company_cd_listErreurLine,
      numIdentityUniqueRequired: this.numIdentityUniqueRequired,
      numIdentityUniqueRequiredLine: this.numIdentityUniqueRequiredLine,
      NUI_listErrorLine: this.NUI_listErrorLine,
      noDuplicateNUI: this.noDuplicateNUI,
      noDuplicateNUILine: this.noDuplicateNUILine,
      noDuplicateNUIListErrorLine: this.noDuplicateNUIListErrorLine,
      company_cd_required: this.company_cd_required,
      employee_id_required: this.employee_id_required,
      employee_id_required_line: this.employee_id_required_line,
      employeeIdListErrorLine: this.employeeIdListErrorLine,
      //employeeIdWellFormatted: this.employeeIdWellFormatted,
      //employeeIdWellFormattedLine: this.employeeIdWellFormattedLine,
      noEmployeeDuplicated: this.noEmployeeDuplicated,
      duplicateFirstName: this.duplicateFirstName,
      duplicateLastName: this.duplicateLastName,
      civilityRequired: this.civilityRequired,
      civilityRequiredLine: this.civilityRequiredLine,
      civilityRequiredListErrorLine: this.civilityRequiredListErrorLine,
      civilityFalseListErrorLine: this.civilityFalseListErrorLine,
      civilityFalseValue: this.civilityFalseValue,
      lastNameGiven: this.lastNameGiven,
      lastNameGivenline: this.lastNameGivenline,
      lastNameGivenListErrorLine: this.lastNameGivenListErrorLine,
      firstNameGiven: this.firstNameGiven,
      firstNameGivenline: this.firstNameGivenline,
      firstNameGivenListErrorLine: this.firstNameGivenListErrorLine,
      personalEmailValid: this.personalEmailValid,
      personalEmailValidLine: this.personalEmailValidLine,
      personalEmailValidListErrorLine: this.personalEmailValidListErrorLine,
      businessEmailValid: this.businessEmailValid,
      //phoneValid: this.phoneValid,
      //phoneValidLine: this.phoneValidLine,
      businessEmailValidLine: this.businessEmailValidLine,
      businessEmailValidListErrorLine: this.businessEmailValidListErrorLine,
      birthDateGiven: this.birthDateGiven,
      birthDateGivenListErrorLine: this.birthDateGivenListErrorLine,
      birthDateValidListErrorLine: this.birthDateValidListErrorLine,
      birthDateValid: this.birthDateValid,
      codePaysFound: this.codePaysFound,
      codePaysFoundLine: this.codePaysFoundLine,
      codePaysFoundListErrorLine: this.codePaysFoundListErrorLine,
      /*statusGiven: this.statusGiven,
      statusGivenLine: this.statusGivenLine,
      statusValid: this.statusValid,
      vipGiven: this.vipGiven,
      vipGivenLine: this.vipGivenLine,
      vipValid: this.vipValid,
      sensitiveGiven: this.sensitiveGiven,
      sensitiveGivenLine: this.sensitiveGivenLine,
      sensitiveValid: this.sensitiveValid,
      dateEndSensitiveValid: this.dateEndSensitiveValid,
      dateEndSensitiveValidLine: this.dateEndSensitiveValidLine,
      conformFlagSensitive: this.conformFlagSensitive,
      conformFlagSensitiveLine: this.conformFlagSensitiveLine,*/
      employeStatusGiven: this.employeStatusGiven,
      employeStatusGivenLine: this.employeStatusGivenLine,
      employeStatusGivenListErrorLine: this.employeStatusGivenListErrorLine,
      employeStatusValidListErrorLine: this.employeStatusValidListErrorLine,
      employeStatusValid: this.employeStatusValid,
      hireDateValid: this.hireDateValid,
      hireDateValidLine: this.hireDateValidLine,
      hireDateValidListErrorLine: this.hireDateValidListErrorLine,
      departDateValidListErrorLine: this.departDateValidListErrorLine,
      departDateValid: this.departDateValid,
      departDateValidLine: this.departDateValidLine,
      employeNoDepartDate: this.employeNoDepartDate,
      employeNoDepartDateLine: this.employeNoDepartDateLine,
      employeNoDepartDateListErrorLine: this.employeNoDepartDateListErrorLine,
      employeDepartDate: this.employeDepartDate,
      employeDepartDateLine: this.employeDepartDateLine,
      employeDepartDateListErrorLine: this.employeDepartDateListErrorLine,
      /*lastHireDateValid: this.lastHireDateValid,
      lastHireDateValidLine: this.lastHireDateValidLine,
      lastDepartDateValid: this.lastDepartDateValid,
      lastDepartDateValidLine: this.lastDepartDateValidLine,*/
      numberStreetIncomplet: this.numberStreetIncomplet,
      numberStreetIncompletLine: this.numberStreetIncompletLine,
      numberStreetIncompletListErrorLine: this.numberStreetIncompletListErrorLine,
      adressValid: this.adressValid,
      adressValidLine: this.adressValidLine,
      adressValidListErrorLine: this.adressValidListErrorLine,

      codeIsoCountryValid: this.codeIsoCountryValid,
      codeIsoCountryValidLine: this.codeIsoCountryValidLine,
      codeIsoCountryValidListErrorLine: this.codeIsoCountryValidListErrorLine,

      codeIsoNationalityValid: this.codeIsoNationalityValid,
      codeIsoNationalityValidLine: this.codeIsoNationalityValidLine,
      codeIsoNationalityValidListErrorLine: this.codeIsoNationalityValidListErrorLine,

      bicGiven: this.bicGiven,
      otherPaymentGiven: this.otherPaymentGiven,
      otherPaymentGivenLine: this.otherPaymentGivenLine,
      otherPaymentGivenListErrorLine: this.otherPaymentGivenListErrorLine,
      bicGivenLine: this.bicGivenLine,
      bicGivenListErrorLine: this.bicGivenListErrorLine,
      bicValid: this.bicValid,
      bicValidLine: this.bicValidLine,
      bicValidListErrorLine: this.bicValidListErrorLine,
      ibanValid: this.ibanValid,
      noIbanDuplicate: this.noIbanDuplicate,
      noIbanDuplicateLine: this.noIbanDuplicateLine,
      noIbanDuplicateListErrorLine: this.noIbanDuplicateListErrorLine,
      ibanValidLine: this.ibanValidLine,
      ibanValidListErrorLine: this.ibanValidListErrorLine,
      bicIbanValid: this.bicIbanValid,
      bicIbanValidLine: this.bicIbanValidLine,
      bicIbanValidListErrorLine: this.bicIbanValidListErrorLine,
      BadHeaders: this.BadHeaders,
      fileName: this.fileName,
      downloadDate: this.downloadDate,
      downloadHour: this.downloadHour,
      companyName: this.companyName
    });
  }
  controlePrealable(dataArray){
    this.isControleFile  = this.controleFile(dataArray, this.fileName);
    this.company_cd_required = this.isCompanyCdCorrect(dataArray);
    this.company_cd_unique = this.isCompanyCdUnique(dataArray);
    this.employee_id_required = this.isEmployeeIdCorrect(dataArray);
    this.numIdentityUniqueRequired = this.isNumIdentityUnique(dataArray);
    this.noDuplicateNUI = this.isNoDuplicateNUI(dataArray);
    //this.employeeIdWellFormatted = this.isEmployeeIdWellFormatted(dataArray);
    this.noEmployeeDuplicated = this.isEmployeeNoDuplicated(dataArray);
  }
  controleModuleIndividu(dataArray){
    this.civilityRequired = this.isCivilityRequired(dataArray);
    this.civilityFalseValue = this.isCivilityFalseValue(dataArray);
    this.lastNameGiven = this.isLastNameGiven(dataArray);
    this.firstNameGiven = this.isFirstNameGiven(dataArray);
    this.personalEmailValid = this.isPersonalEmailValid(dataArray);
    this.businessEmailValid = this.isBusinessEmailValid(dataArray);
    //this.phoneValid = this.isPhoneValid(dataArray);
    this.birthDateGiven = this.isBirthDateGiven(dataArray);
    this.birthDateValid = this.isBirthDateValid(dataArray);
    /*this.statusGiven = this.isStatusGiven(dataArray);
    this.statusValid = this.isStatusValid(dataArray);
    this.vipGiven = this.isVipGiven(dataArray);
    this.vipValid = this.isVipValid(dataArray);
    this.sensitiveGiven = this.isSensitiveGiven(dataArray);
    this.sensitiveValid = this.isSensitiveValid(dataArray);
    this.dateEndSensitiveValid = this.isDateEndSensitiveValid(dataArray);
    this.conformFlagSensitive = this.isConformFlagSensitive(dataArray);*/
    this.codePaysFound = this.isCodeIsoValid(dataArray);
    this.codeIsoNationalityValid = this.isCodeIsoNationalityValid(dataArray);

  }
  controleModuleSalarie(dataArray){
    this.employeStatusGiven = this.isEmployeStatusGiven(dataArray);
    this.employeStatusValid = this.isEmployeStatusValid(dataArray);
    this.hireDateValid = this.isHireDateValide(dataArray);
    this.departDateValid = this.isDepartDateValide(dataArray);
    this.employeNoDepartDate = this.isEmployeNoDepartDate(dataArray);
    this.employeDepartDate = this.isEmployeDepartDate(dataArray);
    /*this.lastHireDateValid = this.isLastHireDateValide(dataArray);
    this.lastDepartDateValid = this.isLastDepartDateValide(dataArray);*/

  }
  controleModuleAdresse(dataArray){
    this.numberStreetIncomplet = this.isNumberStreetIncomplet(dataArray);
    this.adressValid = this.isAdressValid(dataArray);
    this.codeIsoCountryValid = this.isCodeIsoCountryValid(dataArray);
  }
  controleModuleIban(dataArray){
    this.bicGiven = this.isIbanGiven(dataArray);
    this.otherPaymentGiven = this.isOtherPaymentGiven(dataArray);
    this.ibanValid = this.isValidIban(dataArray);
    this.noIbanDuplicate = this.isNoIbanDuplicate(dataArray);
    this.bicValid = this.isValidBic(dataArray);
    this.bicIbanValid = this.isBicIbanValid(dataArray);
  }

  async sendIndividusToServer(){
      /*this.individusService.addAll(this.individusDataArray).subscribe((data)=>{
      this.dataFromServer = data;
      this.dataSentToServer=true;
      this.updateData.emit(data);
      this.sendSalarieToServer();
      this.sendContactToServer();
      this.sendIbanToServer();
      this.sendAdresseToServer();
      this.sendCompteToServer();
      this.individuReportUpdateFile.nbreLinesUpdated = this.individusUpdatedDataArray.length;
      this.individuReportCreateFile.nbreLinesCreated = this.individusCreatedDataArray.length;
      if(this.individusCreatedDataArray.length > 0){
        this.reportCreateFileService.add(this.individuReportCreateFile).subscribe();
      }
      if(this.individusUpdatedDataArray.length > 0){
        this.reportUpdateFileService.add(this.individuReportUpdateFile).subscribe();
      }

    });*/
  }

  sendSalarieToServer(){
   /* this.salarieService.addAll(this.salarieDataArray).subscribe((data)=>{
      this.salaryReportCreateFile.nbreLinesCreated = this.salarieCreatedDataArray.length;
      this.salaryReportUpdateFile.nbreLinesUpdated = this.salarieUpdatedDataArray.length;
      if(this.salarieCreatedDataArray.length > 0){
        this.reportCreateFileService.add(this.salaryReportCreateFile).subscribe();
      }
      if(this.salarieUpdatedDataArray.length > 0){
        this.reportUpdateFileService.add(this.salaryReportUpdateFile).subscribe();
      }
    });*/
  }
  sendContactToServer(){
   /* this.contactService.addAll(this.contactDataArray).subscribe(data=>{
      this.contactReportCreateFile.nbreLinesCreated = this.contactCreatedDataArray.length;
      this.contactReportUpdateFile.nbreLinesUpdated = this.contactUpdatedDataArray.length;
      if(this.contactCreatedDataArray.length > 0){
        this.reportCreateFileService.add(this.contactReportCreateFile).subscribe();
      }
      if(this.contactUpdatedDataArray.length > 0){
        this.reportUpdateFileService.add(this.contactReportUpdateFile).subscribe();
      }
    });*/
  }
  sendIbanToServer(){
    /*this.paymentService.addAll(this.paymentDataArray).subscribe( data=>{
      this.paymentReportCreateFile.nbreLinesCreated = this.paymentCreatedDataArray.length;
      this.paymentReportUpdateFile.nbreLinesUpdated = this.paymentUpdatedDataArray.length;
      if(this.paymentCreatedDataArray.length > 0){
        this.reportCreateFileService.add(this.paymentReportCreateFile).subscribe();
      }
      if(this.paymentUpdatedDataArray.length > 0){
        this.reportUpdateFileService.add(this.paymentReportUpdateFile).subscribe();
      }
    });*/
  }
  sendAdresseToServer(){
   /* this.adresseService.addAll(this.adresseDataArray).subscribe( (data) =>{
      //this.sendFiscaliteToServer();
      this.adresseReportCreateFile.nbreLinesCreated = this.adresseCreatedDataArray.length;
      this.adresseReportUpdateFile.nbreLinesUpdated = this.adresseUpdatedDataArray.length;
      if(this.adresseCreatedDataArray.length > 0){
        this.reportCreateFileService.add(this.adresseReportCreateFile).subscribe();
      }
      if(this.adresseUpdatedDataArray.length > 0){
        this.reportUpdateFileService.add(this.adresseReportUpdateFile).subscribe();
      }
    });*/
  }
  sendCompteToServer(){
    /*this.compteService.addAll(this.compteDataArray).subscribe( data=>{
      this.compteReportCreateFile.nbreLinesCreated = this.compteCreatedDataArray.length;
      this.compteReportUpdateFile.nbreLinesUpdated = this.compteUpdatedDataArray.length;
      if(this.compteCreatedDataArray.length > 0){
        this.reportCreateFileService.add(this.compteReportCreateFile).subscribe();
      }
      if(this.compteUpdatedDataArray.length > 0){
        this.reportUpdateFileService.add(this.compteReportUpdateFile).subscribe();
      }
      this.positionService.addAll(this.positionDataArray).subscribe();
    });*/
  }
  /*sendFiscaliteToServer(){
    this.fiscaliteService.addAll(this.fiscaliteDataArray).subscribe();
  }*/
  async sendDataToServer(){
    this.spinner.show();
    await this.sendIndividusToServer();
    this.currentStep = 3;
    this.spinner.hide();
    this.fileUploadedService.changeIsFileIsUploaded(false);
  }

  isCompanyCdCorrect(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].company_CD.length === 0){
        this.company_cd_required_line += i;
        this.company_cd_listErreurLine.push(i+2)
        this.currentStep = -1;
      }
    }
    if(this.company_cd_listErreurLine.length > 0){
      return false
    }else{
      return true;
    }
  }
  isCompanyCdUnique(dataArray){
    for (let i = 0; i < dataArray.length -1; i++){
      if(dataArray[i].company_CD !== dataArray[i+1].company_CD){
        this.currentStep = -1;
        return false;
      }
    }
    return true;
  }
  isEmployeeIdCorrect(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].employeeId.length === 0){
        this.employee_id_required_line += i;
        this.employeeIdListErrorLine.push(i+2);
        this.currentStep = -1;
      }
    }
    if(this.employeeIdListErrorLine.length > 0){
      return false;
    }else{
      return true;
    }
  }
  isNumIdentityUnique(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].nui.length === 0){
        this.numIdentityUniqueRequiredLine += i;
        this.NUI_listErrorLine.push(i+2);
        this.currentStep = -1;
      }
    }
    if(this.NUI_listErrorLine.length > 0){
      return false;
    }else{
      return true;
    }
  }
  isNoDuplicateNUI(dataArray){
    for (let i = 0; i < dataArray.length -1; i++){
      if(dataArray[i].nui === dataArray[i+1].nui){
        this.noDuplicateNUILine += i;
        this.noDuplicateNUIListErrorLine.push(i+2);
        this.currentStep = -1;
      }
    }
    if(this.noDuplicateNUIListErrorLine.length > 0){
      return false;
    }else{
      return true;
    }
  }
  /*isEmployeeIdWellFormatted(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].company_CD.toLowerCase()+'_'+dataArray[i].nui.toLowerCase()!== dataArray[i].employeeId.toLowerCase()){
        this.employeeIdWellFormattedLine += i;
        this.currentStep = -1;
        return false;
      }
    }
    return true;
  }*/
  isEmployeeNoDuplicated(dataArray){
    for (let i = 0; i < dataArray.length -1; i++){
      if((dataArray[i].nui.toLowerCase() === dataArray[i+1].nui.toLowerCase()) && (dataArray[i].employeeId.toLowerCase() === dataArray[i+1].employeeId.toLowerCase())){
        this.currentStep = -1;
        this.duplicateFirstName = dataArray[i].firstName;
        this.duplicateLastName = dataArray[i].lastName;
        return false;
      }
    }
    return true;
  }
  isCivilityRequired(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].civility.length === 0){
        this.civilityRequiredLine += i;
        this.civilityRequiredListErrorLine.push(i+2);
      }
    }
    if(this.civilityRequiredListErrorLine.length > 0){
      return false;
    }else{
      return true;
    }
  }
  isCivilityFalseValue(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].civility.length !== 0 && +dataArray[i].civility !== 1 && +dataArray[i].civility !== 2 && +dataArray[i].civility !== 3){
        this.civilityRequiredLine += i;
        this.civilityFalseListErrorLine.push(i+2);
      }
    }
    if(this.civilityFalseListErrorLine.length > 0){
      return false;
    }else{
      return true;
    }
  }
  isFirstNameGiven(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].firstName.length === 0){
        this.firstNameGivenline += i;
        this.firstNameGivenListErrorLine.push(i+2);
      }
    }
    if(this.firstNameGivenListErrorLine.length > 0){
      return false;
    }else{
      return true;
    }
  }
  isLastNameGiven(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].lastName.length === 0){
        this.lastNameGivenline += i;
        this.lastNameGivenListErrorLine.push(i+2);
      }
    }
    if(this.lastNameGivenListErrorLine.length > 0){
      return false;
    }else{
      return true;
    }
  }
  isValidateEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  isValidateDate(date){
    let re = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
    return re.test(date);
  }
  isPersonalEmailValid(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].personalEmail.length !== 0 && !this.isValidateEmail(dataArray[i].personalEmail)){
        this.personalEmailValidLine += i;
        this.personalEmailValidListErrorLine.push(i+2);
      }
    }
    if(this.personalEmailValidListErrorLine.length > 0){
      return false;
    }else{
      return true;
    }
  }
  isBusinessEmailValid(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].businessEmail.length !== 0 && !this.isValidateEmail(dataArray[i].businessEmail)){
        this.businessEmailValidLine += i;
        this.businessEmailValidListErrorLine.push(i+2);
      }
    }
    if(this.businessEmailValidListErrorLine.length > 0){
      return false;
    }else{
      return true;
    }
  }
  /*isPhoneValid(dataArray){
    for(let i =  0; i < dataArray.length; i++){
      if((dataArray[i].homePhone.length !== 0 && !dataArray[i].homePhone.startsWith('00'))
          || (dataArray[i].businessPhone.length !== 0 && !dataArray[i].businessPhone.startsWith('00'))
          || (dataArray[i].cellPhone.length !== 0 && !dataArray[i].cellPhone.startsWith('00'))){
        this.phoneValidLine += i;
        return false;
      }
    }
    return true;
  }*/

  isBirthDateGiven(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].birthDate.length === 0){
        this.birthDateValidLine += i;
        this.birthDateGivenListErrorLine.push(i+2);
      }
    }
    if(this.birthDateGivenListErrorLine.length > 0){
      return false;
    }else{
      return true;
    }
  }

  isBirthDateValid(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].birthDate.length !== 0 && !this.isValidateDate(dataArray[i].birthDate)){
        this.birthDateValidLine += i;
        this.birthDateValidListErrorLine.push(i+2);
      }
      if(dataArray[i].birthDate.length !== 0 && this.isValidateDate(dataArray[i].birthDate) && !this.isDateValide(dataArray[i].birthDate)){
        this.birthDateValidLine += i;
        this.birthDateValidListErrorLine.push(i+2);
      }
      if(dataArray[i].birthDate.length !== 0 && this.isValidateDate(dataArray[i].birthDate) && this.isDateValide(dataArray[i].birthDate) && !this.isAgeValide(dataArray[i].birthDate)){
        this.birthDateValidLine += i;
        this.birthDateValidListErrorLine.push(i+2);
      }
    }
    if(this.birthDateValidListErrorLine.length > 0){
      return false;
    }else{
      return true;
    }
  }
  /*isDateEndSensitiveValid(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].dateEndSensitive.length !== 0 && !this.isValidateDate(dataArray[i].dateEndSensitive)){
        this.dateEndSensitiveValidLine += i;
        return false;
      }
      if(dataArray[i].dateEndSensitive.length !== 0 && this.isValidateDate(dataArray[i].dateEndSensitive) && !this.isDateValide(dataArray[i].dateEndSensitive)){
        this.dateEndSensitiveValidLine += i;
        return false;
      }
    }
    return true;
  }*/

/*  isStatusGiven(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].statut.length === 0){
        this.statusGivenLine += i;
        return false;
      }
    }
    return true;
  }*/
 /* isStatusValid(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].statut.length !== 0 && dataArray[i].statut.toUpperCase() !== 'A' && dataArray[i].statut.toUpperCase() !== 'D'){
        this.statusGivenLine += i;
        return false;
      }
    }
    return true;
  }*/

  isEmployeStatusGiven(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].employeeStatus.length === 0){
        this.employeStatusGivenLine += i;
        this.employeStatusGivenListErrorLine.push(i+2);
      }
    }
    if(this.employeStatusGivenListErrorLine.length > 0){
      return false;
    }else{
      return true;
    }
  }
  isEmployeStatusValid(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].employeeStatus.length !== 0 && dataArray[i].employeeStatus.toUpperCase() !== 'P' && dataArray[i].employeeStatus.toUpperCase() !== 'S' && dataArray[i].employeeStatus.toUpperCase() !== 'R'){
        this.employeStatusGivenLine += i;
        this.employeStatusValidListErrorLine.push(i+2);
      }
    }
    if(this.employeStatusValidListErrorLine.length > 0){
      return false;
    }else{
      return true;
    }
  }

  /*isVipGiven(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].vip.length === 0){
        this.vipGivenLine += i;
        return false;
      }
    }
    return true;
  }*/
  /*isVipValid(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].vip.length !== 0 && dataArray[i].vip.toUpperCase() !== 'Y' && dataArray[i].vip.toUpperCase() !== 'N'){
        this.vipGivenLine += i;
        return false;
      }
    }
    return true;
  }
*/
  /*isSensitiveGiven(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].mySensitive.length === 0){
        this.sensitiveGivenLine += i;
        return false;
      }
    }
    return true;
  }*/
  /*isSensitiveValid(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].mySensitive.length !== 0 && dataArray[i].mySensitive.toUpperCase() !== 'Y' && dataArray[i].mySensitive.toUpperCase() !== 'N'){
        this.sensitiveGivenLine += i;
        return false;
      }
    }
    return true;
  }*/
/*  isConformFlagSensitive(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].dateEndSensitive.length > 0 && dataArray[i].mySensitive.toUpperCase() !== 'Y'){
        this.conformFlagSensitiveLine += i;
        return false;
      }
    }
    return true;
  }*/

  isCodeIsoValid(dataArray){
    //let isFound = false;
    for (let i = 0; i < this.COUNTRY.length; i++){

      for (let j = 0; j < dataArray.length; j++){
        if (this.COUNTRY[i].code.toUpperCase() === dataArray[j].birthCountry.toUpperCase()){
          //isFound = true;
          this.insertCodePays = true;
          this.listCodePays.push(this.COUNTRY[i].code);
          this.listLibPays.push(this.COUNTRY[i].name);
        }
      }

    }

    for (let i = 0; i < dataArray.length; i++) {
      if(!this.listCodePays.includes(dataArray[i].birthCountry.toUpperCase())){
        //isFound = false;
        //this.insertCodePays = false;
        this.codePaysFoundLine+=i;
        this.codePaysFoundListErrorLine.push(i+2);
        //break;
      }
    }
    if(this.codePaysFoundListErrorLine.length > 0){
      return false;
    }else {
      return true;
    }

    //return isFound;
  }
  isCodeIsoCountryValid(dataArray){
    //let isFound = false;
    for (let i = 0; i < this.COUNTRY.length; i++){

      for (let j = 0; j < dataArray.length; j++){
        if (this.COUNTRY[i].code.toUpperCase() === dataArray[j].country.toUpperCase()){
          //isFound = true;
          this.listCodeCountry.push(this.COUNTRY[i].code);
          this.listLibCountry.push(this.COUNTRY[i].name);
        }
      }

    }

    for (let i = 0; i < dataArray.length; i++) {
      if(!this.listCodeCountry.includes(dataArray[i].country.toUpperCase())){
        //isFound = false;
        this.codeIsoCountryValidLine+=i;
        this.codeIsoCountryValidListErrorLine.push(i+2);
      }
    }
    if(this.codeIsoCountryValidListErrorLine.length > 0){
      return false;
    }else{
      return true;
    }
  }

  isCodeIsoNationalityValid(dataArray){
    //let isFound = false;
    for (let i = 0; i < this.COUNTRY.length; i++){

      for (let j = 0; j < dataArray.length; j++){
        if (this.COUNTRY[i].code.toUpperCase() === dataArray[j].nationality.toUpperCase()){
          //isFound = true;
          this.listCodeCountry.push(this.COUNTRY[i].code);
          this.listLibCountry.push(this.COUNTRY[i].name);
        }
      }

    }

    for (let i = 0; i < dataArray.length; i++) {
      if(!this.listCodeCountry.includes(dataArray[i].nationality.toUpperCase())){
        //isFound = false;
        this.codeIsoNationalityValidLine+=i;
        this.codeIsoNationalityValidListErrorLine.push(i+2);
      }
    }
    if(this.codeIsoNationalityValidListErrorLine.length > 0){
      return false;
    }else{
      return true;
    }
  }
  isBissextile(year){
    //vérifier que le l année est bien fournie et la convertir en string si il faut
    return (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0));
  }

  isDateValide(date){
    let parts = date.split('/');
    let year =  new Date(Date.parse(date)).getFullYear();
    let month = new Date(Date.parse(date)).getMonth()+1;
    let day = new Date(Date.parse(date)).getDate();

    if (year === 1970 && month ===1 && day ===1 && year !== +parts[2]){
      return false;
    }else {
      return true;
    }
  }
  isAgeValide(date){
    let year =  new Date(Date.parse(date)).getFullYear();
    let thisYear = new Date().getFullYear();
    if ( thisYear - year < 18 || thisYear - year > 100){
      return false;
    }else{
      return true;
    }
  }
  isPossibleHireDate(birthdate, hireDate){
    let birthYear =  new Date(Date.parse(birthdate));
    let hireYear = new Date(Date.parse(hireDate));
    let currentYear = new Date();
    if ( birthYear >= hireYear || hireYear > currentYear || (hireYear.getFullYear() - birthYear.getFullYear()) < 18){
      return false;
    }else{
      return true;
    }
  }
  isPossibleDepartDate(hireDate, departDate){
    let hireYear =  new Date(Date.parse(hireDate));
    let departYear = new Date(Date.parse(departDate));
    let currentYear = new Date();
    if ( hireYear >= departYear || departYear > currentYear ){
      return false;
    }else{
      return true;
    }
  }
  isHireDateValide(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].hireDate.length !== 0 && !this.isValidateDate(dataArray[i].hireDate)){
        this.hireDateValidLine += i;
        this.hireDateValidListErrorLine.push(i+2);
      }
      if(dataArray[i].hireDate.length !== 0 && this.isValidateDate(dataArray[i].hireDate) && !this.isDateValide(dataArray[i].hireDate)){
        this.hireDateValidLine += i;
        this.hireDateValidListErrorLine.push(i+2);
      }
      if(dataArray[i].hireDate.length !== 0 && this.isValidateDate(dataArray[i].hireDate) && this.isDateValide(dataArray[i].hireDate) && !this.isPossibleHireDate(dataArray[i].birthDate, dataArray[i].hireDate)){
        this.hireDateValidLine += i;
        this.hireDateValidListErrorLine.push(i+2);
      }
    }
    if(this.hireDateValidListErrorLine.length > 0){
      return false;
    }else{
      return true;
    }
  }
/*  isLastHireDateValide(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].lastHireDate.length !== 0 && !this.isValidateDate(dataArray[i].lastHireDate)){
        this.lastHireDateValidLine += i;
        return false;
      }
      if(dataArray[i].lastHireDate.length !== 0 && this.isValidateDate(dataArray[i].lastHireDate) && !this.isDateValide(dataArray[i].lastHireDate)){
        this.lastHireDateValidLine += i;
        return false;
      }
      if(dataArray[i].lastHireDate.length !== 0 && this.isValidateDate(dataArray[i].lastHireDate) && this.isDateValide(dataArray[i].lastHireDate) && !this.isPossibleDepartDate(dataArray[i].hireDate, dataArray[i].lastHireDate)){
        this.lastHireDateValidLine += i;
        return false;
      }
    }
    return true;
  }*/
  isDepartDateValide(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].departDate.length !== 0 && !this.isValidateDate(dataArray[i].departDate)){
        this.departDateValidLine += i;
        this.departDateValidListErrorLine.push(i+2);
      }
      if(dataArray[i].departDate.length !== 0 && this.isValidateDate(dataArray[i].departDate) && !this.isDateValide(dataArray[i].departDate)){
        this.departDateValidLine += i;
        this.departDateValidListErrorLine.push(i+2);
      }
      if(dataArray[i].departDate.length !== 0 && this.isValidateDate(dataArray[i].departDate) && this.isDateValide(dataArray[i].departDate) && !this.isPossibleDepartDate(dataArray[i].hireDate, dataArray[i].departDate)){
        this.departDateValidLine += i;
        this.departDateValidListErrorLine.push(i+2);
      }
    }
    if(this.departDateValidListErrorLine.length > 0){
      return false;
    }else{
      return true;
    }
  }
 /* isLastDepartDateValide(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].lastDepartDate.length !== 0 && !this.isValidateDate(dataArray[i].lastDepartDate)){
        this.lastDepartDateValidLine += i;
        return false;
      }
      if(dataArray[i].lastDepartDate.length !== 0 && this.isValidateDate(dataArray[i].lastDepartDate) && !this.isDateValide(dataArray[i].lastDepartDate)){
        this.lastDepartDateValidLine += i;
        return false;
      }
      if(dataArray[i].lastDepartDate.length !== 0 && this.isValidateDate(dataArray[i].lastDepartDate) && this.isDateValide(dataArray[i].lastDepartDate) && !this.isPossibleDepartDate(dataArray[i].departDate, dataArray[i].lastDepartDate)){
        this.lastDepartDateValidLine += i;
        return false;
      }
      if(dataArray[i].lastDepartDate.length !== 0 && this.isValidateDate(dataArray[i].lastDepartDate) && this.isDateValide(dataArray[i].lastDepartDate) && !this.isPossibleDepartDate(dataArray[i].lastHireDate, dataArray[i].lastDepartDate)){
        this.lastDepartDateValidLine += i;
        return false;
      }
    }
    return true;
  }*/
  isEmployeNoDepartDate(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if (dataArray[i].employeeStatus.toUpperCase() === 'P' && dataArray[i].departDate.length !== 0){
        this.employeNoDepartDateLine += i;
        this.employeNoDepartDateListErrorLine.push(i+2);
      }
    }
    if(this.employeNoDepartDateListErrorLine.length > 0){
      return false;
    }else{
      return true;
    }
  }
  isEmployeDepartDate(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if ((dataArray[i].employeeStatus.toUpperCase() === 'S' || dataArray[i].employeeStatus.toUpperCase() === 'R') && dataArray[i].departDate.length === 0){
        this.employeDepartDateLine += i;
        this.employeDepartDateListErrorLine.push(i+2);
      }
    }
    if(this.employeDepartDateListErrorLine.length > 0){
      return false;
    }else{
      return true;
    }
  }
  isNumberStreetIncomplet(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].numberStreet.length === 0 || dataArray[i].street.length === 0){
        this.numberStreetIncompletLine += i;
        this.numberStreetIncompletListErrorLine.push(i+2);
      }
    }
    if(this.numberStreetIncompletListErrorLine.length > 0){
      return false;
    }else{
      return true;
    }
  }
  isAdressValid(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].city.length === 0 || dataArray[i].codePostal.length === 0 || dataArray[i].country.length ===0){
        this.adressValidLine += i;
        this.adressValidListErrorLine.push(i+2);
      }
    }
    if(this.adressValidListErrorLine.length > 0){
      return false;
    }else{
      return true;
    }
  }
  isIbanGiven(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if((dataArray[i].bic.length !== 0 && dataArray[i].otherPayment.length === 0 && dataArray[i].iban.length === 0)
        || (dataArray[i].bic.length === 0 && dataArray[i].iban.length !== 0)){
        this.bicGivenLine += i;
        this.bicGivenListErrorLine.push(i+2);
      }
    }
    if(this.bicGivenListErrorLine.length > 0){
      return false;
    }else{
      return true;
    }
  }

  isOtherPaymentGiven(dataArray){
    for(let i = 0; i < dataArray.length; i ++){
      if(dataArray[i].bic.length === 0 && dataArray[i].otherPayment.length !==0){
        this.otherPaymentGivenLine += i;
        this.otherPaymentGivenListErrorLine.push(i+2);
      }
    }
    if(this.otherPaymentGivenListErrorLine.length > 0){
      return false;
    }else{
      return true;
    }
  }

  isValidIban(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].iban.length !== 0 && !this.isValidIBANNumber(dataArray[i].iban)){
        this.ibanValidLine += i;
        this.ibanValidListErrorLine.push(i+2);
      }
    }
    if(this.ibanValidListErrorLine.length > 0){
      return false;
    }else{
      return true;
    }
  }
  isNoIbanDuplicate(dataArray){
    for (let i = 0; i < dataArray.length -1; i++){
      if(dataArray[i].iban.length !== 0){
        if((dataArray[i].iban.trim() === dataArray[i+1].iban.trim())){
          this.noIbanDuplicateLine += i;
          this.noIbanDuplicateListErrorLine.push(i+2);
        }
      }

    }
    if(this.noIbanDuplicateListErrorLine.length > 0){
      return false;
    }else{
      return true;
    }
  }



  isValidIBANNumber(input) {
    let CODE_LENGTHS = {
      AD: 24, AE: 23, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22, BH: 22, BR: 29,
      CH: 21, CR: 21, CY: 28, CZ: 24, DE: 22, DK: 18, DO: 28, EE: 20, ES: 24,
      FI: 18, FO: 18, FR: 27, GB: 22, GI: 23, GL: 18, GR: 27, GT: 28, HR: 21,
      HU: 28, IE: 22, IL: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20, LB: 28,
      LI: 21, LT: 20, LU: 20, LV: 21, MC: 27, MD: 24, ME: 22, MK: 19, MR: 27,
      MT: 31, MU: 30, NL: 18, NO: 15, PK: 24, PL: 28, PS: 29, PT: 25, QA: 29,
      RO: 24, RS: 22, SA: 24, SE: 24, SI: 19, SK: 24, SM: 27, TN: 24, TR: 26
    };

    let iban = input.toUpperCase().replace(/[^A-Z0-9]/g, ''),
      code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/),
      digits;

    if (!code || iban.length !== CODE_LENGTHS[code[1]]) {
      return false;
    }

    digits = (code[3] + code[1] + code[2]).replace(/[A-Z]/g, function (letter) {
      return letter.charCodeAt(0) - 55;
    });

    return this.mod97(digits) === 1;
  }
  mod97(string) {
    let checksum = string.slice(0, 2), fragment;

    for (let offset = 2; offset < string.length; offset += 7) {
      fragment = checksum + string.substring(offset, offset + 7);
      checksum = parseInt(fragment, 10) % 97;
    }

    return checksum;
  }
  isBic(value){
    return /^([A-Z]{6}[A-Z2-9][A-NP-Z1-9])(X{3}|[A-WY-Z0-9][A-Z0-9]{2})?$/.test( value.toUpperCase() );
  }
  isDateFile(value){
    return /^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/.test(value)
  }
  isValidBic(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].bic.length !== 0 && !this.isBic(dataArray[i].bic)){
        this.bicValidLine += i;
        this.bicValidListErrorLine.push(i+2);
      }
    }
    if(this.bicValidListErrorLine.length > 0){
      return false;
    }else{
      return true;
    }
  }

  isBicIbanValid(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].otherPayment.length === 0 && dataArray[i].bic.substr(4,2) !== dataArray[i].iban.substr(0, 2)){
        this.bicIbanValidLine += i;
        this.bicIbanValidListErrorLine.push(i+2);
      }
    }
    if(this.bicIbanValidListErrorLine.length > 0){
      return false;
    }else{
      return true;
    }
  }

  public downloadPDF(){
    let doc = new jsPDF();
    let file = "fileUploadError"+new Date()+".pdf";
    let  specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };
    let content = this.content.nativeElement;

    doc.fromHTML(content.innerHTML, 15, 15, {
      'width': 190,
      'elementHandlers': specialElementHandlers
    });

    doc.save(file);

  }

  public downloadReportPDF(){
    let doc = new jsPDF();
    let file = "report"+new Date()+".pdf";
    let  specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };
    let report = this.report.nativeElement;

    doc.fromHTML(report.innerHTML, 15, 15, {
      'width': 190,
      'elementHandlers': specialElementHandlers
    });

    doc.save(file);

  }

  private isNoIgnoredLine(dataArray){
   /* if(this.civilityRequired && this.civilityFalseValue && this.lastNameGiven && this.firstNameGiven
       && this.birthDateGiven && this.birthDateValid && this.codePaysFound && this.statusGiven && this.statusValid
       && this.vipGiven && this.vipValid && this.sensitiveGiven && this.sensitiveValid && this.dateEndSensitiveValid
       && this.conformFlagSensitive && this.employeStatusGiven && this.employeStatusValid && this.hireDateValid && this.departDateValid
       && this.employeNoDepartDate && this.employeDepartDate && this.lastHireDateValid && this.lastDepartDateValid){
      return true;
    }else{
      return false;
    }*/
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].lastName.length !== 0){
        this.lastNameGivenline += i;
        return true;
      }
    }
    return false;

  }


  public downloadPDFModules($event:any){
    let audit: Audit = new Audit();
    this.typeOfReport = 'affiliation';
    $event.preventDefault();
    $event.stopPropagation();
    Filemanagement.downloadPDFModules(this.report.nativeElement.innerHTML, this.typeOfReport);
    this.currentStep = 4;
    this.cookieService.set('reportFileName', this.cookieService.get('reportFileName')+';reportFile'+new Date()+'.pdf');
    audit.reportFileName = 'reportFile'+new Date()+'.pdf';
    this.appService.saveAudit(audit);

  }
  fillDate(date:any) {
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

  fillDateHour(date:any) {
    let hour = String(new Date(Date.parse(date)).getHours());
    let munite = String(new Date(Date.parse(date)).getMinutes());

    if (Number(hour) >= 1 && Number(hour) <= 9) {
      hour = '0' + hour;
    }
    if(Number(munite) >= 1 && Number(munite) <= 9) {
      munite = '0' + munite;
    }
    return hour + ':' + munite;
  }


}
