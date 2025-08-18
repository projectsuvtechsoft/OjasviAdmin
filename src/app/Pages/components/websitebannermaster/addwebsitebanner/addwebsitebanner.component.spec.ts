import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddwebsitebannerComponent } from './addwebsitebanner.component';

describe('AddwebsitebannerComponent', () => {
  let component: AddwebsitebannerComponent;
  let fixture: ComponentFixture<AddwebsitebannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddwebsitebannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddwebsitebannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
