import { CellState } from '../enums/cell-state';

export class CellViewModel {
    state: CellState;

    constructor (state: CellState = CellState.Empty) {
        this.state = state;
    }
}
