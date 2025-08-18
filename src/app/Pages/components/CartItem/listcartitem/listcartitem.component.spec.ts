import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListcartitemComponent } from './listcartitem.component';

describe('ListcartitemComponent', () => {
  let component: ListcartitemComponent;
  let fixture: ComponentFixture<ListcartitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListcartitemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListcartitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
