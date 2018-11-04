import { Component, OnInit, Input } from '@angular/core';
import { CellComponent } from '../cell/cell.component';
import { GridViewModel } from 'src/app/view-models/grid-view-model';
import { CellViewModel } from 'src/app/view-models/cell-view-model';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  @Input() gridViewModel: GridViewModel;
  cellVms: CellViewModel[][] = [];

  constructor() { }

  ngOnInit() {
    for (let x = 0; x < this.gridViewModel.size; x++) {
      this.cellVms[x] = [];

      for (let y = 0; y < this.gridViewModel.size; y++) {
        this.cellVms[x][y] = new CellViewModel();
      }
    }
  }
}
