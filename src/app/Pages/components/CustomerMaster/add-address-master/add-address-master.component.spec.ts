import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAddressMasterComponent } from './add-address-master.component';

describe('AddAddressMasterComponent', () => {
  let component: AddAddressMasterComponent;
  let fixture: ComponentFixture<AddAddressMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAddressMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAddressMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
