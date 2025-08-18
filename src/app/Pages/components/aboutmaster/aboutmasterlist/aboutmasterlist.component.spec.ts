import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutmasterlistComponent } from './aboutmasterlist.component';

describe('AboutmasterlistComponent', () => {
  let component: AboutmasterlistComponent;
  let fixture: ComponentFixture<AboutmasterlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutmasterlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutmasterlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
