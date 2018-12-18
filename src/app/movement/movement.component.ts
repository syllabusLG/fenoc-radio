import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from "@angular/core";
import {DataModel} from "../shared/data.model";
import {Mouvements} from "../shared/mouvements.model";
import {MovementService} from "./movement.service";
import {Compte} from "../shared/compte.model";
import {Filemanagement} from "../common/filemanagement";
import {ReportCreateFile} from "../shared/report.create.file.model";
import {ReportUpdateFile} from "../shared/report.update.file.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {ReportUpdateFileService} from '../report-update-file/report.update.file.service';
import {ReportCreateFileService} from '../report-create-file/report.create.file.service';
import { saveAs } from 'file-saver';
import {CompteService} from "../compte/compte.service";
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-movement',
  templateUrl: './movement.component.html',
  styleUrls: ['./movement.component.css'],
})

export class MovementComponent implements  OnInit{

  @ViewChild('reportMovement')
  reportMovement: ElementRef;

  @ViewChild('content')
  content: ElementRef;

  typeOfReport: string = '';
  pageMovements:any;
  motCle:string='';
  currentPage:number=0;
  size:number=5;
  pages:Array<number>;

  fileName: string = '';
  currentStep = 1;
  selectedStep = 1;
  dataModelListFiltred: any;
  dataFromServer: any = null;
  dataSentToServer: boolean = false;

  dataModelList: DataModel[];

  @ViewChild('report')
  report: ElementRef;

  operation: string='';
  dataArray:  any = null
  movementsDataArray: Mouvements[]=[];
  movementsCreatedDataArray: Mouvements[]=[];
  movementsUpdateDataArray: Mouvements[]=[];

  numMouvementRequired: boolean = true;
  numMouvementRequiredLine: number =1;
  numMouvement_unique: boolean = true;

  sensRequired: boolean = true;
  sensRequiredLine: number = 1;

  refInstrumentRequired: boolean = true;
  refInstrumentRequiredLine: number = 1;

  quantiteInstrumentRequired: boolean = true;
  quantiteInstrumentRequiredLine: number = 1;

  navRequired: boolean = true;
  navRequiredLine: number = 1;

  pruInstrumentRequired: boolean = true;
  pruInstrumentRequiredLine: number = 1;

  dateCompteRequired: boolean = true;
  dateCompteRequiredLine: number =1;

  dateValeurRequired: boolean = true;
  dateValuerRequiredLine: number = 1;

  dateOperationRequired: boolean = true;
  dateOperationRequiredLine: number = 1;

  compteRequired: boolean = true;
  compteRequiredLine: number = 1;
  compteValid: boolean = true;
  compteValidedLine: number =1;

  movementReportCreateFile: ReportCreateFile = new ReportCreateFile();
  movementReportUpdateFile: ReportUpdateFile = new ReportUpdateFile();

  selectedMovement: Mouvements;
  movementForm: FormGroup;
  movements: Mouvements[];
  BadHeaders: boolean = false;
  isdataNull: boolean = false;

  constructor(private movementService: MovementService,
              private  compteService: CompteService,
              private cookieService: CookieService,
              private reportCreateFileService: ReportCreateFileService,
              private reportUpdateFileService: ReportUpdateFileService,
              private fb: FormBuilder,
              private route: ActivatedRoute){
    this.createForm();
  }

  ngOnInit() {
    this.dataModelList = [
      new DataModel( 'numMouvement', 'Numero Mouvements', 'string', false,[]),
      new DataModel( 'sens', 'Sens', 'string', false,[]),
      new DataModel( 'refInstrument', 'Référence Instrument', 'string', false,[]),
      new DataModel( 'quantiteInstrument', 'Quantité instrument', 'number', false,[]),
      new DataModel( 'nav', 'Nav', 'string', false,[]),
      new DataModel( 'pruInstrument', 'PRU instrument', 'string', false,[]),
      new DataModel( 'dateCompte', 'Date Compte', 'string', false,[]),
      new DataModel( 'dateValeur', 'Date Value', 'string', false,[]),
      new DataModel( 'dateOperation', 'Date Operational', 'string', false,[]),
      new DataModel( 'compte', 'Numero Compte', 'string', false,[]),
    ];
    this.dataModelListFiltred = this.dataModelList.filter(dataModel => !dataModel.readonly);

    this.initMoviments();
    this.movements = this.changeCompte(this.route.snapshot.data.movements);
    this.loadMovements();
  }

