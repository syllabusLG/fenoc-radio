import { Component, OnInit } from '@angular/core';
import {LimsService} from "./lims.service";
import { saveAs } from 'file-saver';
import {Check} from "../model/check.model";
import {Redcapsample} from "../model/redcapsample.model";

@Component({
  selector: 'app-lims',
  templateUrl: './lims.component.html',
  styleUrls: ['./lims.component.css']
})
export class LimsComponent implements OnInit {

  public checkDataArray: Check[] = [];
  kittube:string='';
  sstudyId:string='';
  public limsSamples: any;
  public redcapSamples: Redcapsample[] = [];
  p:number=1;
  sampleType:string='';
  search:string='';
  dateSample: any;

  constructor(private limsService: LimsService) { }

  ngOnInit() {
  }

  callSample(){
    if(this.dateSample === undefined){
      this.loadSamplesLIMS();
    }else {
      this.loadSamplesLIMSDate();
    }
  }
  loadSamplesLIMS(){
    this.limsService.getLimsSamples(this.kittube, this.sstudyId, this.sampleType, this.search)
      .subscribe(data => {
        this.limsSamples = data;
        this.loadSamplesREDCAP();
      }, error => {
        console.log(error);
      })
  }
  loadSamplesLIMSDate(){
    let dateLims = this.fillDate(this.dateSample);
    this.limsService.getLimsSampleDate(dateLims, this.kittube, this.sstudyId, this.sampleType, this.search)
      .subscribe(data => {
        this.limsSamples = data;
        this.loadSampleREDCAPDate();
      }, error => {
        console.log(error);
      })
  }
  loadSamplesREDCAP(){
    this.limsService.getRedCapSamples(this.kittube, this.sstudyId, this.sampleType, this.search)
      .subscribe(data=>{
        this.redcapSamples = data;
        console.log("redcap: "+this.redcapSamples);
        this.buildCheckDataArray(this.redcapSamples, this.limsSamples);
      }, error => {
        console.log(error);
      })
  }
  loadSampleREDCAPDate(){
    let dateRedcap = this.fillDate(this.dateSample);
    this.limsService.getRedCapSampleDate(dateRedcap, this.kittube, this.sstudyId, this.sampleType, this.search)
      .subscribe(data => {
        this.redcapSamples = data;
        this.buildCheckDataArray(this.redcapSamples, this.limsSamples);
      }, error => {
        console.log(error);
      })
  }

  buildCheckDataArray(redcapSamples, limsSamples){
    this.checkDataArray = [];
    for (let i=0; i < redcapSamples.length; i++){
      for (let j=0; i < limsSamples.length; i++){
        let check: Check = new Check();
        if((redcapSamples[i].sampleId === limsSamples[j].sampleId) && (redcapSamples[i].kidId === limsSamples[j].kitTube)){
          check.sampleId = limsSamples[j].sampleId;
          check.sampleType = limsSamples[j].sampleTypeId;
          check.kidId = limsSamples[j].kitTube;
          check.studyID = limsSamples[j].sstudyId;
          check.createDT = limsSamples[j].createDT;
          check.receivedDT = limsSamples[j].receivedDT;
          check.sampleIdRedCap = redcapSamples[i].sampleId;
          check.kidIdRedCap = redcapSamples[i].kidId;
          check.collectionDT = redcapSamples[i].sampleCollectDateTime;
          check.qc = "TRUE";
          this.checkDataArray.push(check);
        }else {
          check.sampleId = limsSamples[j].sampleId;
          check.sampleType = limsSamples[j].sampleTypeId;
          check.kidId = limsSamples[j].kitTube;
          check.studyID = limsSamples[j].sstudyId;
          check.createDT = limsSamples[j].createDT;
          check.receivedDT = limsSamples[j].receivedDT;
          check.sampleIdRedCap = "";
          check.kidIdRedCap =  ""
          check.collectionDT = "";
          check.qc = "FALSE";
          check.sampleId = "";
          check.sampleType = "";
          check.kidId = "";
          check.studyID = "";
          check.createDT = "";
          check.receivedDT = "";
          check.sampleIdRedCap = redcapSamples[i].sampleId;
          check.kidIdRedCap = redcapSamples[i].kidId;
          check.collectionDT = redcapSamples[i].sampleCollectDateTime;
          check.qc = "FALSE";
          this.checkDataArray.push(check);
        }
      }

    }
    console.log(this.checkDataArray);
  }
  downloadFile(data: any) {
    let file = 'QC_Check_' + new Date() + '.csv';
    //this.cookieService.set('individuReportCSV', file);
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'));
    csv.unshift(header.join(';'));
    let csvArray = csv.join('\r\n');
    var blob = new Blob([csvArray], {type: 'text/csv'})
    saveAs(blob, file);
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
      return day + '/' + month + '/' + year
    }
  }

}
