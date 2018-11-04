import { CellState } from '../enums/cell-state';

export class CellViewModel {

    /**Node state */
    state: CellState;

    /**X-coordinate */
    x: number;

    /**Y-coordinate */
    y: number;

    /**Total cost of node (g + h) */
    f: number;

    /**Distance between this node and start node */
    g: number;

    /**Heuristic - estimated distance from current node to end node
     * Distance can be estimated by counting x and y difference between current node and end node,
     * then squaring the x and y and adding them together.
     *
     * X X X F
     * X X X X
     * S X X X
     * X X X X
     *
     * For the example above, start node (S) heuristic will be 3^2 + 2^2 = 13 (3 nodes accross and 2 nodes up),
     * its g will be teh same as h, because it is the starting node and its f will be the same as h as well,
     * as its g is 0
     */
    h: number;

    constructor (x: number = 0, y: number = 0, state: CellState = CellState.Empty) {
        this.state = state;
        this.x = x;
        this.y = y;
    }
}
