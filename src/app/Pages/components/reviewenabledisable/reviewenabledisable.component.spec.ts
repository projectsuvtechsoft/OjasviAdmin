import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewenabledisableComponent } from './reviewenabledisable.component';

describe('ReviewenabledisableComponent', () => {
  let component: ReviewenabledisableComponent;
  let fixture: ComponentFixture<ReviewenabledisableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewenabledisableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewenabledisableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
