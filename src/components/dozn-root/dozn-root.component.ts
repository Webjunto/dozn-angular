import { Component, Renderer, OnInit, Input } from '@angular/core';
import {Router, NavigationEnd } from '@angular/router';
import { Http } from '@angular/http';

import { DoznService } from '../../dozn.service';
import {GET_COMPANY_USERS, GET_FEATURES,  GET_FLOWS} from '../../utils';

@Component({
  selector: 'app-dozn',
  templateUrl: 'dozn-root.component.html',
  styleUrls: ['dozn-root.component.css']
})
export class DoznAppComponent implements OnInit {
  data = {
    userProfiles: '',
    features: '',
    flows: ''
  };

  showDialog: boolean = false;

  constructor(
    renderer: Renderer,
    router: Router,
    private doznService: DoznService,
    private http: Http
  ) {

    renderer.listenGlobal('document', 'click', (event: UIEvent) => {
      if (doznService.sessionId) {
        doznService.doznEvents.next(event);
       }
    });

    renderer.listenGlobal('document', 'input', (event: UIEvent) => {
      if (doznService.sessionId) {
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

  onSelect(event) {
    this.data[event.type] = event.item.id;
  }

  onCreate(event) {
    if (event.type === 'features') {
      this.doznService.createFeature(event.name);
    } else if (event.type === 'flows') {
      this.doznService.createFlow(event.name, this.data.features);
    } else {
      return;
    }
  }

  onSubmit() {
    if (this.data.userProfiles && this.data.features && this.data.flows) {
      this.doznService.startSession(this.data.userProfiles, this.data.features, this.data.flows);
      this.showDialog = !this.showDialog;
    }
  }

  ngOnInit() {
    this.showDialog = !this.showDialog;
  }
}
