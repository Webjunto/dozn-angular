import { Component, OnInit, Input,  Output, EventEmitter, ViewChild, Inject } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';

import { DoznService } from '../../dozn.service';

@Component({
  selector: 'auto-complete',
  template: `
  <div>
    <label>{{label}}</label>
    <input type="text" [(ngModel)]="name" placeholder="{{placeholder}}" class="input">
    <div *ngIf="name.length > 0 && !selected">
      <div *ngFor="let item of items | filter:name" (click)="selectItem(item)">
          <p>{{item?.name}}</p>
      </div>
    </div>
    <div *ngIf="name.length > 0 && !selected && (items | filter:name).length === 0" (click)="onCreate(name)">
        <p>Create {{name}} {{type}}</p>
    </div>
  </div>
  `,
  styles: [
    `label {
      display: block;
      font-size: 14px;
      margin-top: 20px;
      margin-bottom: 5px;
    }`,
    `input {
      border: none;
      border-radius: 3px;
      color: #fff;
      font-size: 14px;
      background-color: #934db6;
      padding: 8.5px;
      width: 100%;

      &::-webkit-input-placeholder { color: white; opacity: 0.6; }
      &::-moz-placeholder { color: white; opacity: 0.6; }
      &:focus::-webkit-input-placeholder { color:transparent; }
      &:focus::-moz-placeholder { color:transparent; }
    }`
  ]

})
export class AutocompleteComponent implements OnInit {
  @Input('label') label: string;
  @Input('type') type: string;
  @Output() autocompleteSelected: EventEmitter<{}> = new EventEmitter<{}>();
  @Output() create: EventEmitter<{}> = new EventEmitter<{}>();

  items = [];
  name = '';
  placeholder = '';
  selected = false;

  constructor(private http: Http, private _dozn: DoznService) {
  }

  getUrl() {
    if (this.type === 'user') {
      return this._dozn.environment.firebase.GET_COMPANY_USERS + this._dozn.apiKey;
    } else if (this.type === 'feature'){
      return this._dozn.environment.firebase.GET_FEATURES + this._dozn.apiKey;
    } else {
      return this._dozn.environment.firebase.GET_FLOWS + this._dozn.apiKey;
    }
  }

  async ngOnInit() {
    this.placeholder = 'What ' + this.type + ' do you want?';

    const items = await this.http.get(this.getUrl()).toPromise();
    this.items = items.json();
  }

  onCreate(name) {
    this.selected = true;
    this.create.emit({name, type:this.type});
  }

  selectItem(item) {
    this.name = item.name;
    this.selected = true;
    this.autocompleteSelected.emit({item, type: this.type});
  }
}
