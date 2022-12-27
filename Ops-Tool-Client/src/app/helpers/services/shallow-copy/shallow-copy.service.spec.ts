import { TestBed } from '@angular/core/testing';

import { ShallowCopyService } from './shallow-copy.service';

describe('ShallowCopyService', () => {
  let service: ShallowCopyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShallowCopyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
