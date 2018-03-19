import { Component, Renderer, OnInit, Input, NgZone } from '@angular/core';
import {Router, NavigationEnd } from '@angular/router';
import { Http } from '@angular/http';

import { DoznService } from '../../dozn.service';
import { DoznIonic } from '../../models/models';

@Component({
  selector: 'app-dozn',
  template: `
  <app-dialog [(visible)]="showDialog">
    <h1>Welcome to</h1>
    <h2>Dozn</h2>
    <div class="form">
      <auto-complete (create)="onCreate($event)" (autocompleteSelected)="onSelect($event)" label="SELECT USER" type="user"></auto-complete>
      <auto-complete (create)="onCreate($event)" (autocompleteSelected)="onSelect($event)" label="SELECT FEATURE" type="feature"></auto-complete>
      <auto-complete (create)="onCreate($event)" (autocompleteSelected)="onSelect($event)" label="SELECT FLOW" type="flow"></auto-complete>
      <div class="submit-button">
        <button type="submit" [disabled]="isDisabledBeginSession()" (click)="onSubmit()">Begin Session</button>
      </div>
    </div>
  </app-dialog>
  `,
  styles: [
    `h1, h2, h4 {
      display: flex;
      justify-content: center;
      font-family: Arial, Helvetica, sans-serif;
      color: #fff;
    }`,
    `.form {
      font-family: Arial, Helvetica, sans-serif;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
    }`,
    `.form label {
      display: block;
      font-size: 14px;
      margin-top: 20px;
      margin-bottom: 5px;
    }`,
    `.form .submit-button {
      margin-top: 50px;
      display: flex;
      justify-content: center;
    }`,
    `.form .submit-button button {
      padding-left: 50px;
      padding-right: 50px;
      padding-top: 10px;
      padding-bottom: 10px;
      border: none;
      border-radius: 16px;
      font-size: 14px;
      color: #fff;
      background-color: #ff9933;
    }`,
    `.form input {
      border: none;
      border-radius: 3px;
      color: #fff;
      font-size: 14px;
      background-color: #934db682;
      padding: 8.5px;
    }`
  ]
})
export class DoznAppComponent implements OnInit {
  sessionData: DoznIonic.SessionOptions = {
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
      if (!!_.url && _.url !== '/' && _.url !== '') {
        const paths = _.url.split('/');
        const element = router.config.filter(e => e.path === paths[paths.length - 1])[0];

        if (element.redirectTo) {
          _dozn.currentViewName = element.redirectTo;
        } else if (element.hasOwnProperty('component')) {
          _dozn.currentViewName = element.component.name;
        } else if (!element.component && element.loadChildren) {
          const moduleName = JSON.stringify(element.loadChildren).match(/(?<=#)[^\]]+/)[0];
          _dozn.currentViewName = moduleName;
        } else {
          _dozn.currentViewName = 'Route not found';
        }
      }
    });
  }

  onSelect(event: DoznIonic.SelectOption) {
    this.sessionData[event.type] = event.name;
  }

  async onCreate(event: DoznIonic.CreateOption) {
    if (event.type === 'feature') {
      const feature = await this._dozn.createFeature(event.name).toPromise();
      this.sessionData[event.type] = feature.text();
    } else if (event.type === 'flow') {
      const flow = await this._dozn.createFlow(event.name, this.sessionData.feature).toPromise();
      this.sessionData[event.type] = flow.text();
    } else {
      return;
    }
  }

  isDisabledBeginSession() {
    if(this.sessionData.feature === '' || this.sessionData.flow === '' || this.sessionData.user === '') {
      return true;
    } else {
      return false;
    }
  }

  onSubmit() {
    if (this.sessionData.user && this.sessionData.feature && this.sessionData.flow) {
      this._dozn.startSession(this.sessionData.user, this.sessionData.feature, this.sessionData.flow);
      this.showDialog = !this.showDialog;
    }
  }

  ngOnInit() {
    this.showDialog = !this.showDialog;
  }
}
