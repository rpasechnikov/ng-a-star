import { CellState } from '../enums/cell-state';

export class CellViewModel {
    state: CellState;
    x: number;
    y: number;

    constructor (x: number = 0, y: number = 0, state: CellState = CellState.Empty) {
        this.state = state;
        this.x = x;
        this.y = y;
    }
}
