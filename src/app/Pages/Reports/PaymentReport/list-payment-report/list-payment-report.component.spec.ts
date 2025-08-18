import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPaymentReportComponent } from './list-payment-report.component';

describe('ListPaymentReportComponent', () => {
  let component: ListPaymentReportComponent;
  let fixture: ComponentFixture<ListPaymentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPaymentReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPaymentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
