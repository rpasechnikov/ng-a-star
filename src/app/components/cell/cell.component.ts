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

  constructor() { }

  ngOnInit() {
  }

  onClick($event: MouseEvent): void {
    this.cellViewModel.setNextState();
  }

  /**Allows drawing of obstacles or clearing them on mouse down. Simply flips the ste */
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
