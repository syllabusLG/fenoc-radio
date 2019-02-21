import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Audit} from '../shared/audit.model';
import {DataModel} from '../shared/data.model';
import {Instruments} from '../shared/instruments.model';
import {ReportCreateFile} from '../shared/report.create.file.model';
import {ReportUpdateFile} from '../shared/report.update.file.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {InstrumentService} from './instrument.service';
import {AppService} from '../app.service';
import {CookieService} from 'ngx-cookie-service';
import {ReportCreateFileService} from '../report-create-file/report.create.file.service';
import {ReportUpdateFileService} from '../report-update-file/report.update.file.service';
import {ActivatedRoute} from '@angular/router';
import {Filemanagement} from '../common/filemanagement';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-instruments',
  templateUrl: './instruments.component.html',
  styleUrls: ['./instruments.component.css']
})
export class InstrumentsComponent implements OnInit {

  @ViewChild('reportInstrument')
  reportInstrument: ElementRef;

  @ViewChild('content')
  content: ElementRef;

  audit: Audit = new Audit();

  typeOfReport: string = '';
  pageInstruments: any;
  keyWord: string= '';
  currentPage: number = 0;
  size: number = 5;
  pages: Array<number>;

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
  dataArray:  any = null;
  instrumentsDataArray: Instruments[] = [];
  instrumentsCreatedDataArray: Instruments[] = [];
  instrumentsUpdatedDataArray: Instruments[] = [];

  codeRequired: boolean = true;
  codeRequiredLine: number = 1;

  nomRequired: boolean = true;
  nomRequiredLine: number = 1;

  statutRequired: boolean=  true;
  statutRequiredLine: number = 1;

  instrumentReportCreateFile: ReportCreateFile = new ReportCreateFile();
  instrumentReportUpdateFile: ReportUpdateFile = new ReportUpdateFile();

  selectedInstrument: Instruments;
  instrumentForm: FormGroup;
  instruments: Instruments[];
  BadHeaders: boolean = false;
  isdataNull: boolean = false;

  constructor(private instrumentService: InstrumentService,
              private appService: AppService,
              private cookieService: CookieService,
              private reportCreateFileService: ReportCreateFileService,
              private reportUpdateFileService: ReportUpdateFileService,
              private fb: FormBuilder,
              private route: ActivatedRoute) {
    this.createForm();
  }

  ngOnInit() {
    this.dataModelList = [

      new DataModel('code', 'Code', 'string', false, []),
      new DataModel('nom', 'Nom', 'string', false, []),
      new DataModel('codeSocieteGestion', 'Code Societe Gestion', 'string', false, []),
      new DataModel('statut', 'Statut', 'string', false, []),
      new DataModel('nature', 'Nature', 'string', false, []),
      new DataModel('classification', 'Classification', 'string', false, []),
      new DataModel('CodeEmploiRevenu', 'Code Emploi Revenu', 'string', false, []),
      new DataModel('periodicite', 'Periodicite', 'string', false, []),
      new DataModel('precisionPart', 'Precision Part', 'number', false, []),
      new DataModel('precisionVL', 'PrecisionVL', 'number', false, [])

    ];
    this.dataModelListFiltred = this.dataModelList.filter(dataModel => !dataModel.readonly);

    this.initInstruments();
    this.instruments = this.route.snapshot.data.instruments;
    this.loadInstruments();

  }
  initInstruments(){
    this.selectedInstrument = new Instruments();
    this.createForm();
  }
  createForm(){
    this.instrumentForm = this.fb.group({
      code:['', Validators.required],
      nom: '',
      codeSocieteGestion: '',
      statut: '',
      nature: '',
      classification: '',
      CodeEmploiRevenu: '',
      periodicite: '',
      precisionPart: '',
      precisionVL: '',
      precisionPlusValue: '',
      cutOffStp: '',
      idDevise: '',
      niveauRisque: '',
      horizonPlacement: '',
      cutOff: '',
      cutOffFax: '',
      codeFundLife: '',
      idPlateforme: '',
      idSocieteGestion: '',
      idDepositaire: '',
      idAgentTransfert: ''
    });
  }

  loadInstruments(){
    this.instrumentService.search(this.keyWord, this.currentPage, this.size)
      .subscribe(data=>{
        this.pageInstruments = data;
        this.pages = new Array(data['totalPages']);
      }, error=>{
        console.log(error);
      });
  }

