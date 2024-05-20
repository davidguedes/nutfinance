import { TestBed } from '@angular/core/testing';

import { FixasService } from './fixas.service';

describe('FixasService', () => {
  let service: FixasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FixasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
