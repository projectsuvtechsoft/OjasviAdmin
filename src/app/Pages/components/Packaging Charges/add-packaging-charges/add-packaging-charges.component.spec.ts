import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPackagingChargesComponent } from './add-packaging-charges.component';

describe('AddPackagingChargesComponent', () => {
  let component: AddPackagingChargesComponent;
  let fixture: ComponentFixture<AddPackagingChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPackagingChargesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPackagingChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
