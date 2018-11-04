import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CellViewModel } from '../view-models/cell-view-model';
import { GridViewModel } from '../view-models/grid-view-model';
import { CellState } from '../enums/cell-state';

/**A* implementation based on: https://medium.com/@nicholas.w.swift/easy-a-star-pathfinding-7e6689c7f7b2 */
@Injectable({
  providedIn: 'root'
})
export class AStarService {

  private gridVm: GridViewModel;
  private cellVms: CellViewModel[][] = [];

  private startingNode: CellViewModel;
  private targetNode: CellViewModel;

  private openList: CellViewModel[];
  private closedList: CellViewModel[];

  pathResult: Observable<CellViewModel>;

  constructor() { }

  get gridViewModel(): GridViewModel {
    return this.gridVm;
  }

  get cellViewModels(): CellViewModel[][] {
    return this.cellVms;
  }

  initializeGrid(size: number): void {
    this.gridVm = new GridViewModel(size);

    for (let x = 0; x < this.gridVm.size; x++) {
      this.cellVms[x] = [];

      for (let y = 0; y < this.gridVm.size; y++) {
        this.cellVms[x][y] = new CellViewModel(x, y);
      }
    }
  }

  /**Sets the starting node */
  setStartingNode(startingNode: CellViewModel): void {
    this.startingNode = startingNode;
  }

  /**Sets the target node */
  setTargetNode(targetNode: CellViewModel): void {
    this.targetNode = targetNode;
  }

  /**Sets the node at coordinates specified as an obstacle */
  setObstacleNode(obstacleNode: CellViewModel): void {
    this.cellVms[obstacleNode.x][obstacleNode.y].state = CellState.Obstacle;
  }

  /**Clears the state of the target node (sets it to CellState.Empty)*/
  clearNode(obstacleNode: CellViewModel): void {
    this.cellVms[obstacleNode.x][obstacleNode.y].state = CellState.Empty;
  }

  /**Finds the shortest path between the starting node and target node using the A* algorithm */
  findPath(): void {
    if (!this.startingNode || !this.targetNode) {
      console.log('Unable to find the shortest path unless both starting and target nodes have been defined');
      return;
    }

    this.openList = [];
    this.closedList = [];
  }
}
