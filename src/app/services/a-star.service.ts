import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CellViewModel } from '../view-models/cell-view-model';
import { GridViewModel } from '../view-models/grid-view-model';
import { CellState } from '../enums/cell-state';
import { Vector2 } from '../view-models/vector2';
import { PriorityQueue } from '../data-structures/priority-queue';
import { HashMap } from '../data-structures/hash-map';

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

  private startingNode: CellViewModel;
  private targetNode: CellViewModel;

  private allowDiagonalMovement = true;

  private visitedNodes: CellViewModel[] = [];

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
        this.cellVms[x][y] = new CellViewModel(new Vector2(x, y));
      }
    }
  }

  /**Sets the starting node unless it has already been set */
  setStartingNode(startingNode: CellViewModel): void {
    if (!this.startingNode) {
      this.startingNode = startingNode;
    }
  }

  /**Sets the target node unless it has already been set */
  setTargetNode(targetNode: CellViewModel): void {
    if (!this.targetNode) {
      this.targetNode = targetNode;
    }
  }

  /**Resets the grid to its starting state */
  reset(): void {
    for (let x = 0; x < this.gridVm.size; x++) {
      for (let y = 0; y < this.gridVm.size; y++) {
        this.cellVms[x][y].setState(CellState.Empty);
      }
    }

    this.startingNode = null;
    this.targetNode = null;
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

  /**Finds the shortest path between the starting node and target node using the A* algorithm */
  findPath(): void {
    this.clear();

    if (!this.startingNode || !this.targetNode) {
      console.log('Unable to find the shortest path unless both starting and target nodes have been defined');
      return;
    }

    // List of nodes which we can move to next, picking the node with lowest cost
    const frontier = new PriorityQueue<CellViewModel>();

    // Tracks which node we moved on to, from which (e.g.: A -> B, B -> C, C -> D, etc...)
    const cameFrom = new HashMap<CellViewModel, CellViewModel>();

    // Tracks the cost to get to a specific node from the start
    const costSoFar = new HashMap<CellViewModel, number>();

    frontier.enqueue(this.startingNode, 0);
    cameFrom.add(this.startingNode, this.startingNode);
    costSoFar.add(this.startingNode, 0);
    this.visitedNodes.push(this.startingNode);

    // Repeat the following
    while (!frontier.empty) {

      // Open list node, with the lowest F
      const currentNode = frontier.pop();
      console.log(`Popped: ${currentNode.location.toString()}`);

      if (currentNode === this.targetNode) {
        return;
      }

      if (currentNode.state !== CellState.Start) {
        currentNode.setState(CellState.ConfirmedPath);
      }

      const adjacentEightNodes = this.getAdjacentEightNodes(currentNode, this.allowDiagonalMovement);

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

          const priority = movementCost + this.getHeuristic(adjacentNode, this.targetNode);

          frontier.enqueue(adjacentNode, priority);
          this.visitedNodes.push(adjacentNode);
          cameFrom.add(adjacentNode, currentNode);
        }
      });
    }
  }

  /**Gets the approximage distance between the two nodes as difference in X^2 plus difference in Y^2 added together */
  private getHeuristic(startNode: CellViewModel, targetNode: CellViewModel) {
    const x = Math.abs(startNode.location.x - targetNode.location.x);
    const y = Math.abs(startNode.location.y - targetNode.location.y);

    return Math.pow(x, 2) + Math.pow(y, 2);
  }

  /**Gets adjacent 8 nodes
   * X represents current node
   * 0 represents adjacent nodes
   *
   * Number of adjacent nodes can be as little as 3 and as large as 8,
   * depending on current node location
   */
  private getAdjacentEightNodes(currentNode: CellViewModel, allowDiagonalMovement: boolean): CellViewModel[] {
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

  /**Gets a collection of nodes by their locations */
  private getNodesByLocations(locations: Vector2[]): CellViewModel[] {
    const nodes: CellViewModel[] = [];
    locations.forEach(location => nodes.push(this.cellViewModels[location.x][location.y]));
    return nodes;
  }
}
