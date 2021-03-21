import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileVerticalFeedComponent } from './profile-vertical-feed.component';

describe('ProfileVerticalFeedComponent', () => {
  let component: ProfileVerticalFeedComponent;
  let fixture: ComponentFixture<ProfileVerticalFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileVerticalFeedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileVerticalFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
