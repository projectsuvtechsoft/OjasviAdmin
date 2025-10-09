import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingandhandlingComponent } from './shippingandhandling.component';

describe('ShippingandhandlingComponent', () => {
  let component: ShippingandhandlingComponent;
  let fixture: ComponentFixture<ShippingandhandlingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShippingandhandlingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingandhandlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
