import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailsReportComponent } from './customer-details-report.component';

describe('CustomerDetailsReportComponent', () => {
  let component: CustomerDetailsReportComponent;
  let fixture: ComponentFixture<CustomerDetailsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerDetailsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDetailsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
