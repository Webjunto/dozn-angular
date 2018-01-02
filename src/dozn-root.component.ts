import { Component, Renderer } from '@angular/core';

import { DoznService } from './dozn.service';

@Component({
  selector: 'app-root',
  template: `
  <h1>Dozn Angular</h1>
  `
})
export class DoznAppComponent {
  constructor(
    renderer: Renderer,
    private doznService: DoznService,
  ) {

    renderer.listenGlobal('document', 'click', (event: UIEvent) => {
      doznService.doznEvents.next(event);
    });

    renderer.listenGlobal('document', 'input', (event: UIEvent) => {
      doznService.doznEvents.next(event);
    });
  }
}
