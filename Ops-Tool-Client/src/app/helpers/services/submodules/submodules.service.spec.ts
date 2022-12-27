import { TestBed } from '@angular/core/testing';

import { SubmodulesService } from './submodules.service';

describe('SubmodulesService', () => {
  let service: SubmodulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubmodulesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
