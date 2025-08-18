import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddingredientsComponent } from './addingredients.component';

describe('AddingredientsComponent', () => {
  let component: AddingredientsComponent;
  let fixture: ComponentFixture<AddingredientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddingredientsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddingredientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
