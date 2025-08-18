import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsitebannerlistComponent } from './websitebannerlist.component';

describe('WebsitebannerlistComponent', () => {
  let component: WebsitebannerlistComponent;
  let fixture: ComponentFixture<WebsitebannerlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebsitebannerlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsitebannerlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
