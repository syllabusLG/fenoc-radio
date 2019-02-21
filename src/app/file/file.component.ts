import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataModel } from '../shared/data.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileModel } from '../shared/file.model';
import { FileService } from './file.service';
import { CanDeactivateGuard } from '../shared/crud/upload/can-deactivate-guard.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Content } from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.css']
})


export class FileComponent implements OnInit, CanDeactivateGuard {
  @ViewChild('content') private content;
  canDeactivate(component: import("../shared/crud/upload/can-deactivate-guard.service").CanComponentDeactivate): boolean | import("rxjs").Observable<boolean> | Promise<boolean> {
    if (confirm('Voulez-vous quitter')) {
      //this.open(this.content);
      return true;
    } else {
      return false;
    }
  }

  closeResult: string;
  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  files: File[];

  file: FileModel = new FileModel();

  filesModel: DataModel[];

  fileForm: FormGroup;
  constructor(private fileService: FileService, private fb: FormBuilder,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.fileForm = this.fb.group({
      company_CD: ['', Validators.required],
      employeeId: ['', Validators.required],
      lastName: '',
      firstName: ''
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
