import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSaleDetailsReportComponent } from './product-sale-details-report.component';

describe('ProductSaleDetailsReportComponent', () => {
  let component: ProductSaleDetailsReportComponent;
  let fixture: ComponentFixture<ProductSaleDetailsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSaleDetailsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSaleDetailsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
