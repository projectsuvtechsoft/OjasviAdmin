import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsubscribersComponent } from './newsubscribers.component';

describe('NewsubscribersComponent', () => {
  let component: NewsubscribersComponent;
  let fixture: ComponentFixture<NewsubscribersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsubscribersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsubscribersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
