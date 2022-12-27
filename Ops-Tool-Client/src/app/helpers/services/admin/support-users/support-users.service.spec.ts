import { TestBed } from '@angular/core/testing';

import { SupportUsersService } from './support-users.service';

describe('SupportUsersService', () => {
  let service: SupportUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupportUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
