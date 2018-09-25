import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DataModel} from '../../data.model';
import {CrudService} from '../../crud.service';
import {COUNTRY} from '../../countries.code';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  @ViewChild("fileUploadInput")
  fileUploadInput: any;

  @Input()
  dataModelList: DataModel[];

  @Input()
  service: CrudService;

  @Output()
  updateData: EventEmitter<any> = new EventEmitter<any>();

  dataArray:  any = null;

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

  dataModelListFiltred: any;

  fileName: string = '';

  COUNTRY = COUNTRY;

  constructor() { }

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

  selectFile($event){
    let fileList = $event.srcElement.files;
    let file = fileList[0];
    if(file && file.name.endsWith(".csv")){
      this.fileName = file.name;
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = (data) => {
        let csvData = reader.result;
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
        this.controleSalarie(this.dataArray);

        this.currentStep++;

      };
    }
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
  controleSalarie(dataArray){
    this.employeStatusGiven = this.isEmployeStatusGiven(dataArray);
    this.employeStatusValid = this.isEmployeStatusValid(dataArray);
    this.hireDateValid = this.isHireDateValide(dataArray);
    this.departDateValid = this.isDepartDateValide(dataArray);
    this.employeNoDepartDate = this.isEmployeNoDepartDate(dataArray);
    this.employeDepartDate = this.isEmployeDepartDate(dataArray);
    this.lastHireDateValid = this.isLastHireDateValide(dataArray);
    this.lastDepartDateValid = this.isLastDepartDateValide(dataArray);
  }

  sendDataToServer(){
    //this.service.addAll(this.dataArray).subscribe((data)=>{
      //this.dataFromServer = data;
      this.dataSentToServer=true;
      //this.updateData.emit(data);
      this.currentStep = 3;
    //});
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
      console.log('fichier: ',i, dataArray[i].birthCountry);
      console.log('country: ',i, this.listCodePays[i]+' ', this.listLibPays[i]);
      if(!this.listCodePays.includes(dataArray[i].birthCountry.toUpperCase())){
        isFound = false;
        this.codePaysFoundLine+=i;
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
}
