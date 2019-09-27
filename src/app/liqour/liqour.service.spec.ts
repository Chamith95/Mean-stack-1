import { TestBed } from '@angular/core/testing';

import { LiqourService } from './liqour.service';

describe('LiqourService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LiqourService = TestBed.get(LiqourService);
    expect(service).toBeTruthy();
  });
});
