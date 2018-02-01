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
    user: '',
    feature: '',
    flow: ''
  };

  showDialog: boolean = false;

  constructor(
    renderer: Renderer,
    router: Router,
    private _dozn: DoznService,
    private http: Http
  ) {

    renderer.listenGlobal('document', 'click', (event: UIEvent) => {
      if (_dozn.sessionId) {
        _dozn.doznEvents.next(event);
       }
    });

    renderer.listenGlobal('document', 'input', (event: UIEvent) => {
      if (_dozn.sessionId) {
        _dozn.doznEvents.next(event);
       }
    });

    router.events.subscribe((_: NavigationEnd) => {
      if (_.url) {
        const url = _.url.replace('/', '');
        const element = router.config.filter(e => e.path === url)[0];
        if (element) {
          _dozn.currentViewName = element.component.name;
        } else {
          _dozn.currentViewName = 'Route not found';
        }
      }
    });
  }

  onSelect(event) {
    this.data[event.type] = event.item.id;
  }

  onCreate(event) {
    if (event.type === 'feature') {
      this._dozn.createFeature(event.name)
      .subscribe(id => {
        this.data[event.type] = id;
      });
    } else if (event.type === 'flow') {
      this._dozn.createFlow(event.name, this.data.feature)
      .subscribe(id => {
        this.data[event.type] = id;
      });
    } else {
      return;
    }
  }

  onSubmit() {
    if (this.data.user && this.data.feature && this.data.flow) {
      this._dozn.startSession(this.data.user, this.data.feature, this.data.flow);
      this.showDialog = !this.showDialog;
    }
  }

  ngOnInit() {
    this.showDialog = !this.showDialog;
  }
}
