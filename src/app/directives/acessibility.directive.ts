import {
  ContentChildren,
  Directive,
  ElementRef,
  HostListener,
  QueryList,
} from '@angular/core';
import { TileComponent } from '../components/tile/tile.component';

@Directive({
  selector: '[acessibility]',
  standalone: true,
})
export class AcessibilityDirective {
  @ContentChildren(TileComponent, { read: ElementRef })
  public tileComponents: QueryList<ElementRef>;

  @HostListener('keydown.shift.tab', ['$event'])
  onKeyDownShiftTab(e: KeyboardEvent) {
    console.log('shift tab event', e);
    console.log('shift and tab');
  }

  @HostListener('keydown.tab', ['$event'])
  onKeyDownTab(e: KeyboardEvent) {
    console.log(e);
    e.preventDefault();

    const currentIndexx = (e.target as any).attributes['data-index'].value;
    console.log(currentIndexx);

    const el = this.tileComponents.find(
      (tile: ElementRef) =>
        tile.nativeElement.attributes['data-index'].value === '6'
    );
    el?.nativeElement.focus();
  }

  @HostListener('keydown.arrowup', ['$event'])
  onKeyDownArrowUp(e: KeyboardEvent) {
    console.log('arrow up event', e);
    console.log('arrow up');
  }

  @HostListener('keydown.arrowdown', ['$event'])
  onKeyDownArrowDown(e: KeyboardEvent) {
    console.log('arrow down event', e);
    console.log('arrow down');
  }

  constructor() {}
}
