import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPackagingChargesComponent } from './list-packaging-charges.component';

describe('ListPackagingChargesComponent', () => {
  let component: ListPackagingChargesComponent;
  let fixture: ComponentFixture<ListPackagingChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPackagingChargesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPackagingChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
