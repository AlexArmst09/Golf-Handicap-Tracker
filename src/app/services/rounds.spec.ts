import { TestBed } from '@angular/core/testing';

import { Rounds } from './rounds';

describe('Rounds', () => {
  let service: Rounds;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Rounds);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
