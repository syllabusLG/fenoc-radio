import {Component, ElementRef, Input, OnInit, ViewChild} from "@angular/core";
import {DataModel} from "../shared/data.model";
import {Mouvements} from "../shared/mouvements.model";
import {MovementService} from "./movement.service";
import {Compte} from "../shared/compte.model";
import {Filemanagement} from "../common/filemanagement";
import {ReportCreateFile} from "../shared/report.create.file.model";
import {ReportUpdateFile} from "../shared/report.update.file.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-movement',
  templateUrl: './movement.component.html',
  styleUrls: ['./movement.component.css'],
})

export class MovementComponent implements  OnInit{

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
  nbreLigneRejete: number = 0;

  @Input()
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
  numMouvementValid: boolean = true;

  sensRequired: boolean = true;
  sensRequiredLine: number = 1;
  sensValid: boolean = true;

  refInstrumentRequired: boolean = true;
  refInstrumentRequiredLine: number = 1;
  refInstrumentValid: boolean = true;

  quantiteInstrumentRequired: boolean = true;
  quantiteInstrumentRequiredLine: number = 1;
  quantiteInstrumentValid: boolean = true;

  navRequired: boolean = true;
  navRequiredLine: number = 1;
  navValid: boolean = true;

  pruInstrumentRequired: boolean = true;
  pruInstrumentRequiredLine: number = 1;
  pruInstrumentValid: boolean = true;

  dateCompteRequired: boolean = true;
  dateCompteRequiredLine: number =1;
  dateCompteValid: boolean = true;

  dateValeurRequired: boolean = true;
  dateValuerRequiredLine: number = 1;
  dateValuerValid: boolean = true;

  dateOperationRequired: boolean = true;
  dateOperationRequiredLine: number = 1;
  dateOperationValid: boolean = true;

  compteRequired: boolean = true;
  compteRequiredLine: number = 1;
  compteValid: boolean = true;


  movementReportCreateFile: ReportCreateFile = new ReportCreateFile();
  movementReportUpdateFile: ReportUpdateFile = new ReportUpdateFile()

  selectedMovement: Mouvements;
  movementForm: FormGroup;
  movements: Mouvements[];
  constructor(private movementService: MovementService,private fb: FormBuilder,private route: ActivatedRoute){
    this.createForm();
  }

  ngOnInit() {
    this.dataModelList = [
      new DataModel( 'numMouvement', 'Número Mouvements', 'string', false,[]),
      new DataModel( 'sens', 'Sens', 'string', false,[]),
      new DataModel( 'refInstrument', 'Reférence Instrument', 'string', false,[]),
      new DataModel( 'quantiteInstrument', 'Quantité', 'string', false,[]),
      new DataModel( 'nav', 'Nav', 'string', false,[]),
      new DataModel( 'pruInstrument', 'PRU', 'string', false,[]),
      new DataModel( 'dateCompte', 'Date Compte', 'string', false,[]),
      new DataModel( 'dateValeur', 'Date Value', 'string', false,[]),
      new DataModel( 'dateOperation', 'Date Operational', 'string', false,[]),
      new DataModel( 'compte', 'Número Compte', 'string', false,[]),
    ]
    this.dataModelListFiltred = this.dataModelList.filter(dataModel => !dataModel.readonly);

    this.initMoviments();
    this.movements = this.route.snapshot.data.mouvements;

  }