  initMoviments(){
    this.selectedMovement = new Mouvements();
    this.createForm();
  }

  changeCompte(movements: Mouvements[]){
    for(let i = 0; i < movements.length; i++){
      let compte: Compte = new Compte();
      compte.numCompte = movements[i].compte.numCompte;
      movements[i].compte = compte;
    }
    return movements;
  }

  createForm(){
    this.movementForm = this.fb.group({
      compte:'',
      numMouvement: ['', Validators.required],
      quantiteInstrument:'',
      sens: '',
      refInstrument: '',
      nav: '',
      pruInstrument: '',
      dateCompte: '',
      dateValeur: '',
      dateOperation: '',
    });
  }

  loadMovements(){
    this.movementService.search(this.motCle, this.currentPage, this.size)
      .subscribe(data=>{
        this.pageMovements = data;
        this.pages = new Array(data['totalPages']);
      }, error=>{
        console.log(error);
      });
  }

  getBindHeadersDataModelListArray(headers){
    let bindArray = [];
    let index = 0;
    let movementHeaders = this.dataModelList.map(function(a) {return a.columnName;});
    let getDataType = (header) => {
      let dataType = '';
      this.dataModelList.forEach(dataModel => {
        if(dataModel.columnName == header){
          dataType = dataModel.dataType;
        }else{
          if(movementHeaders.indexOf(header) <= -1){
            this.BadHeaders = true;
            this.currentStep = -1;
          }
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

  isNumMouvementRequired(dataArray){
    for(let i=0; i<dataArray.length; i++){
      if(dataArray[i].numMouvement == 0){
        this.numMouvementRequiredLine +=i;
        this.currentStep =-1;
        return false;
      }
    }
    return true;
  }

  isCompteRequired(dataArray) {
    for(let i=0; i<dataArray.length; i++){
      if(dataArray[i].compte == 0){
        this.compteRequiredLine +=i;
        this.currentStep =-1;
        return false;
      }
    }
    return true;
  }

  isCompteCreated(dataArray){
    for(let i=0; i< dataArray.length; i++) {
      this.compteService.getOne(this.dataArray[i].compte).subscribe( data => {
          if (data === null) {
            this.isdataNull = true;
            this.compteValidedLine += i;
            this.currentStep = -1;
            return false;
          }
        }
      );
    }
    return true;
  }

  isSensRequired(dataArray){
    for(let i=0; i<dataArray.length; i++){
      if(dataArray[i].sens == 0){
        this.sensRequiredLine +=i;
        this.currentStep =-1;
        return false;
      }
    }
    return true;
  }

  isQuantiteInstrumentRequired(dataArray){
    for(let i=0; i<dataArray.length; i++){
      if(dataArray[i].quantiteInstrument == 0){
        this.quantiteInstrumentRequiredLine +=i;
        this.currentStep =-1;
        return false;
      }
    }
    return true;
  }

  isRefInstrumentRequired(dataArray){
    for(let i=0; i<dataArray.length; i++){
      if(dataArray[i].refInstrument == 0){
        this.refInstrumentRequiredLine +=i;
        this.currentStep =-1;
        return false;
      }
    }
    return true;
  }

  isNavRequired(dataArray){
    for(let i=0; i < dataArray.length; i++){
      if(dataArray[i].nav == 0){
        this.navRequiredLine +=i;
        this.currentStep =-1;
        return false;
      }
    }
    return true;
  }

  ispruInstrumentRequired(dataArray){
    for(let i=0; i<dataArray.length; i++){
      if(dataArray[i].pruInstrument == 0){
        this.pruInstrumentRequiredLine +=i;
        this.currentStep =-1;
        return false;
      }
    }
    return true;
  }

  isDateCompteRequired(dataArray)
  {
    for(let i=0; i<dataArray.length; i++){
      if(dataArray[i].dateCompte == 0){
        this.dateCompteRequiredLine +=i;
        this.currentStep =-1;
        return false;
      }
    }
    return true;
  }

  isDateValuerRequired(dataArray){
    for(let i=0; i<dataArray.length; i++){
      if(dataArray[i].dateValeur == 0){
        this.dateValuerRequiredLine +=i;
        this.currentStep =-1;
        return false;
      }
    }
    return true;
  }


  isDateOperationRequired(dataArray){
    for(let i=0; i<dataArray.length; i++){
      if(dataArray[i].dateOperation == 0){
        this.dateOperationRequiredLine +=i;
        this.currentStep =-1;
        return false;
      }
    }
    return true;
  }

    sendDataToServer(){
    this.sendMovementsToServer();
    this.currentStep = 3;
    this.loadMovements();
    this.movements = this.movementsDataArray;

    }

  sendMovementsToServer(){
    this.movementService.addAll(this.movementsDataArray).subscribe((data)=> {
      this.movementReportCreateFile.nbreLinesCreated = this.movementsCreatedDataArray.length;
      this.movementReportUpdateFile.nbreLinesUpdated = this.movementsUpdateDataArray.length;
      if(this.movementsCreatedDataArray.length > 0){
        this.reportCreateFileService.add(this.movementReportCreateFile).subscribe();
      }
      if(this.movementsUpdateDataArray.length > 0){
        this.reportUpdateFileService.add(this.movementReportUpdateFile).subscribe();
      }
      this.dataFromServer = data;
      this.dataSentToServer = true;
    });
  }

  buildMovementsDataArray(dataArray){
    this.movementReportCreateFile.module = 'Movements';
    this.movementReportUpdateFile.module = 'Movements'
    for(let i=0; i< dataArray.length; i++)
    {
      let movements: Mouvements = new Mouvements();
      let compte: Compte = new Compte();
      this.movementService.getOne(dataArray[i].numMouvement).subscribe((data)=>{
        if(data !== null){
          this.movementsUpdateDataArray.push(data);
        }else{
          this.movementsCreatedDataArray.push(data);
        }
      });
      compte.numCompte = dataArray[i].compte;
      movements.compte = compte;
      movements.dateCompte = dataArray[i].dateCompte;
      movements.dateOperation = dataArray[i].dateOperation;
      movements.dateValeur = dataArray[i].dateValeur;
      movements.nav = dataArray[i].nav;
      movements.numMouvement = dataArray[i].numMouvement;
      movements.pruInstrument = dataArray[i].pruInstrument;
      movements.quantiteInstrument = dataArray[i].quantiteInstrument;
      movements.refInstrument = dataArray[i].refInstrument;
      movements.sens = dataArray[i].sens;
      this.movementsDataArray.push(movements);
    }

  }
  controleHeaders (headers) {
    let uploadHeaders = "numMouvement;sens;refInstrument;quantiteInstrument;nav;pruInstrument;dateCompte;dateValeur;dateOperation;compte";
    let uploadHeadersArray = uploadHeaders.split(";");
    for (let i = 0; i < headers.length; i++) {
      if (uploadHeadersArray.indexOf(headers[i]) <= -1) {
        this.BadHeaders = true;
        this.currentStep = -1;
        return true;
      }
    }
    return false;
  }
    controleModuleMovement(dataArray){
    this.compteRequired = this.isCompteRequired(dataArray);
    this.compteValid= this.isCompteCreated(dataArray);
    this.numMouvementRequired = this.isNumMouvementRequired(dataArray);
    this.sensRequired = this.isSensRequired(dataArray);
    this.refInstrumentRequired = this.isRefInstrumentRequired(dataArray);
    this.navRequired = this.isNavRequired(dataArray);
    this.pruInstrumentRequired = this.ispruInstrumentRequired(dataArray);
    this.dateCompteRequired = this.isDateCompteRequired(dataArray);
    this.dateValeurRequired = this.isDateValuerRequired(dataArray);
    this.dateOperationRequired = this.isDateOperationRequired(dataArray);
    this.quantiteInstrumentRequired = this.isQuantiteInstrumentRequired(dataArray);
  }

  selectFile($event){
    let fileList = $event.srcElement.files;
    let file = fileList[0];
    if(file && file.name.endsWith(".csv")){
      this.fileName = file.name;
      this.cookieService.set('uploadMovementFile', 'Upload du fichier: '+file.name);
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0], 'ISO-8859-1');

      reader.onload = (data) => {
        let csvData = String(reader.result);

        //csvData = "data:text/csv;charset=utf-8,";
        let csvRecordsArray  = csvData.split(/\r\n|\n/);
        // Check if the last row is empty. This works
        if(csvRecordsArray[csvRecordsArray.length-1] ===''){
          csvRecordsArray.pop()
        }
        let headers = csvRecordsArray && csvRecordsArray.length>0 ? csvRecordsArray[0].split(";") : [];
        // bind headers with dataModelist
        let bindArray = this.getBindHeadersDataModelListArray(headers);
        //check is the headers are good or not
        this.BadHeaders = this.controleHeaders(headers);

        if(!this.BadHeaders) {
          // create data bindArray
          this.dataArray = this.buildDataArray(bindArray, csvRecordsArray);

          this.controleModuleMovement(this.dataArray);

          this.buildMovementsDataArray(this.dataArray);
        }
        this.currentStep++;
      };
    }
  }

  public downloadPDFModules($event:any){
    this.typeOfReport = 'mouvement';
    $event.preventDefault();
    $event.stopPropagation();
    Filemanagement.downloadPDFModules(this.report.nativeElement.innerHTML,this.typeOfReport);
    this.currentStep = 4;
  }

  addMovement(){
    const  mov = this.movementForm.value;
    this.movementService.add(mov).subscribe(
      res=>{
        this.initMoviments();
        this.loadMovements();
      }
    );
  }

  updateMovement(){
    let dateValeur = this.selectedMovement.dateValeur;
    let dateOperation = this.selectedMovement.dateOperation;
    let dateCompte = this.selectedMovement.dateCompte;

    if(dateValeur || dateOperation || dateCompte )
    {
      if(dateValeur && (dateValeur.indexOf('-') > -1)){
        this.selectedMovement.dateValeur = this.fillDate(dateValeur);
      }
      if(dateOperation && (dateOperation.indexOf('-') > -1)){
        this.selectedMovement.dateOperation = this.fillDate(dateOperation);
      }
      if(dateCompte && (dateCompte.indexOf('-') > -1)){
        this.selectedMovement.dateCompte = this.fillDate(dateCompte);
      }
    }
    this.movementService.update(this.selectedMovement).subscribe(
      res=>{
        this.cookieService.set('updateMouvement', 'Modification du mouvement: '+this.selectedMovement.numMouvement);
        this.initMoviments();
        this.loadMovements();
      }
    )
  }

  deleteMouvement(){
    this.movementService.delete(this.selectedMovement.numMouvement).subscribe(
      res=>{
        this.cookieService.set('deleteMouvement', 'Suppression du mouvement: '+this.selectedMovement.numMouvement);
        this.selectedMovement = new Mouvements();
        this.loadMovements();
      }
    )
  }

  gotoPage(i: number) {
    this.currentPage = i;
    this.loadMovements();
  }

  searchAMovements(){
    this.loadMovements();
  }

  downloadFile(data: any) {
    let file = 'mouvements_'+ new Date()+'.csv';
    this.cookieService.set('exportMovementCSV', 'Telechargement du fichier: '+file);
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'));
    csv.unshift(header.join(';'));
    let csvArray = csv.join('\r\n');
    var blob = new Blob([csvArray], {type: 'text/csv' })
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

  public downloadPDF($event:any){
    $event.preventDefault();
    $event.stopPropagation();
    Filemanagement.downloadPDF(this.content.nativeElement.innerHTML);
  }
}
