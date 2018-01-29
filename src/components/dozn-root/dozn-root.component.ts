import { Component, Renderer, OnInit, Input } from '@angular/core';
import {Router, NavigationEnd } from '@angular/router';

import { AngularFirestore } from 'angularfire2/firestore';

import { DoznService } from '../../dozn.service';

@Component({
  selector: 'app-dozn',
  template: `
  <app-dialog [(visible)]="showDialog">
    <h1>Welcome to</h1>
    <h2>Dozn</h2>
    <h4>Intro text</h4>
    <form #myForm="ngForm">
      <auto-complete (create)="onCreate($event)" (autocompleteSelected)="onSelect($event)" [project]="project" label="SELECT USER" type="userProfiles"></auto-complete>
      <auto-complete (create)="onCreate($event)" (autocompleteSelected)="onSelect($event)" [project]="project" label="SELECT FEATURE" type="features"></auto-complete>
      <auto-complete (create)="onCreate($event)" (autocompleteSelected)="onSelect($event)" [project]="project" label="SELECT FLOW" type="flows"></auto-complete>
      <div class="submit-button">
        <button type="submit" (click)="onSubmit(myForm)">Begin Session</button>
      </div>
    </form>
  </app-dialog>
  `,
  styles: [
    `
    h1, h2, h4 {
      display: flex;
      justify-content: center;
      font-family: Arial, Helvetica, sans-serif;
      color: #fff;
    }

    form {
      font-family: Arial, Helvetica, sans-serif;
      color: #fff;
    }

    form label {
      display: block;
      font-size: 14px;
      margin-top: 20px;
      margin-bottom: 5px;
    }

    form .submit-button {
      margin-top: 50px;
      display: flex;
      justify-content: center;
    }

    form .submit-button button {
      padding-left: 50px;
      padding-right: 50px;
      padding-top: 10px;
      padding-bottom: 10px;
      border: none;
      border-radius: 16px;
      font-size: 14px;
      color: #fff;
      background-color: #ff9933;
    }

    form input {
      border: none;
      border-radius: 3px;
      color: #fff;
      font-size: 14px;
      background-color: #934db682;
      padding: 8.5px;
    }
    `
  ]
})
export class DoznAppComponent implements OnInit {
  showDialog = false;
  project;
  data = {
    userProfiles: '',
    features: '',
    flows: ''
  };

  constructor(
    renderer: Renderer,
    router: Router,
    private _af: AngularFirestore,
    private _dozn: DoznService
  ) {

    this.project = this._dozn.projectName;

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

  ngOnInit() {
    this.showDialog = !this.showDialog;
  }

  onSelect(event) {
    this.data[event.type] = event.item.id;
  }

  onCreate(event) {
    if (event.type === 'features') {
      this._dozn.createFeature(name);
    } else if (event.type === 'flows') {
      this._dozn.createFlow(name, this.data.features);
    } else {
      return;
    }
  }

  onSubmit(form) {
    if (this._dozn && form) {
      this._dozn.startSession(form.form.controls.accessCode.value, form.form.controls.feature.value, form.form.controls.flow.value);
      this.showDialog = !this.showDialog;
    }
  }
}
