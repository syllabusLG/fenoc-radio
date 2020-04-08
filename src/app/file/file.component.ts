import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataModel } from '../shared/data.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileModel } from '../shared/file.model';
import { FileService } from './file.service';
import { CanDeactivateGuard } from '../shared/crud/upload/can-deactivate-guard.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadedFileService } from '../common/services/uploaded-file.service';
import { ConfirmModalComponent } from '../common/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})


export class FileComponent implements OnInit, CanDeactivateGuard {
  @ViewChild('content') private content;
  isUploaded: boolean;

  canDeactivate(component: import("../shared/crud/upload/can-deactivate-guard.service").CanComponentDeactivate): boolean | import("rxjs").Observable<boolean> | Promise<boolean> {
    if (this.isUploaded) {
      return this.modalService.open(ConfirmModalComponent).result.then((result) => {
        if(result)  
          this.fileUploadedService.changeIsFileIsUploaded(false);
        return result;
      });
    } else {
      return true;
    }
  }

  files: File[];

  file: FileModel = new FileModel();

  filesModel: DataModel[];

  fileForm: FormGroup;
  constructor(public fileService: FileService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private fileUploadedService: UploadedFileService) { }

  ngOnInit() {
    this.fileForm = this.fb.group({
      company_CD: ['', Validators.required],
      employeeId: ['', Validators.required],
      lastName: '',
      firstName: ''
    });

    this.filesModel = [
      new DataModel('nui', 'NUI', 'string', false, []),
      new DataModel('company_CD', 'Code entreprise', 'string', false, []),
      new DataModel('employeeId', 'Matricule salarié', 'string', false, []),
      new DataModel('employeeStatus', 'Type Salarié', 'string', false, []),
      new DataModel('civility', 'Civilité', 'string', false, []),
      new DataModel('lastName', 'Nom de famille', 'string', false, []),
      new DataModel('firstName', 'Prénom', 'string', false, []),
    ]

    this.fileUploadedService.currentuploadedfile.subscribe(isUploaded => this.isUploaded = isUploaded);
  }
}
