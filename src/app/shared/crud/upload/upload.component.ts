import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DataModel} from '../../data.model';
import {CrudService} from '../../crud.service';
import {Filemanagement} from "../../../common/filemanagement";
import {CookieService} from 'ngx-cookie-service';
import {AppService} from '../../../app.service';
import { NgxSpinnerService } from 'ngx-spinner';
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

  dataArray:  any = null;

  nbreLigneRejete: number = 0;

  currentStep = 1;

  selectedStep = 1;

  dataFromServer: any = null;

  dataSentToServer: boolean = false;


  company_cd_required: boolean = true;

  dataModelListFiltred: any;

  fileName: string = '';

  @Output() messageEvent = new EventEmitter<any>();
  BadHeaders: boolean = false;
  isuploaded: boolean;

  constructor(private cookieService: CookieService,
              private appService: AppService,
              private spinner: NgxSpinnerService,
              private fileUploadedService: UploadedFileService) { }

  ngOnInit() {
    this.dataModelListFiltred = this.dataModelList.filter(dataModel => !dataModel.readonly);
    this.fileUploadedService.currentuploadedfile.subscribe(isUploaded => this.isuploaded = isUploaded)
    }



  selectFile($event){
    /*this.spinner.show();
    this.downloadDate = this.fillDate(new Date());
    this.downloadHour = this.fillDateHour(new Date());
    this.fileUploadedService.changeIsFileIsUploaded(true);
    let fileList = $event.srcElement.files;
    let file = fileList[0];
    if(file && file.name.endsWith(".csv")){
      this.fileName = file.name;
      this.cookieService.set('uploadFileName', this.cookieService.get('uploadFileName')+';'+file.name);
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
    }*/
  }


  public downloadPDFModules($event:any){
    this.typeOfReport = 'affiliation';
    $event.preventDefault();
    $event.stopPropagation();
    Filemanagement.downloadPDFModules(this.report.nativeElement.innerHTML, this.typeOfReport);
    this.currentStep = 4;
    this.cookieService.set('reportFileName', this.cookieService.get('reportFileName')+';reportFile'+new Date()+'.pdf');

  }

}
