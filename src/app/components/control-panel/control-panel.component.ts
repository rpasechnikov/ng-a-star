import { Component, OnInit } from '@angular/core';
import { AStarService } from 'src/app/services/a-star.service';

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
}
