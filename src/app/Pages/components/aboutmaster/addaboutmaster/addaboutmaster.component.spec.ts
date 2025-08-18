import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddaboutmasterComponent } from './addaboutmaster.component';

describe('AddaboutmasterComponent', () => {
  let component: AddaboutmasterComponent;
  let fixture: ComponentFixture<AddaboutmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddaboutmasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddaboutmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
