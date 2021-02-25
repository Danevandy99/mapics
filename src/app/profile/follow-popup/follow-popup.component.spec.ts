import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowPopupComponent } from './follow-popup.component';

describe('FollowPopupComponent', () => {
  let component: FollowPopupComponent;
  let fixture: ComponentFixture<FollowPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
