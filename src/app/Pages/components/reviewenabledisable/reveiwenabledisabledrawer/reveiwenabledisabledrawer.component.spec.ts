import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReveiwenabledisabledrawerComponent } from './reveiwenabledisabledrawer.component';

describe('ReveiwenabledisabledrawerComponent', () => {
  let component: ReveiwenabledisabledrawerComponent;
  let fixture: ComponentFixture<ReveiwenabledisabledrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReveiwenabledisabledrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReveiwenabledisabledrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
