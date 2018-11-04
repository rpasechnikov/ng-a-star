import { Component, OnInit, Input } from '@angular/core';
import { CellState } from 'src/app/enums/cell-state';
import { CellViewModel } from 'src/app/view-models/cell-view-model';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit {

  @Input() cellViewModel: CellViewModel;
  colour: string;

  constructor() { }

  ngOnInit() {
  }

  updateState(state: CellState): void {

    // Go to next state if possible, otherwise loop toe first
    if (state < CellState.End) {
      state++;
    } else {
      state = CellState.Empty;
    }

    this.cellViewModel.state = state;

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
  }

  onClick($event): void {
    this.updateState(this.cellViewModel.state);
  }
}
