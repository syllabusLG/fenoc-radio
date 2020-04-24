import { Component, OnInit } from '@angular/core';
import {LimsService} from "./lims.service";
import {Sample} from "../shared/sample.model";
import { saveAs } from 'file-saver';
import {Check} from "../shared/check.model";
import {Redcapsample} from "../shared/redcapsample.module";

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

  constructor(private limsService: LimsService) { }

  ngOnInit() {
  }
  loadSamplesLIMS(){
    this.limsService.getSAmples(this.kittube, this.sstudyId)
      .subscribe(data => {
        this.limsSamples = data;
        this.loadSamplesREDCAP();
      }, error => {
        console.log(error);
      })
  }
  loadSamplesREDCAP(){
    this.limsService.getRedCapSamples(this.kittube, this.sstudyId)
      .subscribe(data=>{
        this.redcapSamples = data;
        console.log("redcap: "+this.redcapSamples)
        this.buildCheckDataArray(this.redcapSamples, this.limsSamples);
      }, error => {
        console.log(error);
      })
  }

  buildCheckDataArray(redcapSamples, limsSamples){

    for (let i=0; i < redcapSamples.length; i++){
      let check: Check = new Check();
      if(redcapSamples[i].sampleId === limsSamples[i].sampleId){
        check.sampleId = limsSamples[i].sampleId;
        check.sampleType = limsSamples[i].sampleTypeId;
        check.kidId = limsSamples[i].kitTube;
        check.studyID = limsSamples[i].sstudyId;
        check.createDT = limsSamples[i].createDT;
        check.receivedDT = limsSamples[i].receivedDT;
        check.sampleIdRedCap = redcapSamples[i].sampleId;
        check.kidIdRedCap = redcapSamples[i].kidId
        check.collectionDT = redcapSamples[i].sampleCollectDateTime;
        check.qc = "TRUE";
        this.checkDataArray.push(check);
      }else {
        check.sampleId = limsSamples[i].sampleId;
        check.sampleType = limsSamples[i].sampleTypeId;
        check.kidId = limsSamples[i].kitTube;
        check.studyID = limsSamples[i].sstudyId;
        check.createDT = limsSamples[i].createDT;
        check.receivedDT = limsSamples[i].receivedDT;
        check.sampleIdRedCap = "";
        check.kidIdRedCap = "";
        check.collectionDT = "";
        check.qc = "FALSE";
        this.checkDataArray.push(check);
        check.sampleId = "";
        check.sampleType = "";
        check.kidId = "";
        check.studyID = "";
        check.createDT = "";
        check.receivedDT = "";
        check.sampleIdRedCap = redcapSamples[i].sampleId;
        check.kidIdRedCap = redcapSamples[i].kidId
        check.collectionDT = redcapSamples[i].sampleCollectDateTime;
        check.qc = "FALSE";
        this.checkDataArray.push(check);
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

}
