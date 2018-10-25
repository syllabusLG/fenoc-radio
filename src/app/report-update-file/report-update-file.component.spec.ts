import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportUpdateFileComponent } from './report-update-file.component';

describe('ReportUpdateFileComponent', () => {
  let component: ReportUpdateFileComponent;
  let fixture: ComponentFixture<ReportUpdateFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportUpdateFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportUpdateFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
