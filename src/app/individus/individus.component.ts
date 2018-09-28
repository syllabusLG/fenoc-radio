import { Component, OnInit } from '@angular/core';
import {IndividusService} from './individus.service';

@Component({
  selector: 'app-individus',
  templateUrl: './individus.component.html',
  styleUrls: ['./individus.component.css']
})
export class IndividusComponent implements OnInit {

  constructor(private individusService: IndividusService) { }

  ngOnInit() {
  }

}
