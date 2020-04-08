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
import {Positions} from '../shared/position.model';
import {PositionService} from '../position/position.service';
import {AppService} from '../app.service';
import {Audit} from '../shared/audit.model';
import {Instruments} from '../shared/instruments.model';
import {NgxSpinnerService} from 'ngx-spinner';

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

  audit: Audit = new Audit();

  typeOfReport: string = '';
  downloadDate: any;
  downloadHour: any;
  pageMovements:any;
  motCle:string='';
  currentPage:number=0;
  size:number=20;
  pages:Array<number>;

  fileName: string = '';
  currentStep = 1;
  selectedStep = 1;
  dataModelListFiltred: any;
  dataFromServer: any = null;
  dataSentToServer: boolean = false;

  isControleFile: boolean = true;
  possibleMovment: boolean = true;
  possibleMovmentLine: number = 2;

  dataModelList: DataModel[];

  @ViewChild('report')
  report: ElementRef;

  operation: string='';
  dataArray:  any = null
  movementsDataArray: Mouvements[]=[];
  movementsCreatedDataArray: Mouvements[]=[];
  movementsUpdateDataArray: Mouvements[]=[];

  positionsDataArray: Positions[] = [];

  numMouvementRequired: boolean = true;
  numMouvementRequiredLine: number =2;
  numMouvement_unique: boolean = true;

  sensRequired: boolean = true;
  sensRequiredLine: number = 2;

  noDuplicateInstrumentCompte: boolean = true;
  noDuplicateInstrumentCompteLine: number = 2;

  refInstrumentRequired: boolean = true;
  refInstrumentRequiredLine: number = 2;

  quantiteInstrumentRequired: boolean = true;
  quantiteInstrumentRequiredLine: number = 2;

  navRequired: boolean = true;
  navRequiredLine: number = 2;

  pruInstrumentRequired: boolean = true;
  pruInstrumentRequiredLine: number = 2;

  dateCompteRequired: boolean = true;
  dateCompteRequiredLine: number =2;

  dateValeurRequired: boolean = true;
  dateValuerRequiredLine: number = 2;

  dateOperationRequired: boolean = true;
  dateOperationRequiredLine: number = 2;

  compteRequired: boolean = true;
  compteRequiredLine: number = 2;
  compteValid: boolean = true;
  compteValidedLine: number =2;

  entityMereRequired: boolean = true;
  entityMereRequiredLine: number = 2;

  movementReportCreateFile: ReportCreateFile = new ReportCreateFile();
  movementReportUpdateFile: ReportUpdateFile = new ReportUpdateFile();

  selectedMovement: Mouvements;
  movementForm: FormGroup;
  movements: Mouvements[];
  positions: Positions[];
  BadHeaders: boolean = false;
  isdataNull: boolean = false;

  constructor(private movementService: MovementService,
              private positionService: PositionService,
              private appService: AppService,
              private compteService: CompteService,
              private cookieService: CookieService,
              private reportCreateFileService: ReportCreateFileService,
              private reportUpdateFileService: ReportUpdateFileService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService){
    this.createForm();
  }

  ngOnInit() {
    this.dataModelList = [
      new DataModel( 'numMouvement', 'Numero Mouvements', 'string', false,[]),
      new DataModel( 'sens', 'Sens', 'string', false,[]),
      new DataModel( 'instruments', 'Référence Instrument', 'string', false,[]),
      new DataModel( 'quantiteInstrument', 'Quantité instrument', 'number', false,[]),
      new DataModel( 'nav', 'Nav', 'string', false,[]),
      new DataModel( 'pruInstrument', 'PRU instrument', 'number', false,[]),
      new DataModel( 'dateCompte', 'Date Compte', 'string', false,[]),
      new DataModel( 'dateValeur', 'Date Value', 'string', false,[]),
      new DataModel( 'dateOperation', 'Date Operational', 'string', false,[]),
      new DataModel( 'compte', 'Numero Compte', 'string', false,[]),
      new DataModel( 'idEntityMere', 'Entité mère', 'string', false,[]),
      //new DataModel( 'position', 'ID position', 'number', false,[])
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
      idEntityMere: '',
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
            console.log("****************"+movementHeaders.indexOf(header));
            this.BadHeaders = true;
            //this.currentStep = -1;
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
  controleFile(dataArray, file){
    let tabFile = file.split('_');
    let isMultiCompany: boolean = false;
    for(let i = 0; i < (dataArray.length -1); i++){
      if(dataArray[i].company_CD.toLowerCase() !== dataArray[i+1].company_CD.toLowerCase()){
        isMultiCompany = true;
        break;
      }
    }
    if(!isMultiCompany && tabFile[0].toLowerCase() !== dataArray[0].company_CD.toLowerCase()){
      this.currentStep = -1;
      return false;
    }
    if(isMultiCompany && tabFile[0].toLowerCase() !== 'multientreprise'){
      this.currentStep = -1;
      return false;
    }
    if(tabFile[1].toLowerCase() !== 'movement'){
      this.currentStep = -1;
      return false;
    }
    if(!this.isDateFile(tabFile[2])) {
      this.currentStep = -1;
      return false;
    }
    return true;
  }
  isDateFile(value){
    return /^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/.test(value)
  }
  isNoDuplicateInstrumentCompte(dataArray){
    for(let i = 0; i < dataArray.length - 1; i++){
      if(dataArray[i].instruments === dataArray[i+1].instruments
        && dataArray[i].compte === dataArray[i+1].compte){
        this.noDuplicateInstrumentCompteLine +=i;
        this.currentStep =-1;
        return false;
      }
    }
    return true;
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

  isEntityRequired(dataArray) {
    for(let i = 0; i < dataArray.length; i++) {
      if(dataArray[i].idEntityMere == 0){
        this.entityMereRequiredLine += i;
        this.currentStep = -1;
        return false;
      }
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
      if(dataArray[i].instruments == 0){
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
  isPossibleMovement(dataArray){
    let position: Positions;
    for(let i = 0; i <dataArray.length; i++){
      this.positionService.getPositionByCodeInstrumentAndCompte(dataArray[i].instruments, String(dataArray[i].compte)).subscribe( data=>{
        if(data !== null){
          position = data;
          if (dataArray[i].sens === 'C' && (Number(position.quantiteInstrument) - Number(dataArray[i].quantiteInstrument) < 0)) {
            this.possibleMovmentLine += i;
            this.currentStep =-1;
            this.possibleMovment = false;
            console.log("possibleMovement: "+this.possibleMovment+" line: "+this.possibleMovmentLine);
          }
        }
      });
    }
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
      this.positionService.addAll(this.positionsDataArray).subscribe();
    });
  }

  buildMovementsDataArray(dataArray){
    this.movementReportCreateFile.module = 'Movements';
    this.movementReportUpdateFile.module = 'Movements';
    for(let i = 0; i < dataArray.length; i++)
    {
      let movements: Mouvements = new Mouvements();
      let compte: Compte = new Compte();
      let position: Positions = new Positions();
      let instrument: Instruments = new Instruments();
      this.movementService.getOne(dataArray[i].numMouvement).subscribe((data)=>{
        if(data !== null){
          this.movementsUpdateDataArray.push(data);
        }else{
          this.movementsCreatedDataArray.push(data);
        }
      });
      compte.numCompte = dataArray[i].compte;
      instrument.code = dataArray[i].instruments;
      this.positionService.getPositionByCodeInstrumentAndCompte(dataArray[i].instruments, String(dataArray[i].compte)).subscribe( data=>{
        if(data !== null){
          movements.position = data;
          position = data;
          if (dataArray[i].sens === 'C' && (position.quantiteInstrument - Number(dataArray[i].quantiteInstrument) < 0)){
            return;
          }
          if(dataArray[i].sens === 'C'){
            if(position.quantiteInstrument - Number(dataArray[i].quantiteInstrument) >= 0){
              position.quantiteInstrument -= Number(dataArray[i].quantiteInstrument);
            }
          }else{
            position.quantiteInstrument += Number(dataArray[i].quantiteInstrument);
          }
          position.pruInstrument  = dataArray[i].pruInstrument;
          position.dateUpdate = this.fillDate(new Date());
          this.positionsDataArray.push(position);
          //this.positionService.add(position).subscribe();
        }
      });

      movements.compte = compte;
      movements.instruments = instrument;
      movements.dateCompte = dataArray[i].dateCompte;
      movements.dateOperation = dataArray[i].dateOperation;
      movements.dateValeur = dataArray[i].dateValeur;
      movements.nav = dataArray[i].nav;
      movements.numMouvement = dataArray[i].numMouvement;
      movements.pruInstrument = dataArray[i].pruInstrument;
      movements.quantiteInstrument = dataArray[i].quantiteInstrument;
      movements.sens = dataArray[i].sens;
      movements.idEntityMere = dataArray[i].idEntityMere;
      this.movementsDataArray.push(movements);
    }

  }
  controleHeaders (headers) {
    let uploadHeaders = "numMouvement;sens;instruments;quantiteInstrument;nav;pruInstrument;dateCompte;dateValeur;dateOperation;compte;idEntityMere;company_CD";
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
    this.isControleFile = this.controleFile(dataArray, this.fileName);
    this.noDuplicateInstrumentCompte = this.isNoDuplicateInstrumentCompte(dataArray);
    this.compteRequired = this.isCompteRequired(dataArray);
    this.compteValid= this.isCompteCreated(dataArray);
    this.entityMereRequired = this.isEntityRequired(dataArray);
    this.numMouvementRequired = this.isNumMouvementRequired(dataArray);
    this.sensRequired = this.isSensRequired(dataArray);
    this.refInstrumentRequired = this.isRefInstrumentRequired(dataArray);
    this.navRequired = this.isNavRequired(dataArray);
    this.pruInstrumentRequired = this.ispruInstrumentRequired(dataArray);
    this.dateCompteRequired = this.isDateCompteRequired(dataArray);
    this.dateValeurRequired = this.isDateValuerRequired(dataArray);
    this.dateOperationRequired = this.isDateOperationRequired(dataArray);
    this.quantiteInstrumentRequired = this.isQuantiteInstrumentRequired(dataArray);
    this.isPossibleMovement(dataArray);
    //console.log("isPossibleMovment: "+this.isPossibleMovement(dataArray));
  }

  selectFile($event){
    this.spinner.show();
    this.downloadDate = this.fillDate(new Date());
    this.downloadHour = this.fillDateHour(new Date());
    let fileList = $event.srcElement.files;
    let file = fileList[0];
    if(file && file.name.endsWith(".csv")){
      this.fileName = file.name;
      this.cookieService.set('uploadMovementFile', 'Upload du fichier: '+file.name);
      this.audit.uploadMovementFile = 'Upload du fichier: '+file.name;
      this.appService.saveAudit(this.audit);
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
        this.spinner.hide();
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

  searchAMovements(event){
    this.motCle = event;
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
    if(date) {
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

  /*public downloadPDF($event:any){
    $event.preventDefault();
    $event.stopPropagation();
    Filemanagement.downloadPDF(this.content.nativeElement.innerHTML);
  }*/
  public downloadPDF($event:any){
    //let audit: Audit = new Audit();
    this.typeOfReport = 'mouvement';
    $event.preventDefault();
    $event.stopPropagation();
    Filemanagement.downloadPDF(this.content.nativeElement.innerHTML, this.typeOfReport);
    /*this.cookieService.set('fileUploadError', this.cookieService.get('fileUploadError')+';fileUploadError'+new Date()+'.pdf');
    audit.errorFileName = 'fileUploadError'+new Date()+'.pdf';
    this.appService.saveAudit(audit);*/
  }
}
