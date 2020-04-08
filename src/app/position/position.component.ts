import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataModel} from '../shared/data.model';
import {Compte} from '../shared/compte.model';
import {ReportUpdateFile} from '../shared/report.update.file.model';
import {ReportCreateFile} from '../shared/report.create.file.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {ReportCreateFileService} from '../report-create-file/report.create.file.service';
import {ReportUpdateFileService} from '../report-update-file/report.update.file.service';
import {PositionService} from './position.service';
import {Positions} from '../shared/position.model';
import {Filemanagement} from '../common/filemanagement';
import { saveAs } from 'file-saver';
import {CompteService} from "../compte/compte.service";
import {CookieService} from 'ngx-cookie-service';
import {Instruments} from '../shared/instruments.model';
import {NgxSpinnerService} from 'ngx-spinner';
import {Audit} from '../shared/audit.model';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css'],
})

export class PositionComponent implements OnInit{

  pagePositions:any;
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
  dataModelList: DataModel[];

  @ViewChild('content')
  content: ElementRef;

  @ViewChild('report')
  report: ElementRef;
  typeOfReport: string = '';
  downloadDate: any;
  downloadHour: any;

  operation: string='';
  dataArray:  any = null;

  positionDataArray: Positions[]=[];
  positionCreatedDataArray: Positions[]=[];
  positionUpdateDataArray: Positions[]=[];

  isControleFile: boolean = true;

  refInstrumentRequired: boolean = true;
  refInstrumentRequiredLine: number =2;

  quantiteInstrumentRequired: boolean = true;
  quantiteInstrumentRequiredLine: number = 2;

  pruInstrumentRequired: boolean=true;
  pruInstrumentRequiredLine: number = 2;

  dateModificationRequired: boolean = true;
  dateModificationRequiredLine: number =2;

  noDuplicateInstrumentCompte: boolean = true;
  noDuplicateInstrumentCompteLine: number = 2;

  compteRequired: boolean = true;
  compteRequiredLine: number=2;
  compteValidedLine: number=2;
  compteValid:boolean = true;

  positionReportCreateFile: ReportCreateFile = new ReportCreateFile();
  positionReportUpdateFile: ReportUpdateFile = new ReportUpdateFile();

  selectedPosition: Positions;
  positionForm: FormGroup;
  positions: Positions[];
  BadHeaders: boolean = false;
  isdataNull: boolean = false;

  constructor(private positionService: PositionService,
              private compteService: CompteService,
              private cookieService: CookieService,
              private reportCreateFileService: ReportCreateFileService,
              private reportUpdateFileService: ReportUpdateFileService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private spinner: NgxSpinnerService){
    this.createForm();
  }

  ngOnInit(){
    this.dataModelList = [
      new DataModel('instruments', 'Référence instrument', 'string', false, []),
      new DataModel('quantiteInstrument', 'Quantité instrument', 'number', false, []),
      new DataModel('pruInstrument', 'PRU instrument', 'string', false, []),
      new DataModel('dateUpdate', 'Date modification', 'any', false, []),
      new DataModel( 'compte', 'Numero Compte', 'any', false,[]),
    ];
    this.dataModelListFiltred = this.dataModelList.filter(dataModel => !dataModel.readonly);
    this.initPosition();
    this.positions = this.changeCompte(this.route.snapshot.data.positions);
    this.loadPositions();
  }

