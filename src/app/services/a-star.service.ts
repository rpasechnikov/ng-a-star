import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CellViewModel } from '../view-models/cell-view-model';
import { GridViewModel } from '../view-models/grid-view-model';

@Injectable({
  providedIn: 'root'
})
export class AStarService {

  private gridVm: GridViewModel;
  private cellVms: CellViewModel[][] = [];

  pathResult: Observable<CellViewModel>;

  constructor() { }

  get gridViewModel(): GridViewModel {
    return this.gridVm;
  }

  get cellViewModels(): CellViewModel[][] {
    return this.cellVms;
  }

  initializeGrid(size: number): void {
    this.gridVm = new GridViewModel(size);

    for (let x = 0; x < this.gridVm.size; x++) {
      this.cellVms[x] = [];

      for (let y = 0; y < this.gridVm.size; y++) {
        this.cellVms[x][y] = new CellViewModel(x, y);
      }
    }
  }

  findPath(): void {

  }
}
