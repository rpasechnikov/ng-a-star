import { Component } from '@angular/core';
import { GridViewModel } from './view-models/grid-view-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  gridVm = new GridViewModel(20);
}
