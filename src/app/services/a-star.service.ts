import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CellViewModel } from '../view-models/cell-view-model';
import { GridViewModel } from '../view-models/grid-view-model';
import { CellState } from '../enums/cell-state';
import { Vector2 } from '../view-models/vector2';
import { PriorityQueue } from '../data-structures/priority-queue';
import { HashMap } from '../data-structures/hash-map';
import { Direction } from '../enums/direction';

/**A* implementation based on: https://www.redblobgames.com/pathfinding/a-star/introduction.html
 * Grid coordinates are in (x, y) format as follows:
 * [0,0] [1,0] [2,0]
 * [0,1] [1,1] [2,1]
 * [0,2] [1,2] [2,2]
 */
@Injectable({
  providedIn: 'root'
})
export class AStarService {

  private gridVm: GridViewModel;
  private cellVms: CellViewModel[][] = [];

  private _startingNode: CellViewModel;
  private _targetNode: CellViewModel;

  private allowDiagonalMovement = true;

  private visitedNodes: CellViewModel[] = [];

  constructor() { }

  get gridViewModel(): GridViewModel {
    return this.gridVm;
  }

  get cellViewModels(): CellViewModel[][] {
    return this.cellVms;
  }

  get startingNode(): CellViewModel {
    return this._startingNode;
  }

  get targetNode(): CellViewModel {
    return this._targetNode;
  }

  getCellViewModel(x: number, y: number): CellViewModel {
    return this.getCellViewModelForLocation(new Vector2(x, y));
  }

  /**Returns the cell VM by location specified
   * @returns valid cell VM or null if invalid location/not yet set-up grid
   */
  getCellViewModelForLocation(location: Vector2): CellViewModel {
    // If null/undefined location or not yet setup grid
    if (!location || !this.gridVm || !this.cellVms) {
      return null;
    }

    // X out of bounds
    if (!location.x || location.x < 0 || location.x > this.gridVm.size - 1) {
      return null;
    }

    // Y out of bounds
    if (!location.y || location.y < 0 || location.y > this.gridVm.size - 1) {
      return null;
    }

    return this.cellVms[location.x][location.y];
  }

  /**Initializes the grid to the size specified
   * @param size the size of grid to initialize (size x size nodes)
   * @returns true if initialized correctly, false if:
   * * size is null or undefined
   * * size is less than 2
   */
  initializeGrid(size: number): boolean {
    // Cannot initialize the grid without a valid, positive size larger than 2
    // (e.g. It has to be at least a 2x2 grid)
    if (!size || size < 2) {
      return false;
    }

    this.gridVm = new GridViewModel(size);

    for (let x = 0; x < this.gridVm.size; x++) {
      this.cellVms[x] = [];

      for (let y = 0; y < this.gridVm.size; y++) {
        this.cellVms[x][y] = new CellViewModel(new Vector2(x, y));
      }
    }

    return true;
  }

  /**Sets the starting node unless it has already been set
   * @param startingNode node to set as starting
   * @returns true if set successfully, false otherwise
   */
  setStartingNode(startingNode: CellViewModel): boolean {
    if (!this._startingNode) {
      this._startingNode = startingNode;
      return true;
    }

    return false;
  }

  /**Sets the target node unless it has already been set
   * @param targetNode node to set as starting
   * @returns true if set successfully, false otherwise
   */
  setTargetNode(targetNode: CellViewModel): boolean {
    if (!this._targetNode) {
      this._targetNode = targetNode;
      return true;
    }

    return false
  }

  /**Resets the grid to its starting state */
  reset(): void {
    for (let x = 0; x < this.gridVm.size; x++) {
      for (let y = 0; y < this.gridVm.size; y++) {
        this.cellVms[x][y].setState(CellState.Empty);
      }
    }

    this._startingNode = null;
    this._targetNode = null;
  }

  clear(): void {
    // let's clean up old results first
    this.visitedNodes.forEach(node => {
      if (node.state === CellState.ConfirmedPath) {
        node.setState(CellState.Empty);
      }
    });

    this.visitedNodes = [];
  }

  setAllowDiagonalMovement(value: boolean): void {
    this.allowDiagonalMovement = value;
  }

