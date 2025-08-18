import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAddressMasterComponent } from './list-address-master.component';

describe('ListAddressMasterComponent', () => {
  let component: ListAddressMasterComponent;
  let fixture: ComponentFixture<ListAddressMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAddressMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAddressMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
