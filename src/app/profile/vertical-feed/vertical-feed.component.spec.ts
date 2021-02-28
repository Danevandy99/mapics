import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalFeedComponent } from './vertical-feed.component';

describe('VerticalFeedComponent', () => {
  let component: VerticalFeedComponent;
  let fixture: ComponentFixture<VerticalFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerticalFeedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
