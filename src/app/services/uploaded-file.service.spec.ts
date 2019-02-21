import { TestBed } from '@angular/core/testing';

import { UploadedFileService } from './uploaded-file.service';

describe('UploadedFileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UploadedFileService = TestBed.get(UploadedFileService);
    expect(service).toBeTruthy();
  });
});