  /**Finds the shortest path between the starting node and target node using the A* algorithm
   * @returns true if path from starting node to target node found, false otherwise
   */
  findPath(): boolean {
    // Ensure that grid and cell VMs are initialized
    if (!this.gridVm || !this.cellViewModels) {
      return false;
    }

    this.clear();

    if (!this._startingNode || !this._targetNode) {
      console.log('Unable to find the shortest path unless both starting and target nodes have been defined');
      return false;
    }

    // List of nodes which we can move to next, picking the node with lowest cost
    const frontier = new PriorityQueue<CellViewModel>();

    // Tracks which node we moved on to, from which (e.g.: A -> B, B -> C, C -> D, etc...)
    const cameFrom = new HashMap<CellViewModel, CellViewModel>();

    // Tracks the cost to get to a specific node from the start
    const costSoFar = new HashMap<CellViewModel, number>();

    frontier.enqueue(this._startingNode, 0);
    cameFrom.add(this._startingNode, this._startingNode);
    costSoFar.add(this._startingNode, 0);
    this.visitedNodes.push(this._startingNode);

    // Repeat the following
    while (!frontier.empty) {

      // Open list node, with the lowest F
      const currentNode = frontier.pop();
      console.log(`Popped: ${currentNode.location.toString()}`);

      if (currentNode === this._targetNode) {
        return true;
      }

      if (currentNode.state !== CellState.Start) {
        currentNode.setState(CellState.ConfirmedPath);
      }

      const adjacentEightNodes = this.getAdjacentNodes(currentNode, this.allowDiagonalMovement);

      // For each of the 8 squares adjacent to this current square
      adjacentEightNodes.forEach(adjacentNode => {

        // Cannot walk through walls
        if (adjacentNode.state === CellState.Obstacle) {
          return;
        }

        // TODO: can add movement cost based on environment (e.g. forest, mountaints, etc)
        const movementCost = costSoFar.get(currentNode) + 1;

        if (!costSoFar.get(adjacentNode) || movementCost < costSoFar.get(adjacentNode)) {
          costSoFar.add(adjacentNode, movementCost);

          const priority = movementCost + this.getHeuristic(adjacentNode, this._targetNode);

          frontier.enqueue(adjacentNode, priority);
          this.visitedNodes.push(adjacentNode);
          cameFrom.add(adjacentNode, currentNode);
        }
      });
    }

    return false;
  }

  /**Gets the approximage distance between the two nodes as difference in X^2 plus difference in Y^2 added together.
   * This allows us to *estimate* the distance between two points on the grid, not taking into account any obstacles.
   * @param startNode snot to get distance from
   * @param targetNode node to get distance to
   * @returns the heuristic representing the estimated distance between two nodes
   */
  private getHeuristic(startNode: CellViewModel, targetNode: CellViewModel): number {
    const x = Math.abs(startNode.location.x - targetNode.location.x);
    const y = Math.abs(startNode.location.y - targetNode.location.y);

    return Math.pow(x, 2) + Math.pow(y, 2);
  }

