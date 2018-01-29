import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-dialog',
  template: `
  <div [@dialog] *ngIf="visible" class="dialog">
    <ng-content></ng-content>
  </div>
  <div *ngIf="visible" class="overlay" (click)="close()"></div>
`,
styles: [
`
.overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.dialog {
  z-index: 1000;
  position: fixed;
  right: 0;
  left: 0;
  top: 20px;
  margin-right: auto;
  margin-left: auto;
  min-height: 200px;
  width: 90%;
  max-width: 520px;
  padding: 12px;
  box-shadow: 0 7px 8px -4px rgba(0, 0, 0, 0.2), 0 13px 19px 2px rgba(0, 0, 0, 0.14), 0 5px 24px 4px rgba(0, 0, 0, 0.12);
  background: #6c1d91; /* Old browsers */
  background: -moz-linear-gradient(top, #6c1d91 36%, #76588c 86%, #845496 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(top, #6c1d91 36%,#76588c 86%,#845496 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to bottom, #6c1d91 36%,#76588c 86%,#845496 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
}

@media (min-width: 768px) {
  .dialog {
    top: 40px;
  }
}

.dialog__close-btn {
  border: 0;
  background: none;
  color: #2d2d2d;
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 1.2em;
}

`
],
  animations: [
    trigger('dialog', [
      transition('void => *', [
        style({ transform: 'scale3d(.3, .3, .3)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
      ])
    ])
  ]
})
export class DialogComponent implements OnInit {
  @Input() closable = true;
  @Input() visible: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() { }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
