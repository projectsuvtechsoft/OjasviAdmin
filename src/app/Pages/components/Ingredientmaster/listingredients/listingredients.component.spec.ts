import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingredientsComponent } from './listingredients.component';

describe('ListingredientsComponent', () => {
  let component: ListingredientsComponent;
  let fixture: ComponentFixture<ListingredientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListingredientsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListingredientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
