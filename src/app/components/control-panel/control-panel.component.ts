import { Component, OnInit } from '@angular/core';
import { AStarService } from 'src/app/services/a-star.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent implements OnInit {

  constructor(private aStarService: AStarService) { }

  ngOnInit() {
  }

  findPath(): void {
    this.aStarService.findPath();
  }

  reset(): void {
    this.aStarService.reset();
  }
}
