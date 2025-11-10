import { TestBed } from '@angular/core/testing';

import { Handicap } from './handicap';

describe('Handicap', () => {
  let service: Handicap;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Handicap);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