  /**Gets 8 or 4 adjacent nodes, depending on whether diagonal movement is allowed
   * X represents current node
   * 0 represents adjacent nodes
   *
   * Number of adjacent nodes can be as little as 3 and as large as 8,
   * depending on current node location
   * @param currentNode node to get adjacent nodes for
   * @param allowDiagonalMovement whether diagonal movement is allowed or not
   * @returns collection of adjacent nodes - from 3 to 8, depending on currentNode location
   * and allowDiagonalMovement setting
   */
  private getAdjacentNodes(currentNode: CellViewModel, allowDiagonalMovement: boolean): CellViewModel[] {
    const currentX = currentNode.location.x;
    const currentY = currentNode.location.y;

    if (currentNode.location.x === 0) {
      // Left-most and top-most node
      // X 0
      // 0 0
      if (currentNode.location.y === 0) {
        if (allowDiagonalMovement) {
          return this.getNodesByLocations([
            new Vector2(currentX, currentY),
            new Vector2(currentX + 1, currentY),
            new Vector2(currentX, currentY + 1),
            new Vector2(currentX + 1, currentY + 1)]);
        } else {
          return this.getNodesByLocations([
            new Vector2(currentX, currentY),
            new Vector2(currentX + 1, currentY),
            new Vector2(currentX, currentY + 1)]);
        }
      } else if (currentNode.location.y === this.gridViewModel.size - 1) {
        // Left-most and bottom-most node
        // 0 0
        // x 0
        if (allowDiagonalMovement) {
          return this.getNodesByLocations([
            new Vector2(currentX, currentY - 1),
            new Vector2(currentX + 1, currentY - 1),
            new Vector2(currentX, currentY),
            new Vector2(currentX + 1, currentY)]);
        } else {
          return this.getNodesByLocations([
            new Vector2(currentX, currentY - 1),
            new Vector2(currentX, currentY),
            new Vector2(currentX + 1, currentY)]);
        }
      } else {
        // Left-most node somewhere in between top and bottom of the grid
        // 0 0
        // X 0
        // 0 0
        if (allowDiagonalMovement) {
          return this.getNodesByLocations([
            new Vector2(currentX, currentY - 1),
            new Vector2(currentX + 1, currentY - 1),
            new Vector2(currentX, currentY),
            new Vector2(currentX + 1, currentY),
            new Vector2(currentX, currentY + 1),
            new Vector2(currentX + 1, currentY + 1)]);
        } else {
          return this.getNodesByLocations([
            new Vector2(currentX, currentY - 1),
            new Vector2(currentX, currentY),
            new Vector2(currentX + 1, currentY),
            new Vector2(currentX, currentY + 1)]);
        }
      }
    } else if (currentNode.location.x === this.gridViewModel.size - 1) {
      // Right-most and top-most node
      // 0 X
      // 0 0
      if (currentNode.location.y === 0) {
        if (allowDiagonalMovement) {
          return this.getNodesByLocations([
            new Vector2(currentX - 1, currentY),
            new Vector2(currentX, currentY),
            new Vector2(currentX - 1, currentY + 1),
            new Vector2(currentX, currentY + 1)]);
        } else {
          return this.getNodesByLocations([
            new Vector2(currentX - 1, currentY),
            new Vector2(currentX, currentY),
            new Vector2(currentX, currentY + 1)]);
        }
      } else if (currentNode.location.y === this.gridViewModel.size - 1) {
        // Right-most and bottom-most node
        // 0 0
        // 0 X
        if (allowDiagonalMovement) {
          return this.getNodesByLocations([
            new Vector2(currentX - 1, currentY - 1),
            new Vector2(currentX, currentY - 1),
            new Vector2(currentX - 1, currentY),
            new Vector2(currentX, currentY)]);
        } else {
          return this.getNodesByLocations([
            new Vector2(currentX, currentY - 1),
            new Vector2(currentX - 1, currentY),
            new Vector2(currentX, currentY)]);
        }
      } else {
        // Right-most node somewhere in between top and bottom of the grid
        // 0 0
        // 0 X
        // 0 0
        if (allowDiagonalMovement) {
          return this.getNodesByLocations([
            new Vector2(currentX - 1, currentY - 1),
            new Vector2(currentX, currentY - 1),
            new Vector2(currentX - 1, currentY),
            new Vector2(currentX, currentY),
            new Vector2(currentX - 1, currentY + 1),
            new Vector2(currentX, currentY + 1)]);
        } else {
          return this.getNodesByLocations([
            new Vector2(currentX, currentY - 1),
            new Vector2(currentX - 1, currentY),
            new Vector2(currentX, currentY),
            new Vector2(currentX, currentY + 1)]);
        }
      }
    } else {
      // Node somewhere in the middle (horizontally) and top-most node
      // 0 X 0
      // 0 0 0
      if (currentNode.location.y === 0) {
        if (allowDiagonalMovement) {
          return this.getNodesByLocations([
            new Vector2(currentX - 1, currentY),
            new Vector2(currentX, currentY),
            new Vector2(currentX + 1, currentY),
            new Vector2(currentX - 1, currentY + 1),
            new Vector2(currentX, currentY + 1),
            new Vector2(currentX + 1, currentY + 1)]);
        } else {
          return this.getNodesByLocations([
            new Vector2(currentX - 1, currentY),
            new Vector2(currentX, currentY),
            new Vector2(currentX + 1, currentY),
            new Vector2(currentX, currentY + 1)]);
        }
      } else if (currentNode.location.y === this.gridViewModel.size - 1) {
        // Node somewhere in the middle (horizontally) and bottom-most node
        // 0 0 0
        // 0 X 0
        if (allowDiagonalMovement) {
          return this.getNodesByLocations([
            new Vector2(currentX - 1, currentY - 1),
            new Vector2(currentX, currentY - 1),
            new Vector2(currentX + 1, currentY - 1),
            new Vector2(currentX - 1, currentY),
            new Vector2(currentX, currentY),
            new Vector2(currentX + 1, currentY)]);
        } else {
          return this.getNodesByLocations([
            new Vector2(currentX, currentY - 1),
            new Vector2(currentX - 1, currentY),
            new Vector2(currentX, currentY),
            new Vector2(currentX + 1, currentY)]);
        }
      } else {
        // Node somewhere in the middle (horizontally) and somewhere in between top and bottom of the grid
        // 0 0 0
        // 0 X 0
        // 0 0 0
        if (allowDiagonalMovement) {
          return this.getNodesByLocations([
            new Vector2(currentX - 1, currentY - 1),
            new Vector2(currentX, currentY - 1),
            new Vector2(currentX + 1, currentY - 1),
            new Vector2(currentX - 1, currentY),
            new Vector2(currentX, currentY),
            new Vector2(currentX + 1, currentY),
            new Vector2(currentX - 1, currentY + 1),
            new Vector2(currentX, currentY + 1),
            new Vector2(currentX + 1, currentY + 1)]);
        } else {
          return this.getNodesByLocations([
            new Vector2(currentX, currentY - 1),
            new Vector2(currentX - 1, currentY),
            new Vector2(currentX, currentY),
            new Vector2(currentX + 1, currentY),
            new Vector2(currentX, currentY + 1)]);
        }
      }
    }
  }

  private getAdjacentNodeLocationsForDirection(
    direction: Direction,
    allowDiagonalMovement: boolean): Vector2[] {
    // ??
  }

  /**Gets a collection of nodes by their locations */
  private getNodesByLocations(locations: Vector2[]): CellViewModel[] {
    const nodes: CellViewModel[] = [];
    locations.forEach(location => nodes.push(this.cellViewModels[location.x][location.y]));
    return nodes;
  }
}
