import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadedFileService {

  constructor() { }
  private uploadedfile = new BehaviorSubject(false);
  currentuploadedfile = this.uploadedfile.asObservable();

  changeIsFileIsUploaded(isUploaded: boolean) {
    this.uploadedfile.next(isUploaded)
  }

}
