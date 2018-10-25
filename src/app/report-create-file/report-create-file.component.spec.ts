import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCreateFileComponent } from './report-create-file.component';

describe('ReportCreateFileComponent', () => {
  let component: ReportCreateFileComponent;
  let fixture: ComponentFixture<ReportCreateFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportCreateFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportCreateFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
