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

    if (!this.aStarService.startingNode) {
      this.aStarService.setStartingNode(this.cellViewModel);
    } else if (!this.aStarService.targetNode) {
      this.aStarService.setTargetNode(this.cellViewModel);
    } else {
      this.aStarService.drawCurrentBrushOnCell(this.cellViewModel);
    }
  }

  /**Allows drawing of obstacles or clearing them on mouse down. Simply flips the state as follows:
   * empty -> obstacle
   * non-empty -> empty
   */
  mouseOver($event: MouseEvent): void {
    if ($event.buttons === this.MOUSE_BUTTON_LEFT) {
      this.aStarService.drawCurrentBrushOnCell(this.cellViewModel);
    }
  }
}
