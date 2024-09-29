import { TestBed } from '@angular/core/testing';

import { FechamentosService } from './fechamentos.service';

describe('FechamentosService', () => {
  let service: FechamentosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FechamentosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