  initMoviments(){
    this.selectedMovement = new Mouvements();
    this.createForm();
    this.loadMovements();
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

  isNumMouvementValid(dataArray){
    for(let i=0; i<this.dataArray.length; i++){
      if(dataArray[i].numMouvement!== 0 && !this.isNumMouvementValid(dataArray[i].numMouvement)){
        return false;
      }
    }
    return true;
  }

  isSensRequired(dataArray){
    for(let i=0; i<dataArray.length; i++){
      if(dataArray[i].Sens == 0){
        this.sensRequiredLine +=i;
        this.currentStep =-1;
        return false;
      }
    }
    return true;
  }

  isSensValid(dataArray){
    for(let i=0; i<this.dataArray.length; i++){
      if(dataArray[i].sens!== 0 && !this.isSensValid(dataArray[i].sens)){
        return false;
      }
    }
    return true;
  }

  isRefInstrumentRequired(dataArray){
    for(let i=0; i<dataArray.length; i++){
      if(dataArray[i].RefInstrument == 0){
        this.refInstrumentRequiredLine +=i;
        this.currentStep =-1;
        return false;
      }
    }
    return true;
  }

  isRefInstrumentValid(dataArray){
    for(let i=0; i<this.dataArray.length; i++){
      if(dataArray[i].refInstrument!== 0 && !this.isRefInstrumentValid(dataArray[i].refInstrument)){
        return false;
      }
    }
    return true;
  }

  isNavRequired(dataArray){
    for(let i=0; i<dataArray.length; i++){
      if(dataArray[i].Nav == 0){
        this.navRequiredLine +=i;
        this.currentStep =-1;
        return false;
      }
    }
    return true;
  }

  isNavValid(dataArray){
    for(let i=0; i<this.dataArray.length; i++){
      if(dataArray[i].nav!== 0 && !this.isNavValid(dataArray[i].nav)){
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

  ispruInstrumentValid(dataArray){
    for(let i=0; i<this.dataArray.length; i++){
      if(dataArray[i].pruInstrument!== 0 && !this.ispruInstrumentValid(dataArray[i].pruInstrument)){
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

  isDateCompteValid(dataArray)
  {
    for(let i=0; i<this.dataArray.length; i++){
      if(dataArray[i].dateCompte!== 0 && !this.isDateCompteValid(dataArray[i].dateCompte)){
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

  isDateValuerValid(dataArray){
    for(let i=0; i<this.dataArray.length; i++){
      if(dataArray[i].dateValeur!== 0 && !this.isDateValuerValid(dataArray[i].dateValeur)){
        return false;
      }
    }
    return true;
  }

  isOperationRequired(dataArray){
    for(let i=0; i<dataArray.length; i++){
      if(dataArray[i].dateOperation == 0){
        this.dateOperationRequiredLine +=i;
        this.currentStep =-1;
        return false;
      }
    }
    return true;
  }

  isDateOperationValid(dataArray){
    for(let i=0; i<this.dataArray.length; i++){
      if(dataArray[i].dateOperation!== 0 && !this.isDateOperationValid(dataArray[i].dateOperation)){
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

  isCompteValid(dataArray){
    for(let i=0; i<this.dataArray.length; i++){
      if(dataArray[i].compte!== 0 && !this.isDateOperationValid(dataArray[i].compte)){
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

  isQuantiteInstrumentValid(dataArray){
    for(let i=0; i<this.dataArray.length; i++){
      if(dataArray[i].quantiteInstrument!== 0 && !this.isQuantiteInstrumentValid(dataArray[i].quantiteInstrument)){
        return false;
      }
    }
    return true;
  }

  sendDataToServer(){
    this.sendMovementsToServer();
    this.currentStep = 3;
  }

  sendMovementsToServer(){
    console.log("Movements Array: "+this.movementsDataArray);
    this.movementService.addAll(this.movementsDataArray).subscribe((data)=> {
    this.dataFromServer = data;
    this.dataSentToServer = true;

    });
  }

  buildMovementsDataArray(dataArray){
    this.movementReportCreateFile.module = 'Movements';
    this.movementReportUpdateFile.module = 'Movements'
    for(let i=0; i< dataArray.length; i++)
    {
      let moviments: Mouvements = new Mouvements();
      let compte: Compte = new Compte();
      compte.numCompte = dataArray[i].compte;
      moviments.compte = compte;
      moviments.dateCompte = dataArray[i].dateCompte;
      moviments.dateOperation = dataArray[i].dateOperation;
      moviments.dateValeur = dataArray[i].dateValeur;
      moviments.nav = dataArray[i].nav;
      moviments.numMouvement = dataArray[i].numMouvement;
      moviments.pruInstrument = dataArray[i].pruInstrument;
      moviments.refInstrument = dataArray[i].refInstrument;
      moviments.sens = dataArray[i].sens;
      this.movementsDataArray.push(moviments);
    }

  }
  controleModuleMovement(dataArray){
    this.numMouvementRequired = this.isNumMouvementRequired(dataArray);
    this.numMouvementValid = this.isNumMouvementValid(dataArray);

    this.sensRequired = this.isSensRequired(dataArray);
    this.sensValid = this.isSensValid(Array);

    this.refInstrumentRequired = this.isRefInstrumentRequired(dataArray);
    this.refInstrumentValid = this.isRefInstrumentValid(dataArray);

    this.navRequired = this.isNavRequired(dataArray);
    this.navValid = this.isNavValid(dataArray);

    this.pruInstrumentRequired = this.ispruInstrumentRequired(dataArray);
    this.pruInstrumentValid = this.ispruInstrumentValid(dataArray);

    this.dateCompteRequired = this.isDateCompteRequired(dataArray);
    this.dateCompteValid = this.isDateCompteValid(dataArray);

    this.dateValeurRequired = this.isDateValuerRequired(dataArray);
    this.dateValuerValid = this.isDateValuerValid(dataArray);

    this.dateOperationRequired = this.isOperationRequired(dataArray);
    this.dateOperationValid = this.isDateOperationValid(dataArray);

    this.compteRequired = this.isCompteRequired(dataArray);
    this.compteValid = this.isCompteValid(dataArray);

    this.quantiteInstrumentRequired = this.isQuantiteInstrumentRequired(dataArray);
    this.quantiteInstrumentValid = this.isQuantiteInstrumentValid(dataArray);

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

       this.buildMovementsDataArray(this.dataArray);

        this.currentStep++;
        //this.emmitErrors();
      };
    }
  }

  public downloadPDFModules($event:any){
    $event.preventDefault();
    $event.stopPropagation();
    Filemanagement.downloadPDFModules(this.report.nativeElement.innerHTML);
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
    this.movementService.update(this.selectedMovement).subscribe(
      res=>{
        this.initMoviments();
        this.loadMovements();
      }
    )
  }

  deleteMouvement(){
    this.movementService.delete(this.selectedMovement.numMouvement).subscribe(
      res=>{
        this.selectedMovement = new Mouvements();
        this.loadMovements();
      }
    )
  }

  gotoPage(i: number) {
    this.currentPage = i;
    this.loadMovements();
  }
}
