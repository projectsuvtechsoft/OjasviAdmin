import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OTPReportComponent } from './otpreport.component';

describe('OTPReportComponent', () => {
  let component: OTPReportComponent;
  let fixture: ComponentFixture<OTPReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OTPReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OTPReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
