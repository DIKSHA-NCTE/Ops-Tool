import { TestBed } from '@angular/core/testing';

import { UsersBulkUploadService } from './users-bulk-upload.service';

describe('UsersBulkUploadService', () => {
  let service: UsersBulkUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersBulkUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
