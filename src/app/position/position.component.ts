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

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css'],
})

export class PositionComponent implements OnInit{

  pagePositions:any;
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

  @ViewChild('content')
  content: ElementRef;

  @ViewChild('report')
  report: ElementRef;
  typeOfReport: string = '';

  operation: string='';

  dataArray:  any = null;

  positionDataArray: Positions[]=[];
  positionCreatedDataArray: Positions[]=[];
  positionUpdateDataArray: Positions[]=[];

  refInstrumentRequired: boolean = true;
  refInstrumentRequiredLine: number =1;

  quantiteInstrumentRequired: boolean = true;
  quantiteInstrumentRequiredLine: number = 1;

  pruInstrumentRequired: boolean=true;
  pruInstrumentRequiredLine: number = 1;

  dateModificationRequired: boolean = true;
  dateModificationRequiredLine: number =1;

  compteRequired: boolean = true;
  compteRequiredLine: number=1;
  compteValidedLine: number=1;
  compteValid:boolean = true;

  positionReportCreateFile: ReportCreateFile = new ReportCreateFile();
  positionReportUpdateFile: ReportUpdateFile = new ReportUpdateFile();

  selectedPosition: Positions;
  positionForm: FormGroup;
  positions: Positions[];
  BadHeaders: boolean = false;
  compteDataArray: Compte[] =[];

  constructor(private positionService: PositionService,
              private compteService: CompteService,
              private reportCreateFileService: ReportCreateFileService,
              private reportUpdateFileService: ReportUpdateFileService,
              private fb: FormBuilder,
              private route: ActivatedRoute){
    this.createForm();
  }

  ngOnInit(){
    this.dataModelList = [
      new DataModel('refInstrument', 'Référence instrument', 'string', false, []),
      new DataModel('quantiteInstrument', 'Quantité instrument', 'number', false, []),
      new DataModel('pruInstrument', 'PRU instrument', 'string', false, []),
      new DataModel('dateUpdate', 'Date modification', 'any', false, []),
      new DataModel( 'compte', 'Numero Compte', 'any', false,[])
    ];
    this.dataModelListFiltred = this.dataModelList.filter(dataModel => !dataModel.readonly);
    this.initPosition();
    this.positions = this.route.snapshot.data.positions;
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
  isRefIntrumentRequired(dataArray){
    for(let i=0; i<dataArray.length; i++){
      if(dataArray[i].refInstrument == 0){
        this.refInstrumentRequiredLine +=i;
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
  isPruInstrumentRequired(dataArray){
    for(let i=0; i<dataArray.length; i++){
      if(dataArray[i].pruInstrument == 0){
        this.pruInstrumentRequiredLine +=i;
        this.currentStep =-1;
        return false;
      }
    }
    return true;
  }
  isDateModificationRequired(dataArray){
    for(let i=0; i<dataArray.length; i++){
      if(dataArray[i].dateUpdate == 0){
        this.dateModificationRequiredLine +=i;
        this.currentStep =-1;
        return false;
      }
    }
    return true;
  }
  isCompteRequired(dataArray){
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
    for(let i=0; i< dataArray.length; i++)
    {
      if(dataArray[i].compte !==0){
        this.compteService.getOne(dataArray[i].compte).subscribe((data) => {
          if(data!== null){
            this.compteDataArray.push(data);
          }
        });

        if(this.compteDataArray.length !==0) {
          this.compteValidedLine += i;
          this.currentStep = -1;
          return false;
        }
      }
    }
    return true;
  }

  controleModuleMovement(dataArray){
    this.refInstrumentRequired = this.isRefIntrumentRequired(dataArray);
    this.quantiteInstrumentRequired = this.isQuantiteInstrumentRequired(dataArray);
    this.pruInstrumentRequired = this.isPruInstrumentRequired(dataArray);
    this.dateModificationRequired = this.isDateModificationRequired(dataArray);
    this.compteRequired = this.isCompteRequired(dataArray);
    this.compteValid = this.isCompteCreated(dataArray);
  }

  selectFile($event){
    let fileList = $event.srcElement.files;
    let file = fileList[0];
    if(file && file.name.endsWith(".csv")){
      this.fileName = file.name;
      //this.cookieService.set('uploadFileName', file.name);
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

        this.controleModuleMovement(this.dataArray);

        //Integration du module position
        this.buildPositionDataArray(this.dataArray);

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
      this.positionService.getOne(dataArray[i].refInstrument.toUpperCase() + dataArray[i].quantiteInstrument+'_ID').subscribe((data) =>{
        if(data != null){
          this.positionUpdateDataArray.push(data);
        }else{
          this.positionCreatedDataArray.push(data);
        }
      });
      position.idPosition = dataArray[i].refInstrument.toUpperCase() + dataArray[i].quantiteInstrument+'_ID';
      position.refInstrument = dataArray[i].refInstrument;
      position.quantiteInstrument = dataArray[i].quantiteInstrument;
      position.pruInstrument = dataArray[i].pruInstrument;
      position.dateUpdate = dataArray[i].dateUpdate;
      compte.numCompte = dataArray[i].compte;
      position.compte = compte;
      this.positionDataArray.push(position);
    }
  }

  sendDataToServer(){
    this.sendPositionToServer();
    this.currentStep = 3;
    this.loadPositions();
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
    Filemanagement.downloadPDFModules(this.report.nativeElement.innerHTML,this.typeOfReport);
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
        this.initPosition();
        this.loadPositions();
      }
    )
  }

  deletePosition(){
    this.positionService.delete(this.selectedPosition.idPosition).subscribe(
      res=>{
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

  searchPosition(){
    this.loadPositions();
  }

  downloadFile(data: any) {
    let file = 'positions_'+ new Date()+'.csv';
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

  fillDate(date:any) {
    if (date && (date.indexOf('-') > -1)) {
      let year = new Date(Date.parse(date)).getFullYear();
      let month = new Date(Date.parse(date)).getMonth() + 1;
      let day = new Date(Date.parse(date)).getDate();
      let dateFormat = day + '/' + month + '/' + year;
      if (day >= 1 && day <= 9) {
        dateFormat = '0' + day + '/' + month + '/' + year;
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
