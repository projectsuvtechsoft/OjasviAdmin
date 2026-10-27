import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteReviewsComponent } from './website-reviews.component';

describe('WebsiteReviewsComponent', () => {
  let component: WebsiteReviewsComponent;
  let fixture: ComponentFixture<WebsiteReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebsiteReviewsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebsiteReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
