import { Component, Renderer, OnInit, Input } from '@angular/core';
import {Router, NavigationEnd } from '@angular/router';

import { AngularFirestore } from 'angularfire2/firestore';

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
    private _af: AngularFirestore,
    private doznService: DoznService
  ) {

    this.features = this._af.collection('features').snapshotChanges().map(features => {
      return features.map(a => {
        const data = a.payload.doc.data();
        data.id = a.payload.doc.id;
        return data;
      });
    });

    this.flows = this._af.collection('flows').snapshotChanges().map(flows => {
      return flows.map(a => {
        const data = a.payload.doc.data();
        data.id = a.payload.doc.id;
        return data;
      });
    });

    renderer.listenGlobal('document', 'click', (event: UIEvent) => {
      if (doznService.flowSession) {
        doznService.doznEvents.next(event);
       }
    });

    renderer.listenGlobal('document', 'input', (event: UIEvent) => {
     if (doznService.flowSession) {
      doznService.doznEvents.next(event);
     }
    });

    router.events.subscribe((_: NavigationEnd) => {
      if (_.url) {
        const url = _.url.replace('/', '');
        const element = router.config.filter(e => e.path === url)[0];
        if (element) {
          doznService.currentViewName = element.component.name;
        } else {
          doznService.currentViewName = 'Route not found';
        }
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
