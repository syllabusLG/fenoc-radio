import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { THROW_IF_NOT_FOUND } from '@angular/core/src/di/injector';

@Component({
  selector: 'search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})
export class SearchInputComponent implements OnInit {
  @Output()clickSearch: EventEmitter<any> = new EventEmitter<any>();

  motCle: string = '';  
  constructor() { }

  ngOnInit() {
  }

  searchCallBack(){
    console.log("ok");
  }

  searchMotCle(){
    this.clickSearch.emit(this.motCle);
  }
}
