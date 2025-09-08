import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitsmappingComponent } from './benefitsmapping.component';

describe('BenefitsmappingComponent', () => {
  let component: BenefitsmappingComponent;
  let fixture: ComponentFixture<BenefitsmappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BenefitsmappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BenefitsmappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
