import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataModel} from '../shared/data.model';
import {Mouvements} from '../shared/mouvements.model';
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

  @ViewChild('report')
  report: ElementRef;

  operation: string='';

  dataArray:  any = null;
  positionDataArray: Positions[]=[];
  positionCreatedDataArray: Positions[]=[];
  positionUpdateDataArray: Positions[]=[];

  positionReportCreateFile: ReportCreateFile = new ReportCreateFile();
  positionReportUpdateFile: ReportUpdateFile = new ReportUpdateFile();

  selectedPosition: Positions;
  positionForm: FormGroup;
  positions: Positions[];

  constructor(private positionService: PositionService,
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

        //this.controleModuleMovement(this.dataArray);

        //Integration du module position
        this.buildPositionDataArray(this.dataArray);

        this.currentStep++;
        //this.emmitErrors();
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
    $event.preventDefault();
    $event.stopPropagation();
    Filemanagement.downloadPDFModules(this.report.nativeElement.innerHTML);
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
    this.positionService.update(this.selectedPosition).subscribe(
      res=>{
        this.initPosition();
        this.loadPositions();
      }
    )
  }

  deleteMouvement(){
    this.positionService.delete(this.selectedPosition.idPosition).subscribe(
      res=>{
        this.selectedPosition = new Mouvements();
        this.loadPositions();
      }
    )
  }

  initPosition(){
    this.selectedPosition = new Positions();
    this.createForm();
    this.loadPositions();
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
}
