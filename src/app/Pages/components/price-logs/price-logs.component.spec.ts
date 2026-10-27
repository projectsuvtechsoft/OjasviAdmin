import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceLogsComponent } from './price-logs.component';

describe('PriceLogsComponent', () => {
  let component: PriceLogsComponent;
  let fixture: ComponentFixture<PriceLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceLogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
