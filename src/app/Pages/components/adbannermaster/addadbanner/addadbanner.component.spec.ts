import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddadbannerComponent } from './addadbanner.component';

describe('AddadbannerComponent', () => {
  let component: AddadbannerComponent;
  let fixture: ComponentFixture<AddadbannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddadbannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddadbannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
