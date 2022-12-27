import { TestBed } from '@angular/core/testing';

import { ContentsBulkUploadService } from './contents-bulk-upload.service';

describe('ContentsBulkUploadService', () => {
  let service: ContentsBulkUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentsBulkUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
