import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCustomerMasterComponent } from './list-customer-master.component';

describe('ListCustomerMasterComponent', () => {
  let component: ListCustomerMasterComponent;
  let fixture: ComponentFixture<ListCustomerMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCustomerMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCustomerMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
