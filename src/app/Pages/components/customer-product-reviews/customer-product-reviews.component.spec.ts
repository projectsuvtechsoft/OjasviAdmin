import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerProductReviewsComponent } from './customer-product-reviews.component';

describe('CustomerProductReviewsComponent', () => {
  let component: CustomerProductReviewsComponent;
  let fixture: ComponentFixture<CustomerProductReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerProductReviewsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerProductReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
