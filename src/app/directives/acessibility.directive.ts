import {
  AfterViewInit,
  ContentChildren,
  Directive,
  ElementRef,
  HostListener,
  QueryList,
} from '@angular/core';
import { TileComponent } from '../components/tile/tile.component';
import { interval, take } from 'rxjs';

@Directive({
  selector: '[acessibility]',
  standalone: true,
})
export class AcessibilityDirective implements AfterViewInit {
  @ContentChildren(TileComponent, { read: ElementRef })
  public tiles: QueryList<ElementRef>;

  firstItemIndexes: number[];

  ngAfterViewInit(): void {
    this.firstItemIndexes = this.getColumnFirstItemsIndexes();
  }

  @HostListener('keydown.tab', ['$event'])
  onKeyDownTab(e: KeyboardEvent) {
    const tileIndex = this.getElementIndexFromEvent(e);

    if (this.isInLastColumn(tileIndex)) {
      this.focusOutsideOfLayout();
      return;
    }

    e.preventDefault();
    this.focusOnNextColumn(tileIndex);
  }

  @HostListener('keydown.shift.tab', ['$event'])
  onKeyDownShiftTab(e: KeyboardEvent) {
    const tileIndex = this.getElementIndexFromEvent(e);

    if (this.isInFirstColumn(tileIndex)) {
      this.focusOutsideOfLayout();
      return;
    }

    e.preventDefault();
    this.focusOnPreviousColumn(tileIndex);
  }

  @HostListener('keydown.arrowup', ['$event'])
  onKeyDownArrowUp(e: KeyboardEvent) {
    e.preventDefault();

    const tileIndex = this.getElementIndexFromEvent(e);
    this.navigateUpThroughColumn(tileIndex);
  }

  @HostListener('keydown.arrowdown', ['$event'])
  onKeyDownArrowDown(e: KeyboardEvent) {
    e.preventDefault();

    const tileIndex = this.getElementIndexFromEvent(e);
    this.navigateDownThroughColumn(tileIndex);
  }

  private navigateDownThroughColumn(index: number) {
    const currentColumnIndex = this.getCurrentColumnIndex(index);
    const firstElementIndex = this.firstItemIndexes[currentColumnIndex];
    const lastElementIndex = this.isInLastColumn(index)
      ? this.tiles.length - 1
      : this.firstItemIndexes[currentColumnIndex + 1] - 1;

    const nextElementIndex =
      index === lastElementIndex ? firstElementIndex : index + 1;
    this.focusTileWithIndex(nextElementIndex);
  }

  private navigateUpThroughColumn(index: number) {
    const currentColumnIndex = this.getCurrentColumnIndex(index);
    const firstElementIndex = this.firstItemIndexes[currentColumnIndex];
    const lastElementIndex = this.isInLastColumn(index)
      ? this.tiles.length - 1
      : this.firstItemIndexes[currentColumnIndex + 1] - 1;

    const nextElementIndex =
      index === firstElementIndex ? lastElementIndex : index - 1;
    this.focusTileWithIndex(nextElementIndex);
  }

  private focusOutsideOfLayout() {
    this.tiles.forEach((tile) => {
      tile.nativeElement.attributes['tabindex'].value = -1;
    });

    interval(10)
      .pipe(take(1))
      .subscribe(() => {
        this.tiles.forEach((tile) => {
          tile.nativeElement.attributes['tabindex'].value = 0;
        });
      });
  }

  private focusTileWithIndex(index: number) {
    const el = this.tiles.find(
      (tile: ElementRef) =>
        tile.nativeElement.attributes['data-index'].value === index + ''
    );
    el?.nativeElement.focus();
  }

  private getCurrentColumnIndex(tileIndex: number): number {
    if (tileIndex >= this.firstItemIndexes[this.firstItemIndexes.length - 1]) {
      return this.firstItemIndexes.length - 1;
    }

    let currentColumnIndex = 0;
    for (let i = 0; i < this.firstItemIndexes.length - 1; i++) {
      if (this.firstItemIndexes[i + 1] > tileIndex) {
        currentColumnIndex = i;
        break;
      }
    }

    return currentColumnIndex;
  }

  private focusOnPreviousColumn(tileIndex: number) {
    const currentColumnIndex = this.getCurrentColumnIndex(tileIndex);
    this.focusTileWithIndex(this.firstItemIndexes[currentColumnIndex] - 1);
  }

  private focusOnNextColumn(tileIndex: number) {
    const currentColumnIndex = this.getCurrentColumnIndex(tileIndex);
    this.focusTileWithIndex(this.firstItemIndexes[currentColumnIndex + 1]);
  }

  private isInFirstColumn(tileIndex: number) {
    if (this.firstItemIndexes.length === 1) {
      return true;
    }
    return tileIndex < this.firstItemIndexes[1];
  }

  private isInLastColumn(tileIndex: number): boolean {
    if (this.firstItemIndexes.length === 1) {
      return true;
    }

    const lastColumnFirstItemIndex =
      this.firstItemIndexes[this.firstItemIndexes.length - 1];
    return tileIndex >= lastColumnFirstItemIndex;
  }

  private getColumnFirstItemsIndexes() {
    return this.tiles
      .filter((tile) => tile.nativeElement.offsetTop === 0)
      .map((tile) => Number(tile.nativeElement.attributes['data-index'].value));
  }

  private getElementIndexFromEvent(event: KeyboardEvent): number {
    const index = (event.target as any).attributes['data-index'].value;
    return Number(index);
  }
}
