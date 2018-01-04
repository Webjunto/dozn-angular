import { Component, Renderer, OnInit, Input } from '@angular/core';

import { DoznService } from '../../dozn.service';

@Component({
  selector: 'app-dozn',
  templateUrl: 'dozn-root.component.html',
  styleUrls: ['dozn-root.component.css']
})
export class DoznAppComponent implements OnInit {
  showDialog = false;
  features = [
    {
      name: 'Feature A'
    },
    {
      name: 'Feature B'
    }
  ];

  flows = [
    {
      name: 'Flow A'
    },
    {
      name: 'Flow B'
    }
  ];

  constructor(
    renderer: Renderer,
    private doznService: DoznService
  ) {

    renderer.listenGlobal('document', 'click', (event: UIEvent) => {
      if (doznService.eventSession) {
        doznService.doznEvents.next(event);
       }
    });

    renderer.listenGlobal('document', 'input', (event: UIEvent) => {
     if (doznService.eventSession) {
      doznService.doznEvents.next(event);
     }
    });
  }

  ngOnInit() {
    this.showDialog = !this.showDialog;
  }

  onSubmit(form) {
    if (this.doznService && form) {
      this.doznService.startSession(form.form.controls.accessCode.value, form.form.controls.feature.value, form.form.controls.flow.value);
      this.showDialog = !this.showDialog;
    }
  }
}
