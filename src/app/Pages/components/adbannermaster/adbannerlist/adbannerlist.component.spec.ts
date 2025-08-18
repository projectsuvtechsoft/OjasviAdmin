import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdbannerlistComponent } from './adbannerlist.component';

describe('AdbannerlistComponent', () => {
  let component: AdbannerlistComponent;
  let fixture: ComponentFixture<AdbannerlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdbannerlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdbannerlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
