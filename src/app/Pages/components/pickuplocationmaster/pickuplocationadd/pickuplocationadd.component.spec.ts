import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickuplocationaddComponent } from './pickuplocationadd.component';

describe('PickuplocationaddComponent', () => {
  let component: PickuplocationaddComponent;
  let fixture: ComponentFixture<PickuplocationaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickuplocationaddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickuplocationaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
