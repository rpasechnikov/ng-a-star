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

  /**Left mouse button number in MouseEvent.buttons property */
  private MOUSE_BUTTON_LEFT = 1;

  constructor(private aStarService: AStarService) { }

  ngOnInit() {
  }

  /**Toggles clickable cell state (empty, obstacle, start or target) */
  onClick(): void {
    this.cellViewModel.setNextState();

    if (this.cellViewModel.state === CellState.Start) {
      this.aStarService.setStartingNode(this.cellViewModel);
    } else if (this.cellViewModel.state === CellState.End) {
      this.aStarService.setTargetNode(this.cellViewModel);
    }
  }

  /**Allows drawing of obstacles or clearing them on mouse down. Simply flips the state as follows:
   * empty -> obstacle
   * non-empty -> empty
   */
  mouseOver($event: MouseEvent): void {
    if ($event.buttons === this.MOUSE_BUTTON_LEFT) {
      if (this.cellViewModel.state === CellState.Empty) {
        this.cellViewModel.setState(CellState.Obstacle);
      } else {
        this.cellViewModel.setState(CellState.Empty);
      }
    }
  }
}
