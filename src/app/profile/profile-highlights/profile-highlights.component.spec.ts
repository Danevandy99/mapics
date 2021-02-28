import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileHighlightsComponent } from './profile-highlights.component';

describe('ProfileHighlightsComponent', () => {
  let component: ProfileHighlightsComponent;
  let fixture: ComponentFixture<ProfileHighlightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileHighlightsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileHighlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
