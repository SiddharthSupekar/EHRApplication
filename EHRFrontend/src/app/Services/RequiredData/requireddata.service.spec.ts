import { TestBed } from '@angular/core/testing';

import { RequireddataService } from './requireddata.service';

describe('RequireddataService', () => {
  let service: RequireddataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequireddataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
