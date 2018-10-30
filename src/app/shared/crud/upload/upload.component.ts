import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DataModel} from '../../data.model';
import {CrudService} from '../../crud.service';
import {COUNTRY} from '../../countries.code';
import * as jsPDF from 'jspdf';
import {Individus} from '../../individus.model';
import {IndividusService} from '../../../individus/individus.service';
import {Salarie} from '../../salarie.model';
import {SalarieService} from '../../../salarie/salarie.service';
import {ContactService} from '../../../contact/contact.service';
import {Contact} from '../../contact.model';
import {Payment} from '../../payment.model';
import {PaymentService} from '../../../payment/payment.service';
import {Adresse} from '../../adresse.model';
import {AdresseService} from '../../../adresse/adresse.service';
import {CompteService} from '../../../compte/compte.service';
import {Compte} from '../../compte.model';
import {FiscaliteService} from '../../../fiscalite/fiscalite.service';
import {Filemanagement} from "../../../common/filemanagement";
import {ReportCreateFileService} from '../../../report-create-file/report.create.file.service';
import {ReportUpdateFileService} from '../../../report-update-file/report.update.file.service';
import {ReportCreateFile} from '../../report.create.file.model';
import {ReportUpdateFile} from '../../report.update.file.model';

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
  adresseDataArray: Adresse[] = [];
  adresseCreatedDataArray: Adresse[] = [];
  adresseUpdatedDataArray: Adresse[] = [];
  compteDataArray: Compte[] = [];
  compteCreatedDataArray: Compte[] = [];
  compteUpdatedDataArray: Compte[] = [];

  nbreLigneRejete: number = 0;

  currentStep = 1;

  selectedStep = 1;

  dataFromServer: any = null;

  dataSentToServer: boolean = false;

  company_cd_required: boolean = true;
  company_cd_required_line: number= 1;
  company_cd_unique: boolean = true;

  employee_id_required: boolean = true;
  employee_id_required_line: number = 1;
  employeeIdWellFormatted: boolean = true;
  employeeIdWellFormattedLine: number = 1;

  numIdentityUniqueRequired: boolean = true;
  numIdentityUniqueRequiredLine: number = 1;

  civilityRequired: boolean = true;
  civilityRequiredLine: number = 1;
  civilityFalseValue: boolean = true;

  statusGiven: boolean = true;
  statusGivenLine: number = 1;
  statusValid: boolean = true;

  employeStatusGiven: boolean = true;
  employeStatusGivenLine: number = 1;
  employeStatusValid: boolean = true;

  vipGiven: boolean = true;
  vipGivenLine: number = 1;
  vipValid: boolean = true;

  sensitiveGiven: boolean = true;
  sensitiveGivenLine: number = 1;
  sensitiveValid: boolean = true;

  conformFlagSensitive: boolean = true;
  conformFlagSensitiveLine: number = 1;

  lastNameGiven: boolean = true;
  lastNameGivenline: number = 1;

  numberStreetIncomplet: boolean = true;
  numberStreetIncompletLine: number = 1;
  adressValid: boolean = true;
  adressValidLine: number = 1;

  firstNameGiven: boolean = true;
  firstNameGivenline: number = 1;

  personalEmailValid: boolean = true;
  personalEmailValidLine: number = 1;

  businessEmailValid: boolean = true;
  businessEmailValidLine: number = 1;

  codePaysFound: boolean = true;
  codePaysFoundLine: number = 1;

  listCodePays: string[] = [];
  listLibPays: string[] = [];

  codeIsoCountryValid: boolean = true;
  codeIsoCountryValidLine: number = 1;

  listCodeCountry: string[] = [];
  listLibCountry: string[] = [];



  birthDateGiven: boolean = true;
  birthDateValid: boolean = true;
  birthDateValidLine: number = 1;

  dateEndSensitiveValid: boolean = true;
  dateEndSensitiveValidLine: number = 1;

  hireDateValid: boolean = true;
  hireDateValidLine: number = 1;

  lastHireDateValid: boolean = true;
  lastHireDateValidLine: number = 1;

  departDateValid: boolean = true;
  departDateValidLine: number = 1;

  lastDepartDateValid: boolean = true;
  lastDepartDateValidLine: number = 1;

  employeNoDepartDate: boolean = true;
  employeNoDepartDateLine: number = 1;

  employeDepartDate: boolean = true;
  employeDepartDateLine: number = 1;

  noEmployeeDuplicated = true;
  duplicateFirstName: string = '';
  duplicateLastName: string = '';

  bicGiven: boolean = true;
  bicGivenLine: number = 1;

  ibanValid: boolean = true;
  ibanValidLine: number = 1;

  bicValid: boolean = true;
  bicValidLine: number = 1;

  bicIbanValid: boolean = true;
  bicIbanValidLine: number = 1;

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

  COUNTRY = COUNTRY;
  @Output() messageEvent = new EventEmitter<any>();
  constructor(private individusService: IndividusService,
              private salarieService: SalarieService,
              private contactService: ContactService,
              private paymentService: PaymentService,
              private adresseService: AdresseService,
              private compteService: CompteService,
              private fiscaliteService: FiscaliteService,
              private reportCreateFileService: ReportCreateFileService,
              private reportUpdateFileService: ReportUpdateFileService) { }

  ngOnInit() {
    this.dataModelListFiltred = this.dataModelList.filter(dataModel => !dataModel.readonly);
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

    this.individuReportCreateFile.module = 'Individus';
    this.individuReportUpdateFile.module = 'Individus';
    for (let i = 0; i < dataArray.length; i++) {
      let individus: Individus = new Individus();
      if(dataArray[i].lastName.length !== 0 && dataArray[i].firstName.length !== 0 && dataArray[i].civility.length !== 0 &&
        (+dataArray[i].civility === 1 || +dataArray[i].civility === 2 || +dataArray[i].civility === 3) &&
         dataArray[i].birthDate.length !== 0 && this.isValidateDate(dataArray[i].birthDate) && this.isDateValide(dataArray[i].birthDate) && this.isAgeValide(dataArray[i].birthDate) &&
         dataArray[i].statut.length !== 0 && (dataArray[i].statut.toUpperCase() === 'A' || dataArray[i].statut.toUpperCase() === 'D') &&
         dataArray[i].employeeStatus.length !== 0 && (dataArray[i].employeeStatus.toUpperCase() === 'P' || dataArray[i].employeeStatus.toUpperCase() === 'S' || dataArray[i].employeeStatus.toUpperCase() === 'R') &&
         dataArray[i].vip.length !== 0 && (dataArray[i].vip.toUpperCase() === 'Y' || dataArray[i].vip.toUpperCase() === 'N') &&
         dataArray[i].mySensitive.length !== 0 && (dataArray[i].mySensitive.toUpperCase() === 'Y' || dataArray[i].mySensitive.toUpperCase() === 'N')) {

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
        individus.useName = dataArray[i].useName;
        individus.firstName = dataArray[i].firstName;
        individus.birthDate = dataArray[i].birthDate;
        individus.birthPlace = dataArray[i].birthPlace;
        individus.birthCountry = dataArray[i].birthCountry;
        individus.nationality = dataArray[i].nationality;
        //individus.birthCountryLib = dataArray[i].lastName;*/
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

  }

  buildSalarieDataArray(dataArray){
    this.salaryReportCreateFile.module = 'Salarie';
    this.salaryReportUpdateFile.module = 'Salarie';
    for (let i = 0; i < dataArray.length; i++){
      let salarie: Salarie = new Salarie();
      let individu: Individus = new Individus();
      if(dataArray[i].lastName.length !== 0 && dataArray[i].firstName.length !== 0 && dataArray[i].civility.length !== 0 &&
        (+dataArray[i].civility === 1 || +dataArray[i].civility === 2 || +dataArray[i].civility === 3) &&
        dataArray[i].birthDate.length !== 0 && this.isValidateDate(dataArray[i].birthDate) && this.isDateValide(dataArray[i].birthDate) && this.isAgeValide(dataArray[i].birthDate) &&
        dataArray[i].statut.length !== 0 && (dataArray[i].statut.toUpperCase() === 'A' || dataArray[i].statut.toUpperCase() === 'D') &&
        dataArray[i].employeeStatus.length !== 0 && (dataArray[i].employeeStatus.toUpperCase() === 'P' || dataArray[i].employeeStatus.toUpperCase() === 'S' || dataArray[i].employeeStatus.toUpperCase() === 'R') &&
        dataArray[i].vip.length !== 0 && (dataArray[i].vip.toUpperCase() === 'Y' || dataArray[i].vip.toUpperCase() === 'N') &&
        dataArray[i].mySensitive.length !== 0 && (dataArray[i].mySensitive.toUpperCase() === 'Y' || dataArray[i].mySensitive.toUpperCase() === 'N')){

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
        salarie.spc = dataArray[i].spc;
        salarie.level_1 = dataArray[i].level_1;
        salarie.level_2 = dataArray[i].level_2;
        salarie.level_3 = dataArray[i].level_3;
        salarie.level_4 = dataArray[i].level_4;
        salarie.level_5 = dataArray[i].level_5;
        salarie.hireDate = dataArray[i].hireDate;
        salarie.departDate = dataArray[i].departDate;
        salarie.lastHireDate = dataArray[i].lastHireDate;
        salarie.lastDepartDate = dataArray[i].lastDepartDate;
        salarie.branch_CD = dataArray[i].branch_CD;
        salarie.statut = dataArray[i].statut;
        salarie.vip = dataArray[i].vip;
        salarie.mySensitive = dataArray[i].mySensitive;
        salarie.dateEndSensitive = dataArray[i].dateEndSensitive;
        individu.nui = dataArray[i].nui;
        salarie.individu = individu;
        this.salarieDataArray.push(salarie);
      }
    }
  }

  buildContactDataArray(dataArray){
    this.contactReportCreateFile.module = 'Contact';
    this.contactReportUpdateFile.module = 'Contact';
    for (let i = 0; i < dataArray.length; i++){
      let contact: Contact = new Contact();
      let individu: Individus = new Individus();
      if(dataArray[i].lastName.length !== 0 && dataArray[i].firstName.length !== 0 && dataArray[i].civility.length !== 0 &&
        (+dataArray[i].civility === 1 || +dataArray[i].civility === 2 || +dataArray[i].civility === 3) &&
        dataArray[i].birthDate.length !== 0 && this.isValidateDate(dataArray[i].birthDate) && this.isDateValide(dataArray[i].birthDate) && this.isAgeValide(dataArray[i].birthDate) &&
        dataArray[i].statut.length !== 0 && (dataArray[i].statut.toUpperCase() === 'A' || dataArray[i].statut.toUpperCase() === 'D') &&
        dataArray[i].employeeStatus.length !== 0 && (dataArray[i].employeeStatus.toUpperCase() === 'P' || dataArray[i].employeeStatus.toUpperCase() === 'S' || dataArray[i].employeeStatus.toUpperCase() === 'R') &&
        dataArray[i].vip.length !== 0 && (dataArray[i].vip.toUpperCase() === 'Y' || dataArray[i].vip.toUpperCase() === 'N') &&
        dataArray[i].mySensitive.length !== 0 && (dataArray[i].mySensitive.toUpperCase() === 'Y' || dataArray[i].mySensitive.toUpperCase() === 'N')){

        this.contactService.getOne(dataArray[i].employeeId.toUpperCase()+"_ID").subscribe((data) =>{
          if(data !== null){
            this.contactUpdatedDataArray.push(data);
          }else{
            this.contactCreatedDataArray.push(data);
          }
        });
        contact.idContact = dataArray[i].employeeId.toUpperCase()+"_ID";
        contact.homePhone = dataArray[i].homePhone;
        contact.businessPhone = dataArray[i].businessPhone;
        contact.cellPhone = dataArray[i].cellPhone;
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

  buildIbanDataArray(dataArray){
    this.paymentReportCreateFile.module = 'PAYMENT';
    this.paymentReportUpdateFile.module = 'PAYMENT';
    for (let i = 0; i < dataArray.length; i++){
      let payment: Payment = new Payment();
      let individu: Individus = new Individus();
      if(dataArray[i].lastName.length !== 0 && dataArray[i].firstName.length !== 0 && dataArray[i].civility.length !== 0 &&
        (+dataArray[i].civility === 1 || +dataArray[i].civility === 2 || +dataArray[i].civility === 3) &&
        dataArray[i].birthDate.length !== 0 && this.isValidateDate(dataArray[i].birthDate) && this.isDateValide(dataArray[i].birthDate) && this.isAgeValide(dataArray[i].birthDate) &&
        dataArray[i].statut.length !== 0 && (dataArray[i].statut.toUpperCase() === 'A' || dataArray[i].statut.toUpperCase() === 'D') &&
        dataArray[i].employeeStatus.length !== 0 && (dataArray[i].employeeStatus.toUpperCase() === 'P' || dataArray[i].employeeStatus.toUpperCase() === 'S' || dataArray[i].employeeStatus.toUpperCase() === 'R') &&
        dataArray[i].vip.length !== 0 && (dataArray[i].vip.toUpperCase() === 'Y' || dataArray[i].vip.toUpperCase() === 'N') &&
        dataArray[i].mySensitive.length !== 0 && (dataArray[i].mySensitive.toUpperCase() === 'Y' || dataArray[i].mySensitive.toUpperCase() === 'N')){

        if(dataArray[i].iban.length !== 0 && dataArray[i].bic.length !== 0
          && this.isValidIBANNumber(dataArray[i].iban) && this.isBic(dataArray[i].bic)
          && dataArray[i].bic.substr(4,2) === dataArray[i].iban.substr(0, 2)){

          this.paymentService.getOne(dataArray[i].iban).subscribe((data)=>{
            if (data !== null){
              this.paymentUpdatedDataArray.push(data);
            } else {
              this.paymentCreatedDataArray.push(data);
            }
          });
          payment.iban = dataArray[i].iban;
          payment.bic =  dataArray[i].bic;
          individu.nui = dataArray[i].nui;
          payment.individu = individu;
          this.paymentDataArray.push(payment);
        }
      }
    }
  }

  buildAdresseDataArray(dataArray){
    this.adresseReportCreateFile.module = 'Adresse';
    this.adresseReportUpdateFile.module = 'Adresse';
    for (let i = 0; i < dataArray.length; i++){
      let adresse: Adresse = new Adresse();
      let individu: Individus = new Individus();
      if(dataArray[i].lastName.length !== 0 && dataArray[i].firstName.length !== 0 && dataArray[i].civility.length !== 0 &&
        (+dataArray[i].civility === 1 || +dataArray[i].civility === 2 || +dataArray[i].civility === 3) &&
        dataArray[i].birthDate.length !== 0 && this.isValidateDate(dataArray[i].birthDate) && this.isDateValide(dataArray[i].birthDate) && this.isAgeValide(dataArray[i].birthDate) &&
        dataArray[i].statut.length !== 0 && (dataArray[i].statut.toUpperCase() === 'A' || dataArray[i].statut.toUpperCase() === 'D') &&
        dataArray[i].employeeStatus.length !== 0 && (dataArray[i].employeeStatus.toUpperCase() === 'P' || dataArray[i].employeeStatus.toUpperCase() === 'S' || dataArray[i].employeeStatus.toUpperCase() === 'R') &&
        dataArray[i].vip.length !== 0 && (dataArray[i].vip.toUpperCase() === 'Y' || dataArray[i].vip.toUpperCase() === 'N') &&
        dataArray[i].mySensitive.length !== 0 && (dataArray[i].mySensitive.toUpperCase() === 'Y' || dataArray[i].mySensitive.toUpperCase() === 'N')){

        this.adresseService.getOne(dataArray[i].nui.toUpperCase() + dataArray[i].numberStreet).subscribe((data)=>{
          if(data !== null){
            this.adresseUpdatedDataArray.push(data);
          }else {
            this.adresseCreatedDataArray.push(data);
          }
        });
        if(dataArray[i].nif.length !== 0){
          adresse.id = dataArray[i].nui.toUpperCase() + dataArray[i].numberStreet
          if(dataArray[i].numberStreet.length !== 0 && (dataArray[i].additionalAdress_1.length !== 0 || dataArray[i].additionalAdress_2.length !== 0 || dataArray[i].additionalAdress_3.length !== 0)){
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
          if(dataArray[i].numberStreet.length !== 0 && (dataArray[i].additionalAdress_1.length !== 0 || dataArray[i].additionalAdress_2.length !== 0 || dataArray[i].additionalAdress_3.length !== 0)){
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
    }
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
        dataArray[i].statut.length !== 0 && (dataArray[i].statut.toUpperCase() === 'A' || dataArray[i].statut.toUpperCase() === 'D') &&
        dataArray[i].employeeStatus.length !== 0 && (dataArray[i].employeeStatus.toUpperCase() === 'P' || dataArray[i].employeeStatus.toUpperCase() === 'S' || dataArray[i].employeeStatus.toUpperCase() === 'R') &&
        dataArray[i].vip.length !== 0 && (dataArray[i].vip.toUpperCase() === 'Y' || dataArray[i].vip.toUpperCase() === 'N') &&
        dataArray[i].mySensitive.length !== 0 && (dataArray[i].mySensitive.toUpperCase() === 'Y' || dataArray[i].mySensitive.toUpperCase() === 'N')){

        this.compteService.getOne(dataArray[i].numCompte).subscribe((data)=>{
          if (data !== null){
            this.compteUpdatedDataArray.push(data);
          } else {
            this.compteCreatedDataArray.push(data);
          }
        });
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

    let fileList = $event.srcElement.files;
    let file = fileList[0];
    if(file && file.name.endsWith(".csv")){
      this.fileName = file.name;
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0], 'ISO-8859-1');

      reader.onload = (data) => {

        let csvData = reader.result;
        //csvData = "data:text/csv;charset=utf-8,";
        let csvRecordsArray = csvData.split(/\r\n|\n/);
        let headers = csvRecordsArray && csvRecordsArray.length>0 ? csvRecordsArray[0].split(";") : [];
        // bind headers with dataModelist
        let bindArray = this.getBindHeadersDataModelListArray(headers);

        // create data bindArray
        this.dataArray = this.buildDataArray(bindArray, csvRecordsArray);

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
        this.buildIbanDataArray(this.dataArray);
        this.buildAdresseDataArray(this.dataArray);
        this.buildCompteDataArray(this.dataArray);
        //this.buildFiscaliteDataArray(this.dataArray);

        this.currentStep++;

        this.emmitErrors();

      };
    }
  }

  public emmitErrors() {
    this.errorMessages.emit({
      company_cd_unique: this.company_cd_unique,
      company_cd_required_line: this.company_cd_required_line,
      numIdentityUniqueRequired: this.numIdentityUniqueRequired,
      numIdentityUniqueRequiredLine: this.numIdentityUniqueRequiredLine,
      company_cd_required: this.company_cd_required,
      employee_id_required: this.employee_id_required,
      employee_id_required_line: this.employee_id_required_line,
      employeeIdWellFormatted: this.employeeIdWellFormatted,
      employeeIdWellFormattedLine: this.employeeIdWellFormattedLine,
      noEmployeeDuplicated: this.noEmployeeDuplicated,
      duplicateFirstName: this.duplicateFirstName,
      duplicateLastName: this.duplicateLastName,
      civilityRequired: this.civilityRequired,
      civilityRequiredLine: this.civilityRequiredLine,
      civilityFalseValue: this.civilityFalseValue,
      lastNameGiven: this.lastNameGiven,
      lastNameGivenline: this.lastNameGivenline,
      firstNameGiven: this.firstNameGiven,
      firstNameGivenline: this.firstNameGivenline,
      personalEmailValid: this.personalEmailValid,
      personalEmailValidLine: this.personalEmailValidLine,
      businessEmailValid: this.businessEmailValid,
      businessEmailValidLine: this.businessEmailValidLine,
      birthDateGiven: this.birthDateGiven,
      birthDateValid: this.birthDateValid,
      codePaysFound: this.codePaysFound,
      codePaysFoundLine: this.codePaysFoundLine,
      statusGiven: this.statusGiven,
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
      conformFlagSensitiveLine: this.conformFlagSensitiveLine,
      employeStatusGiven: this.employeStatusGiven,
      employeStatusGivenLine: this.employeStatusGivenLine,
      employeStatusValid: this.employeStatusValid,
      hireDateValid: this.hireDateValid,
      hireDateValidLine: this.hireDateValidLine,
      departDateValid: this.departDateValid,
      departDateValidLine: this.departDateValidLine,
      employeNoDepartDate: this.employeNoDepartDate,
      employeNoDepartDateLine: this.employeNoDepartDateLine,
      employeDepartDate: this.employeDepartDate,
      employeDepartDateLine: this.employeDepartDateLine,
      lastHireDateValid: this.lastHireDateValid,
      lastHireDateValidLine: this.lastHireDateValidLine,
      lastDepartDateValid: this.lastDepartDateValid,
      lastDepartDateValidLine: this.lastDepartDateValidLine,
      numberStreetIncomplet: this.numberStreetIncomplet,
      numberStreetIncompletLine: this.numberStreetIncompletLine,
      adressValidLine: this.adressValidLine,
      codeIsoCountryValid: this.codeIsoCountryValid,
      codeIsoCountryValidLine: this.codeIsoCountryValidLine,
      bicGiven: this.bicGiven,
      bicGivenLine: this.bicGivenLine,
      bicValid: this.bicValid,
      bicValidLine: this.bicValidLine,
      ibanValid: this.ibanValid,
      ibanValidLine: this.ibanValidLine,
      bicIbanValid: this.bicIbanValid,
      bicIbanValidLine: this.bicIbanValidLine
    });
  }
  controlePrealable(dataArray){
    this.company_cd_required = this.isCompanyCdCorrect(dataArray);
    this.company_cd_unique = this.isCompanyCdUnique(dataArray);
    this.employee_id_required = this.isEmployeeIdCorrect(dataArray);
    this.numIdentityUniqueRequired = this.isNumIdentityUnique(dataArray);
    this.employeeIdWellFormatted = this.isEmployeeIdWellFormatted(dataArray);
    this.noEmployeeDuplicated = this.isEmployeeNoDuplicated(dataArray);
  }
  controleModuleIndividu(dataArray){
    this.civilityRequired = this.isCivilityRequired(dataArray);
    this.civilityFalseValue = this.isCivilityFalseValue(dataArray);
    this.lastNameGiven = this.isLastNameGiven(dataArray);
    this.firstNameGiven = this.isFirstNameGiven(dataArray);
    this.personalEmailValid = this.isPersonalEmailValid(dataArray);
    this.businessEmailValid = this.isBusinessEmailValid(dataArray);
    this.birthDateGiven = this.isBirthDateGiven(dataArray);
    this.birthDateValid = this.isBirthDateValid(dataArray);
    this.statusGiven = this.isStatusGiven(dataArray);
    this.statusValid = this.isStatusValid(dataArray);
    this.vipGiven = this.isVipGiven(dataArray);
    this.vipValid = this.isVipValid(dataArray);
    this.sensitiveGiven = this.isSensitiveGiven(dataArray);
    this.sensitiveValid = this.isSensitiveValid(dataArray);
    this.dateEndSensitiveValid = this.isDateEndSensitiveValid(dataArray);
    this.conformFlagSensitive = this.isConformFlagSensitive(dataArray);
    this.codePaysFound = this.isCodeIsoValid(dataArray);

  }
  controleModuleSalarie(dataArray){
    this.employeStatusGiven = this.isEmployeStatusGiven(dataArray);
    this.employeStatusValid = this.isEmployeStatusValid(dataArray);
    this.hireDateValid = this.isHireDateValide(dataArray);
    this.departDateValid = this.isDepartDateValide(dataArray);
    this.employeNoDepartDate = this.isEmployeNoDepartDate(dataArray);
    this.employeDepartDate = this.isEmployeDepartDate(dataArray);
    this.lastHireDateValid = this.isLastHireDateValide(dataArray);
    this.lastDepartDateValid = this.isLastDepartDateValide(dataArray);

  }
  controleModuleAdresse(dataArray){
    this.numberStreetIncomplet = this.isNumberStreetIncomplet(dataArray);
    this.adressValid = this.isAdressValid(dataArray);
    this.codeIsoCountryValid = this.isCodeIsoCountryValid(dataArray);
  }
  controleModuleIban(dataArray){
    this.bicGiven = this.isIbanGiven(dataArray);
    this.ibanValid = this.isValidIban(dataArray);
    this.bicValid = this.isValidBic(dataArray);
    this.bicIbanValid = this.isBicIbanValid(dataArray);
  }

  sendIndividusToServer(){
      this.individusService.addAll(this.individusDataArray).subscribe((data)=>{
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

    });
  }

  sendSalarieToServer(){
    this.salarieService.addAll(this.salarieDataArray).subscribe((data)=>{
      this.salaryReportCreateFile.nbreLinesCreated = this.salarieCreatedDataArray.length;
      this.salaryReportUpdateFile.nbreLinesUpdated = this.salarieUpdatedDataArray.length;
      if(this.salarieCreatedDataArray.length > 0){
        this.reportCreateFileService.add(this.salaryReportCreateFile).subscribe();
      }
      if(this.salarieUpdatedDataArray.length > 0){
        this.reportUpdateFileService.add(this.salaryReportUpdateFile).subscribe();
      }
    });
  }
  sendContactToServer(){
    this.contactService.addAll(this.contactDataArray).subscribe(data=>{
      this.contactReportCreateFile.nbreLinesCreated = this.contactCreatedDataArray.length;
      this.contactReportUpdateFile.nbreLinesUpdated = this.contactUpdatedDataArray.length;
      if(this.contactCreatedDataArray.length > 0){
        this.reportCreateFileService.add(this.contactReportCreateFile).subscribe();
      }
      if(this.contactUpdatedDataArray.length > 0){
        this.reportUpdateFileService.add(this.contactReportUpdateFile).subscribe();
      }
    });
  }
  sendIbanToServer(){
    this.paymentService.addAll(this.paymentDataArray).subscribe( data=>{
      this.paymentReportCreateFile.nbreLinesCreated = this.paymentCreatedDataArray.length;
      this.paymentReportUpdateFile.nbreLinesUpdated = this.paymentUpdatedDataArray.length;
      if(this.paymentCreatedDataArray.length > 0){
        this.reportCreateFileService.add(this.paymentReportCreateFile).subscribe();
      }
      if(this.paymentUpdatedDataArray.length > 0){
        this.reportUpdateFileService.add(this.paymentReportUpdateFile).subscribe();
      }
    });
  }
  sendAdresseToServer(){
    this.adresseService.addAll(this.adresseDataArray).subscribe( (data) =>{
      //this.sendFiscaliteToServer();
      this.adresseReportCreateFile.nbreLinesCreated = this.adresseCreatedDataArray.length;
      this.adresseReportUpdateFile.nbreLinesUpdated = this.adresseUpdatedDataArray.length;
      if(this.adresseCreatedDataArray.length > 0){
        this.reportCreateFileService.add(this.adresseReportCreateFile).subscribe();
      }
      if(this.adresseUpdatedDataArray.length > 0){
        this.reportUpdateFileService.add(this.adresseReportUpdateFile).subscribe();
      }
    });
  }
  sendCompteToServer(){
    this.compteService.addAll(this.compteDataArray).subscribe( data=>{
      this.compteReportCreateFile.nbreLinesCreated = this.compteCreatedDataArray.length;
      this.compteReportUpdateFile.nbreLinesUpdated = this.compteUpdatedDataArray.length;
      if(this.compteCreatedDataArray.length > 0){
        this.reportCreateFileService.add(this.compteReportCreateFile).subscribe();
      }
      if(this.compteUpdatedDataArray.length > 0){
        this.reportUpdateFileService.add(this.compteReportUpdateFile).subscribe();
      }
    });
  }
  /*sendFiscaliteToServer(){
    this.fiscaliteService.addAll(this.fiscaliteDataArray).subscribe();
  }*/
  sendDataToServer(){
    this.sendIndividusToServer();
    this.currentStep = 3;
  }
  isCompanyCdCorrect(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].company_CD.length === 0){
        this.company_cd_required_line += i;
        this.currentStep = -1;
        return false;
      }
    }
    return true;
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
        this.currentStep = -1;
        return false;
      }
    }
    return true;
  }
  isNumIdentityUnique(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].nui.length === 0){
        this.numIdentityUniqueRequiredLine += i;
        this.currentStep = -1;
        return false;
      }
    }
    return true;
  }
  isEmployeeIdWellFormatted(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].nui.toLowerCase()+dataArray[i].company_CD.toLowerCase() !== dataArray[i].employeeId.toLowerCase()){
        this.employeeIdWellFormattedLine += i;
        this.currentStep = -1;
        return false;
      }
    }
    return true;
  }
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
        return false;
      }
    }
    return true;
  }
  isCivilityFalseValue(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].civility.length !== 0 && +dataArray[i].civility !== 1 && +dataArray[i].civility !== 2 && +dataArray[i].civility !== 3){
        this.civilityRequiredLine += i;
        console.log('civility: '+ dataArray[i].civility);
        return false;
      }
    }
    return true;
  }
  isFirstNameGiven(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].firstName.length === 0){
        this.firstNameGivenline += i;
        return false;
      }
    }
    return true;
  }
  isLastNameGiven(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].lastName.length === 0){
        this.lastNameGivenline += i;
        return false;
      }
    }
    return true;
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
        return false;
      }
    }
    return true;
  }
  isBusinessEmailValid(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].businessEmail.length !== 0 && !this.isValidateEmail(dataArray[i].businessEmail)){
        this.businessEmailValidLine += i;
        return false;
      }
    }
    return true;
  }

  isBirthDateGiven(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].birthDate.length === 0){
        this.birthDateValidLine += i;
        return false;
      }
    }
    return true;
  }

  isBirthDateValid(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].birthDate.length !== 0 && !this.isValidateDate(dataArray[i].birthDate)){
        this.birthDateValidLine += i;
        return false;
      }
      if(dataArray[i].birthDate.length !== 0 && this.isValidateDate(dataArray[i].birthDate) && !this.isDateValide(dataArray[i].birthDate)){
        this.birthDateValidLine += i;
        return false;
      }
      if(dataArray[i].birthDate.length !== 0 && this.isValidateDate(dataArray[i].birthDate) && this.isDateValide(dataArray[i].birthDate) && !this.isAgeValide(dataArray[i].birthDate)){
        this.birthDateValidLine += i;
        return false;
      }
    }
    return true;
  }
  isDateEndSensitiveValid(dataArray){
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
  }

  isStatusGiven(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].statut.length === 0){
        this.statusGivenLine += i;
        return false;
      }
    }
    return true;
  }
  isStatusValid(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].statut.length !== 0 && dataArray[i].statut.toUpperCase() !== 'A' && dataArray[i].statut.toUpperCase() !== 'D'){
        this.statusGivenLine += i;
        return false;
      }
    }
    return true;
  }

  isEmployeStatusGiven(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].employeeStatus.length === 0){
        this.employeStatusGivenLine += i;
        return false;
      }
    }
    return true;
  }
  isEmployeStatusValid(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].employeeStatus.length !== 0 && dataArray[i].employeeStatus.toUpperCase() !== 'P' && dataArray[i].employeeStatus.toUpperCase() !== 'S' && dataArray[i].employeeStatus.toUpperCase() !== 'R'){
        this.employeStatusGivenLine += i;
        return false;
      }
    }
    return true;
  }

  isVipGiven(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].vip.length === 0){
        this.vipGivenLine += i;
        return false;
      }
    }
    return true;
  }
  isVipValid(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].vip.length !== 0 && dataArray[i].vip.toUpperCase() !== 'Y' && dataArray[i].vip.toUpperCase() !== 'N'){
        this.vipGivenLine += i;
        return false;
      }
    }
    return true;
  }

  isSensitiveGiven(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].mySensitive.length === 0){
        this.sensitiveGivenLine += i;
        return false;
      }
    }
    return true;
  }
  isSensitiveValid(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].mySensitive.length !== 0 && dataArray[i].mySensitive.toUpperCase() !== 'Y' && dataArray[i].mySensitive.toUpperCase() !== 'N'){
        this.sensitiveGivenLine += i;
        return false;
      }
    }
    return true;
  }
  isConformFlagSensitive(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].dateEndSensitive.length > 0 && dataArray[i].mySensitive.toUpperCase() !== 'Y'){
        this.conformFlagSensitiveLine += i;
        return false;
      }
    }
    return true;
  }

  isCodeIsoValid(dataArray){
    let isFound = false;
    for (let i = 0; i < this.COUNTRY.length; i++){

      for (let j = 0; j < dataArray.length; j++){
        if (this.COUNTRY[i].code.toUpperCase() === dataArray[j].birthCountry.toUpperCase()){
          isFound = true;
          this.listCodePays.push(this.COUNTRY[i].code);
          this.listLibPays.push(this.COUNTRY[i].name);
        }
      }

    }

    for (let i = 0; i < dataArray.length; i++) {
      console.log('country: ',i, this.listCodePays[i]+' ', this.listLibPays[i]);
      if(!this.listCodePays.includes(dataArray[i].birthCountry.toUpperCase())){
        isFound = false;
        this.codePaysFoundLine+=i;
        break;
      }
    }

    return isFound;
  }
  isCodeIsoCountryValid(dataArray){
    let isFound = false;
    for (let i = 0; i < this.COUNTRY.length; i++){

      for (let j = 0; j < dataArray.length; j++){
        if (this.COUNTRY[i].code.toUpperCase() === dataArray[j].country.toUpperCase()){
          isFound = true;
          this.listCodeCountry.push(this.COUNTRY[i].code);
          this.listLibCountry.push(this.COUNTRY[i].name);
        }
      }

    }

    for (let i = 0; i < dataArray.length; i++) {
      if(!this.listCodeCountry.includes(dataArray[i].country.toUpperCase())){
        isFound = false;
        this.codeIsoCountryValidLine+=i;
        break;
      }
    }
    return isFound;
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
        return false;
      }
      if(dataArray[i].hireDate.length !== 0 && this.isValidateDate(dataArray[i].hireDate) && !this.isDateValide(dataArray[i].hireDate)){
        this.hireDateValidLine += i;
        return false;
      }
      if(dataArray[i].hireDate.length !== 0 && this.isValidateDate(dataArray[i].hireDate) && this.isDateValide(dataArray[i].hireDate) && !this.isPossibleHireDate(dataArray[i].birthDate, dataArray[i].hireDate)){
        this.hireDateValidLine += i;
        return false;
      }
    }
    return true;
  }
  isLastHireDateValide(dataArray){
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
  }
  isDepartDateValide(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].departDate.length !== 0 && !this.isValidateDate(dataArray[i].departDate)){
        this.departDateValidLine += i;
        return false;
      }
      if(dataArray[i].departDate.length !== 0 && this.isValidateDate(dataArray[i].departDate) && !this.isDateValide(dataArray[i].departDate)){
        this.departDateValidLine += i;
        return false;
      }
      if(dataArray[i].departDate.length !== 0 && this.isValidateDate(dataArray[i].departDate) && this.isDateValide(dataArray[i].departDate) && !this.isPossibleDepartDate(dataArray[i].hireDate, dataArray[i].departDate)){
        this.departDateValidLine += i;
        return false;
      }
    }
    return true;
  }
  isLastDepartDateValide(dataArray){
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
  }
  isEmployeNoDepartDate(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if (dataArray[i].employeeStatus.toUpperCase() === 'P' && dataArray[i].departDate.length !== 0){
        this.employeNoDepartDateLine += i;
        return false;
      }
    }
    return true;
  }
  isEmployeDepartDate(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if ((dataArray[i].employeeStatus.toUpperCase() === 'S' || dataArray[i].employeeStatus.toUpperCase() === 'R') && dataArray[i].departDate.length === 0){
        this.employeDepartDateLine += i;
        return false;
      }
    }
    return true;
  }
  isNumberStreetIncomplet(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].numberStreet.length !== 0 && dataArray[i].additionalAdress_1.length === 0 && dataArray[i].additionalAdress_2.length === 0 && dataArray[i].additionalAdress_3.length === 0){
        this.numberStreetIncompletLine += i;
        return false;
      }
    }
    return true;
  }
  isAdressValid(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if((dataArray[i].street.length !== 0 || dataArray[i].additionalAdress_1.length !== 0 || dataArray[i].additionalAdress_2.length !== 0 || dataArray[i].additionalAdress_3.length !== 0)
          &&(dataArray[i].city.length === 0 || dataArray[i].codePostal.length === 0 || dataArray[i].country.length ===0)){
        this.adressValidLine += i;
        return false;
      }
    }
    return true;
  }
  isIbanGiven(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if((dataArray[i].bic.length !== 0 && dataArray[i].iban.length === 0) || (dataArray[i].bic.length === 0 && dataArray[i].iban.length !== 0)){
        this.bicGivenLine += i;
        return false;
      }
    }
    return true;
  }

  isValidIban(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].iban.length !== 0 && !this.isValidIBANNumber(dataArray[i].iban)){
        this.ibanValidLine += i;
        return false;
      }
    }
    return true;
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
  isValidBic(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      if(dataArray[i].bic.length !== 0 && !this.isBic(dataArray[i].bic)){
        this.bicValidLine += i;
        return false;
      }
    }
    return true;
  }

  isBicIbanValid(dataArray){
    for (let i = 0; i < dataArray.length; i++){
      console.log('Compare BIC '+ dataArray[i].bic.substr(4,2));
      console.log('Compare IBAN '+ dataArray[i].iban.substr(0,2));
      if(dataArray[i].bic.substr(4,2) !== dataArray[i].iban.substr(0, 2)){
        this.bicIbanValidLine += i;
        return false;
      }
    }
    return true;
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
    $event.preventDefault();
    $event.stopPropagation();
    Filemanagement.downloadPDFModules(this.report.nativeElement.innerHTML);
    this.currentStep = 4;
  }

}
