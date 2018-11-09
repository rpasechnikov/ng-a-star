import { TestBed } from '@angular/core/testing';

import { AStarService } from './a-star.service';
import { Vector2 } from '../view-models/vector2';

describe('AStarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AStarService = TestBed.get(AStarService);
    expect(service).toBeTruthy();
  });

  it('should return false when initializing with a negative positive number', () => {
    const service: AStarService = TestBed.get(AStarService);
    expect(service.initializeGrid(-5)).toBeFalsy();
  });

  it('should return false when initializing with null', () => {
    const service: AStarService = TestBed.get(AStarService);
    expect(service.initializeGrid(null)).toBeFalsy();
  });

  it('should return false when initializing with undefined', () => {
    const service: AStarService = TestBed.get(AStarService);
    expect(service.initializeGrid(undefined)).toBeFalsy();
  });

  it('should return false when initializing with size 1', () => {
    const service: AStarService = TestBed.get(AStarService);
    expect(service.initializeGrid(1)).toBeFalsy();
  });

  it('should return true when initializing with size 2', () => {
    const service: AStarService = TestBed.get(AStarService);
    expect(service.initializeGrid(1)).toBeTruthy();
  });

  it('should return true when initializing with size 5', () => {
    const service: AStarService = TestBed.get(AStarService);
    expect(service.initializeGrid(5)).toBeTruthy();
  });

  it('should return true when initializing with size 25', () => {
    const service: AStarService = TestBed.get(AStarService);
    expect(service.initializeGrid(25)).toBeTruthy();
  });

  it('should return false when trying to find a path without grid view model being initialized', () => {
    const service: AStarService = TestBed.get(AStarService);
    expect(service.findPath()).toBeFalsy();
  });

  it('should return false when trying to find a path without start and target nodes specified', () => {
    const service: AStarService = TestBed.get(AStarService);
    service.initializeGrid(5);
    expect(service.findPath()).toBeFalsy();
  });

  it('should retrieve a valid node correctly', () => {
    const service: AStarService = TestBed.get(AStarService);
    service.initializeGrid(5);

    // X
    expect(service.getCellViewModel(0,0).location.x).toEqual(0);
    expect(service.getCellViewModel(0,4).location.x).toEqual(0);
    expect(service.getCellViewModel(4,0).location.x).toEqual(4);
    expect(service.getCellViewModel(4,4).location.x).toEqual(4);

    // Y
    expect(service.getCellViewModel(0,0).location.y).toEqual(0);
    expect(service.getCellViewModel(4,0).location.y).toEqual(0);
    expect(service.getCellViewModel(0,4).location.y).toEqual(4);
    expect(service.getCellViewModel(4,4).location.y).toEqual(4);
  });

  it('getCellViewModel should retrieve return null for invalid node', () => {
    const service: AStarService = TestBed.get(AStarService);
    service.initializeGrid(5);

    expect(service.getCellViewModel(-1, -1)).toBeFalsy();
    expect(service.getCellViewModel(100, 100)).toBeFalsy();
    expect(service.getCellViewModel(null, null)).toBeFalsy();
    expect(service.getCellViewModel(undefined, undefined)).toBeFalsy();
  });

  it('getCellViewModel should retrieve return null if grid is not initialized', () => {
    const service: AStarService = TestBed.get(AStarService);

    expect(service.getCellViewModel(-1, -1)).toBeFalsy();
    expect(service.getCellViewModel(100, 100)).toBeFalsy();
    expect(service.getCellViewModel(null, null)).toBeFalsy();
    expect(service.getCellViewModel(undefined, undefined)).toBeFalsy();
    expect(service.getCellViewModel(1, 1)).toBeFalsy();
  });

  it('getCellViewModelForLocation should retrieve return null for invalid node', () => {
    const service: AStarService = TestBed.get(AStarService);
    service.initializeGrid(5);

    expect(service.getCellViewModelForLocation(new Vector2(-1, -1))).toBeFalsy();
    expect(service.getCellViewModelForLocation(new Vector2(100, 100))).toBeFalsy();
    expect(service.getCellViewModelForLocation(new Vector2(null, null))).toBeFalsy();
    expect(service.getCellViewModelForLocation(new Vector2(undefined, undefined))).toBeFalsy();
  });

  it('getCellViewModelForLocation should retrieve return null if grid is not initialized', () => {
    const service: AStarService = TestBed.get(AStarService);

    expect(service.getCellViewModelForLocation(new Vector2(-1, -1))).toBeFalsy();
    expect(service.getCellViewModelForLocation(new Vector2(100, 100))).toBeFalsy();
    expect(service.getCellViewModelForLocation(new Vector2(null, null))).toBeFalsy();
    expect(service.getCellViewModelForLocation(new Vector2(undefined, undefined))).toBeFalsy();
    expect(service.getCellViewModelForLocation(new Vector2(1, 1))).toBeFalsy();
  });

  it('should set the starting node correctly', () => {
    const service: AStarService = TestBed.get(AStarService);
    service.initializeGrid(5);
    service.setStartingNode(service.getCellViewModel(0,0));
    expect(service.startingNode).toEqual(service.getCellViewModel(0,0));
  });

  it('should not set starting node if it has already been set', () => {
    const service: AStarService = TestBed.get(AStarService);
    service.initializeGrid(5);
    service.setStartingNode(service.getCellViewModel(0,0));
    expect(service.startingNode).toEqual(service.getCellViewModel(0,0));
    expect(service.setStartingNode(service.getCellViewModel(0,0))).toBeFalsy();
  });

  it('should set the target node correctly', () => {
    const service: AStarService = TestBed.get(AStarService);
    service.initializeGrid(5);
    service.setTargetNode(service.getCellViewModel(4,4));
    expect(service.targetNode).toEqual(service.getCellViewModel(4,4))
  });

  it('should not set target node if it has already been set', () => {
    const service: AStarService = TestBed.get(AStarService);
    service.initializeGrid(5);
    service.setTargetNode(service.getCellViewModel(4,4));
    expect(service.targetNode).toEqual(service.getCellViewModel(4,4));
    expect(service.setTargetNode(service.getCellViewModel(4,4))).toBeFalsy();
  });

  it('should set the target node correctly', () => {
    const service: AStarService = TestBed.get(AStarService);
    service.initializeGrid(5);
    service.setTargetNode(service.getCellViewModel(4,4));
    expect(service.startingNode).toEqual(service.getCellViewModel(4,4))
  });

  it('should return false when trying to find a path without start node specified', () => {
    const service: AStarService = TestBed.get(AStarService);
    service.initializeGrid(5);
    service.setTargetNode(service.getCellViewModel(4,4));
    expect(service.findPath()).toBeFalsy();
  });

  it('should return false when trying to find a path without target node specified', () => {
    const service: AStarService = TestBed.get(AStarService);
    service.initializeGrid(5);
    service.setStartingNode(service.getCellViewModel(0,0));
    expect(service.findPath()).toBeFalsy();
  });

  it('should return true when trying to find a path with a valid starting parameters', () => {
    const service: AStarService = TestBed.get(AStarService);
    service.initializeGrid(5);
    service.setStartingNode(service.getCellViewModel(0,0));
    service.setTargetNode(service.getCellViewModel(4,4));
    expect(service.findPath()).toBeTruthy();
  });
});