  createForm(){
    this.positionForm = this.fb.group({
      idPosition: ['', Validators.required],
      refInstrument: '',
      quantiteInstrument:'',
      pruInstrument: '',
      dateUpdate: '',
      compte:''
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
    if(tabFile[1].toLowerCase() !== 'position'){
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
  isRefIntrumentRequired(dataArray){
    for(let i=0; i<dataArray.length; i++){
      if(dataArray[i].instruments.length === 0){
        this.refInstrumentRequiredLine +=i;
        this.currentStep =-1;
        return false;
      }
    }
    return true;
  }
  isQuantiteInstrumentRequired(dataArray){
    for(let i=0; i<dataArray.length; i++){
      if(dataArray[i].quantiteInstrument.length === 0 || Number(dataArray[i].quantiteInstrument) < 0){
        this.quantiteInstrumentRequiredLine +=i;
        this.currentStep =-1;
        return false;
      }
    }
    return true;
  }
  isPruInstrumentRequired(dataArray){
    for(let i=0; i<dataArray.length; i++){
      if(dataArray[i].pruInstrument.length === 0 || Number(dataArray[i].pruInstrument) < 0){
        this.pruInstrumentRequiredLine +=i;
        this.currentStep =-1;
        return false;
      }
    }
    return true;
  }
  isDateModificationRequired(dataArray){
    for(let i=0; i<dataArray.length; i++){
      if(dataArray[i].dateUpdate.length === 0){
        this.dateModificationRequiredLine +=i;
        this.currentStep =-1;
        return false;
      }
    }
    return true;
  }
  isCompteRequired(dataArray){
    for(let i=0; i<dataArray.length; i++){
      if(dataArray[i].compte.length === 0){
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

  controleHeaders (headers) {
    let uploadHeaders = "instruments;quantiteInstrument;pruInstrument;dateUpdate;compte;company_CD";
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

  controleModulePosition(dataArray){
    this.isControleFile = this.controleFile(dataArray, this.fileName);
    this.noDuplicateInstrumentCompte = this.isNoDuplicateInstrumentCompte(dataArray);
    this.refInstrumentRequired = this.isRefIntrumentRequired(dataArray);
    this.quantiteInstrumentRequired = this.isQuantiteInstrumentRequired(dataArray);
    this.pruInstrumentRequired = this.isPruInstrumentRequired(dataArray);
    this.dateModificationRequired = this.isDateModificationRequired(dataArray);
    this.compteRequired = this.isCompteRequired(dataArray);
    this.compteValid = this.isCompteCreated(dataArray);
  }

  selectFile($event){
    this.spinner.show();
    this.downloadDate = this.fillDate(new Date());
    this.downloadHour = this.fillDateHour(new Date());
    let fileList = $event.srcElement.files;
    let file = fileList[0];
    if(file && file.name.endsWith(".csv")){
      this.fileName = file.name;
      this.cookieService.set('uploadPositionFile', 'Upload du fichier :'+file.name);
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
        let headers = csvRecordsArray && csvRecordsArray.length>0 ? csvRecordsArray[0].split(";") : [];
        // bind headers with dataModelist
        let bindArray = this.getBindHeadersDataModelListArray(headers);
        //check is the headers are good or not

        this.BadHeaders = this.controleHeaders(headers);

        if(!this.BadHeaders) {
          // create data bindArray
          this.dataArray = this.buildDataArray(bindArray, csvRecordsArray);
          this.controleModulePosition(this.dataArray);
          //Delete default positions
          /*this.positionService.dropDefaultPositions().subscribe(resp =>{
            console.log('les données sont supprimées: '+resp);
          });*/
          //Integration du module position
          this.buildPositionDataArray(this.dataArray);
        }
        this.spinner.hide();
        this.currentStep++;
      };
    }
  }
  buildPositionDataArray(dataArray){
    this.positionReportCreateFile.module = "Position";
    this.positionReportUpdateFile.module = "Position";
    for(let i = 0; i < dataArray.length; i++){
      let position: Positions = new Positions();
      let compte: Compte = new Compte();
      let instruments: Instruments = new Instruments();
      this.positionService.getOne(i).subscribe((data) =>{
        if(data != null){
          this.positionUpdateDataArray.push(data);
        }else{
          this.positionCreatedDataArray.push(data);
        }
      });
     // position.idPosition = dataArray[i].instruments.toUpperCase() + dataArray[i].quantiteInstrument+'_ID';
      position.quantiteInstrument = dataArray[i].quantiteInstrument;
      position.pruInstrument = dataArray[i].pruInstrument;
      position.dateUpdate = dataArray[i].dateUpdate;
      instruments.code = dataArray[i].instruments;
      compte.numCompte = dataArray[i].compte;
      position.instruments = instruments;
      position.compte = compte;
      this.positionDataArray.push(position);
    }
  }

  sendDataToServer(){
    this.sendPositionToServer();
    this.currentStep = 3;
    this.loadPositions();
    this.positions = this.positionDataArray;

  }

  sendPositionToServer(){
    this.positionService.addAll(this.positionDataArray).subscribe((data)=> {
      this.positionReportCreateFile.nbreLinesCreated = this.positionCreatedDataArray.length;
      this.positionReportUpdateFile.nbreLinesUpdated = this.positionUpdateDataArray.length;
      if(this.positionCreatedDataArray.length > 0){
        this.reportCreateFileService.add(this.positionReportCreateFile).subscribe();
      }
      if(this.positionUpdateDataArray.length > 0){
        this.reportUpdateFileService.add(this.positionReportUpdateFile).subscribe();
      }
      this.dataFromServer = data;
      this.dataSentToServer = true;
    });
  }

  public downloadPDFModules($event:any){
    this.typeOfReport = 'position';
    $event.preventDefault();
    $event.stopPropagation();
    Filemanagement.downloadPDFModules(this.report.nativeElement.innerHTML, this.typeOfReport);
    this.currentStep = 4;
  }

  addPosition(){
    const  position = this.positionForm.value;
    this.positionService.add(position).subscribe(
      res=>{
        this.initPosition();
        this.loadPositions();
      }
    );
  }

  updatePosition(){
    let dateUpdate = this.selectedPosition.dateUpdate;
    if(dateUpdate && (dateUpdate.indexOf('-') > -1)){
      this.selectedPosition.dateUpdate = this.fillDate(dateUpdate);
    }
    this.positionService.update(this.selectedPosition).subscribe(
      res=>{
        this.cookieService.set('updatePosition', 'Modification de la position: '+this.selectedPosition.idPosition);
        this.initPosition();
        this.loadPositions();
      }
    )
  }

  deletePosition(){
    this.positionService.delete(this.selectedPosition.idPosition).subscribe(
      res=>{
        this.cookieService.set('deletePosition', 'Suppression de la position: '+this.selectedPosition.idPosition);
        this.selectedPosition = new Positions();
        this.loadPositions();
      }
    )
  }

  initPosition(){
    this.selectedPosition = new Positions();
    this.createForm();
  }

  loadPositions(){
    this.positionService.search(this.motCle, this.currentPage, this.size)
      .subscribe(data=>{
        this.pagePositions = data;
        this.pages = new Array(data['totalPages']);
      }, error=>{
        console.log(error);
      });
  }

  gotoPage(i: number) {
    this.currentPage = i;
    this.loadPositions();
  }

  searchPosition(event){
    this.motCle = event;
    this.loadPositions();
  }

  downloadFile(data: any) {
    let file = 'positions_'+ new Date()+'.csv';
    this.cookieService.set('exportPositionCSV', 'Telechargement du fichier: '+file);
    const replacer = (key, value) => value === null ? '' : value;
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
 /* public downloadPDF($event:any){
      $event.preventDefault();
      $event.stopPropagation();
      Filemanagement.downloadPDF(this.content.nativeElement.innerHTML);
  }*/
  public downloadPDF($event:any){
    //let audit: Audit = new Audit();
    this.typeOfReport = 'position';
    $event.preventDefault();
    $event.stopPropagation();
    Filemanagement.downloadPDF(this.content.nativeElement.innerHTML, this.typeOfReport);
    /*this.cookieService.set('fileUploadError', this.cookieService.get('fileUploadError')+';fileUploadError'+new Date()+'.pdf');
    audit.errorFileName = 'fileUploadError'+new Date()+'.pdf';
    this.appService.saveAudit(audit);*/
  }
  changeCompte(position: Positions[]){
    for(let i = 0; i < position.length; i++){
      let compte: Compte = new Compte();
      compte.numCompte = position[i].compte.numCompte;
      position[i].compte = compte;
    }
    return position;
  }
}
