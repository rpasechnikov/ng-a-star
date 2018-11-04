import { Component, OnInit, Input } from '@angular/core';
import { CellState } from 'src/app/enums/cell-state';
import { CellViewModel } from 'src/app/view-models/cell-view-model';
import { AStarService } from 'src/app/services/a-star.service';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit {

  @Input() cellViewModel: CellViewModel;
  colour: string;

  constructor(private aStarService: AStarService) { }

  ngOnInit() {
  }

  onClick($event: MouseEvent): void {
    this.setState(this.getNextState(this.cellViewModel.state, true));
  }

  /**Allows drawing of obstacles or clearing them on mouse down. Simply flips the ste */
  mouseOver($event: MouseEvent): void {
    if ($event.buttons === 1) {
      if (this.cellViewModel.state === CellState.Empty) {
        this.setState(CellState.Obstacle);
      } else {
        this.setState(CellState.Empty);
      }
    }
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

  /**Update colour and VM cell state
   * @param state to update to
   */
  private setState(state: CellState): void {
    this.cellViewModel.state = state;

    switch (state) {
      case CellState.Empty:
        this.colour = 'transparent';
        this.aStarService.clearNode(this.cellViewModel);
        break;
      case CellState.Obstacle:
        this.colour = 'grey';
        this.aStarService.setObstacleNode(this.cellViewModel);
        break;
      case CellState.PossiblePath:
        this.colour = 'yellow';
        break;
      case CellState.ConfirmedPath:
        this.colour = 'blue';
        break;
      case CellState.Start:
        this.colour = 'green';
        this.aStarService.setStartingNode(this.cellViewModel);
        break;
      case CellState.End:
        this.colour = 'red';
        this.aStarService.setTargetNode(this.cellViewModel);
        break;
    }
  }
}
