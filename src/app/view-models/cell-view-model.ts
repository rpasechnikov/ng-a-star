import { CellState } from '../enums/cell-state';

export class CellViewModel {

    /**Node state */
    state: CellState;

    /**Node colour - based on state */
    colour: string;

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

    constructor(x: number = 0, y: number = 0, state: CellState = CellState.Empty) {
        this.state = state;
        this.x = x;
        this.y = y;
    }

    /**Sets the next state - simply increments to next state or first state if last */
    setNextState(): CellState {
        this.setState(this.getNextState(this.state, true));
        return this.state;
    }

    /**Update colour and VM cell state
     * @param state to update to
     */
    setState(state: CellState): CellState {
        this.state = state;

        switch (state) {
            case CellState.Empty:
                this.colour = 'transparent';
                break;
            case CellState.Obstacle:
                this.colour = 'grey';
                break;
            case CellState.PossiblePath:
                this.colour = 'yellow';
                break;
            case CellState.ConfirmedPath:
                this.colour = 'blue';
                break;
            case CellState.Start:
                this.colour = 'green';
                break;
            case CellState.End:
                this.colour = 'red';
                break;
        }

        return this.state;
    }

    /**Gets next state - simply increments to next state or first state if last
    * @param state old state to update
    * @param onClick false by default, if true - will only allow Obstacle, Start and End states
    */
    private getNextState(state: CellState, onClick: boolean = false): CellState {
        // Go to next state if possible, otherwise loop to first
        do {
            if (state < CellState.End) {
                state++;
            } else {
                state = CellState.Empty;
            }
        } while (onClick && (state === CellState.PossiblePath || state === CellState.ConfirmedPath));

        return state;
    }
}
