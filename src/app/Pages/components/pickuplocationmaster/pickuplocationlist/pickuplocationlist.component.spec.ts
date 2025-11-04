import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickuplocationlistComponent } from './pickuplocationlist.component';

describe('PickuplocationlistComponent', () => {
  let component: PickuplocationlistComponent;
  let fixture: ComponentFixture<PickuplocationlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickuplocationlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickuplocationlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
