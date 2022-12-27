import { TestBed } from '@angular/core/testing';

import { SelfSignupUsersService } from './self-signup-users.service';

describe('SelfSignupUsersService', () => {
  let service: SelfSignupUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelfSignupUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
