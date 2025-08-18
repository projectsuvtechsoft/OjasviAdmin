import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsercontactComponent } from './usercontact.component';

describe('UsercontactComponent', () => {
  let component: UsercontactComponent;
  let fixture: ComponentFixture<UsercontactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsercontactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsercontactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
