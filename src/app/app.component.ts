import { Component } from '@angular/core';
import { TileComponent } from './components/tile/tile.component';
import { AcessibilityDirective } from './directives/acessibility.directive';

const colours: string[] = [
  '#0081a7',
  '#00afb9',
  '#fdfcdc',
  '#fed9b7',
  '#f07167',
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TileComponent, AcessibilityDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  tiles: any[] = [];

  constructor() {
    this.generateTiles();
  }

  private generateTiles() {
    const min = 180;
    const max = 320;

    const tiles = [...Array(20).keys()];

    tiles.forEach((tile, index) => {
      const _tile = {
        number: tile,
        height: Math.floor(Math.random() * (max - min) + min),
        colour: colours[index % 5],
      };

      this.tiles.push(_tile);
    });
  }
}
