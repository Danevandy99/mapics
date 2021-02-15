import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeProfilePhotoPopupComponent } from './change-profile-photo-popup.component';

describe('ChangeProfilePhotoPopupComponent', () => {
  let component: ChangeProfilePhotoPopupComponent;
  let fixture: ComponentFixture<ChangeProfilePhotoPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeProfilePhotoPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeProfilePhotoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
