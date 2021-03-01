import { TestBed } from '@angular/core/testing';

import { CurrentUserSettingsService } from './current-user-settings.service';

describe('CurrentUserSettingsService', () => {
  let service: CurrentUserSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrentUserSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
