import { TestBed } from '@angular/core/testing';

import { SupportUsersServiceService } from './support-users-service.service';

describe('SupportUsersServiceService', () => {
  let service: SupportUsersServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupportUsersServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
