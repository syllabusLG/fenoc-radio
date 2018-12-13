import { Component, OnInit } from '@angular/core';
import {DataModel} from '../shared/data.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FileModel} from '../shared/file.model';
import {FileService} from './file.service';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {

  files: File[];

  file: FileModel = new FileModel();

  filesModel: DataModel[];

  fileForm: FormGroup;
  constructor(private fileService: FileService, private  fb: FormBuilder) { }

  ngOnInit() {
    this.fileForm = this.fb.group({
      company_CD: ['', Validators.required],
      employeeId: ['', Validators.required],
      lastName: '',
      firstName:''
    });
    this.filesModel = [
      new DataModel('nui', 'Numero d\'identification unique', 'string', false, []),
      new DataModel('company_CD', 'Code entreprise', 'string', false, []),
      new DataModel('employeeId', 'Matricule salarié', 'string', false, []),
      new DataModel('employeeStatus', 'Type Salarié', 'string', false, []),
      new DataModel('civility', 'Civilité', 'string', false, []),
      new DataModel('lastName', 'Nom de famille', 'string', false, []),
      new DataModel('useName', 'Nom d\'usage', 'string', false, []),
      new DataModel('firstName', 'Prénom', 'string', false, []),
    ]
  }

}
