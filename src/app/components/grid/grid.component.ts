import { Component, OnInit, Input } from '@angular/core';
import { CellComponent } from '../cell/cell.component';
import { GridViewModel } from 'src/app/view-models/grid-view-model';
import { CellViewModel } from 'src/app/view-models/cell-view-model';
import { AStarService } from 'src/app/services/a-star.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  cellVms: CellViewModel[][];

  constructor(private aStarService: AStarService) { }

  ngOnInit() {
    this.init();
  }

  private init() {
    console.log('console');

    this.cellVms = this.aStarService.cellViewModels;
  }
}
