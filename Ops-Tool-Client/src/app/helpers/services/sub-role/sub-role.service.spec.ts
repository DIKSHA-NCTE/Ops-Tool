import { TestBed } from '@angular/core/testing';

import { SubRoleService } from './sub-role.service';

describe('SubRoleService', () => {
  let service: SubRoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubRoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
