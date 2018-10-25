import { Component, OnInit } from '@angular/core';
import {ReportCreateFileService} from '../report-create-file/report.create.file.service';
import {ReportUpdateFileService} from '../report-update-file/report.update.file.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public createData = {
    labels: [],
    datasets:[]
  };

  public updateData = {
    labels: [],
    datasets:[]
  };
  constructor( private reportCreateFileService: ReportCreateFileService, private reportUpdateFileService: ReportUpdateFileService) { }

  ngOnInit() {

    const datasetsLinesCreated = {
      label: 'Nombre de lignes creés',
      data: [],
      backgroundColor: 'rgb(102, 255, 102, 0.2)',
      borderColor: 'rgb(102, 255, 102)'
    };

    const datasetsLinesRejected = {
      label: 'Nombre de lignes rejetés',
      data: [],
      backgroundColor: 'rgb(204, 0, 0, 0.2)',
      borderColor: 'rgb(255, 102, 102)'
    };

    const datasetsLinesUpdated = {
      label: 'Nombre de lignes mise à jour',
      data: [],
      backgroundColor: 'rgb(51, 51, 255, 0.2)',
      borderColor: 'rgb(51, 51, 255)'
    };

    this.reportCreateFileService.getAll().subscribe(list => list.forEach(elt =>{
      this.createData.labels.push(elt.module);
      datasetsLinesCreated.data.push(elt.nbreLinesCreated);
      datasetsLinesRejected.data.push(elt.nbreLinesRejected);
    }));

    this.createData.datasets.push(datasetsLinesCreated);
    this.createData.datasets.push(datasetsLinesRejected);

    this.reportUpdateFileService.getAll().subscribe(list => list.forEach(elt =>{
      this.updateData.labels.push(elt.module);
      datasetsLinesUpdated.data.push(elt.nbreLinesUpdated);
      datasetsLinesRejected.data.push(elt.nbreLinesRejected);
    }));

    this.updateData.datasets.push(datasetsLinesUpdated);
    this.updateData.datasets.push(datasetsLinesRejected);
  }

}