  getBindHeadersDataModelListArray(headers){
    let bindArray = [];
    let index = 0;
    let instrumentHeaders = this.dataModelList.map(function(a) {return a.columnName;});
    let getDataType = (header) => {
      let dataType = '';
      this.dataModelList.forEach(dataModel => {
        if(dataModel.columnName == header){
          dataType = dataModel.dataType;
        }else{
          if(instrumentHeaders.indexOf(header) <= -1){
            console.log('______****'+instrumentHeaders.indexOf(header));
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
  isCodeRequired(dataArray) {
    for (let i = 0; i < dataArray.length; i++){
      if (dataArray[i].code == 0){
        this.codeRequiredLine += i;
        this.currentStep = -1;
        return false;
      }
    }
    return true;
  }
  isNomRequired(dataArray) {
    for (let i = 0; i < dataArray.length; i++){
      if (dataArray[i].nom == 0){
        this.nomRequiredLine += i;
        this.currentStep = -1;
        return false;
      }
    }
    return true;
  }
  isStatutRequired(dataArray) {
    for (let i = 0; i < dataArray.length; i++){
      if (dataArray[i].statut == 0){
        this.statutRequiredLine += i;
        this.currentStep = -1;
        return false;
      }
    }
    return true;
  }
  sendDataToServer(){
    this.sendInstrumentsToServer();
    this.currentStep = 3;
    this.loadInstruments();
    this.instruments = this.instrumentsDataArray;

  }

  sendInstrumentsToServer(){
    this.instrumentService.addAll(this.instrumentsDataArray).subscribe((data)=>{
      this.instrumentReportCreateFile.nbreLinesCreated = this.instrumentsCreatedDataArray.length;
      this.instrumentReportUpdateFile.nbreLinesUpdated = this.instrumentsUpdatedDataArray.length;
      if(this.instrumentsCreatedDataArray.length > 0){
        this.reportCreateFileService.add(this.instrumentReportCreateFile).subscribe();
      }
      if(this.instrumentsUpdatedDataArray.length > 0){
        this.reportUpdateFileService.add(this.instrumentReportUpdateFile).subscribe();
      }
      this.dataFromServer = data;
      this.dataSentToServer = true;
    });
  }

  buildInstrumentsDataArray(dataArray){
    this.instrumentReportCreateFile.module = 'Instruments';
    this.instrumentReportUpdateFile.module = 'Instruments';
    for(let i=0; i< dataArray.length; i++)
    {
      let instruments: Instruments = new Instruments();
      this.instrumentService.getOne(dataArray[i].code).subscribe((data)=>{
        if(data !== null){
          this.instrumentsUpdatedDataArray.push(data);
        }else{
          this.instrumentsCreatedDataArray.push(data);
        }
      });
      instruments.code = dataArray[i].code;
      instruments.nom = dataArray[i].nom;
      instruments.codeSocieteGestion = dataArray[i].codeSocieteGestion;
      instruments.statut = dataArray[i].statut;
      instruments.nature = dataArray[i].nature;
      instruments.classification = dataArray[i].classification;
      instruments.codeEmploiRevenu = dataArray[i].codeEmploiRevenu;
      instruments.periodicite = dataArray[i].periodicite;
      instruments.precisionPart = dataArray[i].precisionPart;
      instruments.precisionVL = dataArray[i].precisionVL;
      instruments.precisionPlusValue = dataArray[i].precisionPlusValue;
      instruments.cutOffStp = dataArray[i].cutOffStp;
      instruments.idDevise = dataArray[i].idDevise;
      instruments.niveauRisque = dataArray[i].niveauRisque;
      instruments.horizonPlacement = dataArray[i].horizonPlacement;
      instruments.cutOff = dataArray[i].cutOff;
      instruments.cutOffFax = dataArray[i].cutOffFax;
      instruments.codeFundLife = dataArray[i].codeFundLife;
      instruments.idPlateforme = dataArray[i].idPlateforme;
      instruments.idSocieteGestion = dataArray[i].idSocieteGestion;
      instruments.idDepositaire = dataArray[i].idDepositaire;
      instruments.idAgentTransfert = dataArray[i].idAgentTransfert;
      this.instrumentsDataArray.push(instruments);
    }
  }

  controleHeaders (headers) {
    let uploadHeaders = "code;nom;codeSocieteGestion;statut;nature;classification;codeEmploiRevenu;periodicite;precisionPart;precisionVL;precisionPlusValue;cutOffStp;idDevise;niveauRisque;horizonPlacement;cutOff;cutOffFax;codeFundLife;idPlateforme;idSocieteGestion;idDepositaire;idAgentTransfert";
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
  controleModuleInstrument(dataArray){
    this.codeRequired = this.isCodeRequired(dataArray);
    this.nomRequired = this.isNomRequired(dataArray);
    this.statutRequired = this.isStatutRequired(dataArray);
  }
  selectFile($event){
    let fileList = $event.srcElement.files;
    let file = fileList[0];
    if(file && file.name.endsWith(".csv")){
      this.fileName = file.name;
      this.cookieService.set('uploadIntrumentFile', 'Upload du fichier: '+file.name);
      this.audit.uploadInstrumentFile = 'Upload du fichier: '+file.name;
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

          this.controleModuleInstrument(this.dataArray);

          this.buildInstrumentsDataArray(this.dataArray);
        }
        this.currentStep++;
      };
    }
  }
  public downloadPDFModules($event:any){
    this.typeOfReport = 'instrument';
    $event.preventDefault();
    $event.stopPropagation();
    Filemanagement.downloadPDFModules(this.report.nativeElement.innerHTML,this.typeOfReport);
    this.currentStep = 4;
  }
  addInstrument(){
    const  instrument = this.instrumentForm.value;
    this.instrumentService.add(instrument).subscribe(
      res=>{
        this.initInstruments();
        this.loadInstruments();
      }
    );
  }
  updateInstrument(){
    this.instrumentService.update(this.selectedInstrument).subscribe(
      res=>{
        this.cookieService.set('updateInstrument', 'Modification de l\'instrument: '+this.selectedInstrument.code);
        this.initInstruments();
        this.loadInstruments();
      }
    )
  }
  deleteInstrument(){
    this.instrumentService.delete(this.selectedInstrument.code).subscribe(
      res=>{
        this.cookieService.set('deleteInstrument', 'Suppression de l\'instrument: '+this.selectedInstrument.code);
        this.selectedInstrument = new Instruments();
        this.loadInstruments();
      }
    )
  }
  gotoPage(i: number) {
    this.currentPage = i;
    this.loadInstruments();
  }

  searchInstrument(event){
    this.keyWord = event;
    this.loadInstruments();
  }
  
  downloadFile(data: any){
    let file = 'instruments_'+ new Date()+'.csv';
    this.cookieService.set('exportInstrumentCSV', 'Telechargement du fichier: '+file);
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

  public downloadPDF($event:any){
    $event.preventDefault();
    $event.stopPropagation();
    Filemanagement.downloadPDF(this.content.nativeElement.innerHTML);
  }
}
