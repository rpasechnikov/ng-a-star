import { Component, OnInit } from '@angular/core';
import { AStarService } from 'src/app/services/a-star.service';
import { CellState } from 'src/app/enums/cell-state';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit {

  constructor(private aStarService: AStarService) { }

  allowDiagonalMovement = true;

  setAllowDiagonalMovement(value: boolean) {
    this.allowDiagonalMovement = value;
    this.aStarService.setAllowDiagonalMovement(value);
  }

  ngOnInit() {
  }

  findPath(): void {
    this.aStarService.findPath();
  }

  reset(): void {
    this.aStarService.reset();
  }

  clear(): void {
    this.aStarService.clear();
  }

  setForestBrush(): void {
    this.aStarService.setCurrentBrush(CellState.Forest);
  }

  setRiverBrush(): void {
    this.aStarService.setCurrentBrush(CellState.Obstacle);
  }

  setRoadBrush(): void {
    this.aStarService.setCurrentBrush(CellState.Road);
  }

  setGrassBrush(): void {
    this.aStarService.setCurrentBrush(CellState.Empty);
  }
}
