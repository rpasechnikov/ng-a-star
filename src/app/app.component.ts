import { Component, OnInit } from '@angular/core';
import { GridViewModel } from './view-models/grid-view-model';
import { AStarService } from './services/a-star.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private aStarService: AStarService) {}

  ngOnInit(): void {
    this.aStarService.initializeGrid(20);
  }
}
