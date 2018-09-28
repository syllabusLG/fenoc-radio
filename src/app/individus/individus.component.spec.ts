import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividusComponent } from './individus.component';

describe('IndividusComponent', () => {
  let component: IndividusComponent;
  let fixture: ComponentFixture<IndividusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
