import { Component, OnInit, Input,  Output, EventEmitter, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Http } from '@angular/http';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/combineLatest';

 import {GET_COMPANY_USERS, GET_FEATURES,  GET_FLOWS} from '../../utils';

@Component({
  selector: 'auto-complete',
  template: `
  <div>
    <label>{{label}}</label>
    <input #myInput="ngModel" [(ngModel)]="name" type="text" placeholder="{{placeholder}}" class="input">
    <div *ngFor="let item of items | async" (click)="selectItem(item)">
        <p>{{item?.name}}</p>
    </div>
    <div *ngIf="name.length > 0 && !existItems" (click)="onCreate(name)">
        <p>Create {{ name }} {{ type}}</p>
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
  @ViewChild('myInput') searchInput: NgModel;
  @Input('label') label: string;
  @Input('type') type: string;
  @Input('project') project: string;
  @Output() autocompleteSelected: EventEmitter<{}> = new EventEmitter<{}>();
  @Output() create: EventEmitter<{}> = new EventEmitter<{}>();

  snapshot$;
  name = '';
  placeholder = '';
  items;
  existItems = true;

  constructor(private http: Http) {
  }

  getUrl() {
    if (this.type === 'companyUsers') {
      return GET_COMPANY_USERS;
    } else if (this.type === 'features'){
      return GET_FEATURES;
    } else {
      return GET_FLOWS;
    }
  }

  ngOnInit() {
    this.placeholder = 'What ' + this.type + ' do you want?';
    this.snapshot$ = this.http.get(this.getUrl());

    this.items = this.searchInput.valueChanges
    .combineLatest(this.snapshot$)
    .subscribe(([searchInput, dataArr]) => {
      if (!searchInput) return [];
      const filteredArr = dataArr.filter(item => item.name.startsWith(searchInput));
      this.existItems = filteredArr.length > 0 ? true : false;
      return filteredArr;
    });
  }

  onCreate(name) {
    this.create.emit({name, type:this.type});
  }

  selectItem(item) {
    this.name = item.name;
    this.existItems = false;
    this.autocompleteSelected.emit({item, type: this.type});
  }
}
