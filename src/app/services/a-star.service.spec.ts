import { TestBed } from '@angular/core/testing';

import { AStarService } from './a-star.service';

describe('AStarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AStarService = TestBed.get(AStarService);
    expect(service).toBeTruthy();
  });
});
