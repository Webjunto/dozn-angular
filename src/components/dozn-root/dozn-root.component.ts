import { Component, Renderer, OnInit, Input } from '@angular/core';
import {Router, NavigationEnd } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';

import { DoznService } from '../../dozn.service';

@Component({
  selector: 'app-dozn',
  templateUrl: 'dozn-root.component.html',
  styleUrls: ['dozn-root.component.css']
})
export class DoznAppComponent implements OnInit {
  showDialog = false;
  features;
  flows;

  constructor(
    renderer: Renderer,
    router: Router,
    private _af: AngularFireDatabase,
    private doznService: DoznService
  ) {

    this.features = this._af.list('features');
    this.flows = this._af.list('flows');

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

    router.events.subscribe((_: NavigationEnd) => {
      const url = _.url.replace('/', '');
      const element = router.config.filter(e => e.path === url)[0];
      if (element) {
        doznService.currentViewName = element.component.name;
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
