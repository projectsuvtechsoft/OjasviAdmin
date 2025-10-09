import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingandhandlingaddComponent } from './shippingandhandlingadd.component';

describe('ShippingandhandlingaddComponent', () => {
  let component: ShippingandhandlingaddComponent;
  let fixture: ComponentFixture<ShippingandhandlingaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippingandhandlingaddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingandhandlingaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
