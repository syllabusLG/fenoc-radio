import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiscaliteComponent } from './fiscalite.component';

describe('FiscaliteComponent', () => {
  let component: FiscaliteComponent;
  let fixture: ComponentFixture<FiscaliteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiscaliteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiscaliteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
