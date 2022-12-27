import { TestBed } from '@angular/core/testing';

import { BroadcastContentUploadService } from './broadcast-content-upload.service';

describe('BroadcastContentUploadService', () => {
  let service: BroadcastContentUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BroadcastContentUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
