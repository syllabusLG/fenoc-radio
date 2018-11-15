import {AfterViewChecked, Component, Input, ViewChild} from '@angular/core';
import {ChartComponent} from 'angular2-chartjs';

@Component({
  selector: 'app-my-chart',
  templateUrl: './my-chart.component.html',
  styleUrls: ['./my-chart.component.css']
})
export class MyChartComponent implements AfterViewChecked {

  @ViewChild('graphElement')
  private graphElement: ChartComponent;
  @Input()
  type:string = 'bar';
  @Input()
  title:string  = 'Titre';
  @Input()
  data = {
    labels: [],
    datasets: [
      {
        label: "My dataset 1",
        data: []
      },
      {
        label: "My dataset 2",
        data: []
      }
    ]
  };
  @Input()
  options = {
    responsive: true,
    maintainAspectRatio: false
  };
  constructor() { }

  ngAfterViewChecked() {
    this.graphElement.chart.update();
  }

}
