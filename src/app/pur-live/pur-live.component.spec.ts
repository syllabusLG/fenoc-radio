import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurLiveComponent } from './pur-live.component';

describe('PurLiveComponent', () => {
  let component: PurLiveComponent;
  let fixture: ComponentFixture<PurLiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurLiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
