import { Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

const API_URL = 'https://doznapi.herokuapp.com/api';

@Injectable()
export class DoznService {
  public currentViewName: string;
  public eventSession: string;
  public doznEvents = new Subject();

  constructor(
    public http: Http
  ) {

    const newEventSession = {
      project: 'dozn.angular',
    };

    this.http.post(`${API_URL}/EventSessions`, newEventSession)
      .map(response => response.json())
      .subscribe(data => {
        this.eventSession = data.id;
      });

    this.doznEvents.asObservable()
      .distinctUntilChanged()
      .switchMap((event: any) => {
        const payload: any = this.prepareEvtData(event);
        // Save to Backend
        return this.http.post(`${API_URL}/Events`, payload);
      })
      .map(response => response.json())
      .subscribe(data => {
        console.log('saved event:', data);
      });
  }

  private prepareEvtData(event: any) {
    const actualPath: any[] = [];

    const path = event.path.reverse();
    path.splice(0, 6);
    path.forEach((el: any) => {
      let className = '';

      // Remove .activated class from buttons
      if (el.nodeName.toLowerCase() === 'button') {
        className = className.replace('.activated', '');
      }

      actualPath.push(el.nodeName.toLowerCase() + className);
    });

    const cssSelectorPath = actualPath.join(' > ');

    // Find index of this specific target element, because selector can match multiples.
    const allElements = document.querySelectorAll(cssSelectorPath);
    let nodeListIndex = 0;
    let elementHtml;
    let elementInnerText;

    for (const len = allElements.length; nodeListIndex < len; nodeListIndex++) {
      const el = allElements.item(nodeListIndex) as HTMLElement;
      if (el === event.target) {
        try {
          elementHtml = el.outerHTML;
          elementInnerText = el.innerText;
        } catch (error) {
          console.error('error in html conversion', error);
        }
        break;
      }
    }

    const doznEvent: { [k: string]: any } = {
      eventSession: this.eventSession,
      type: event.type,
      page: this.currentViewName,
      cssSelectorPath,
      nodeListIndex,
      elementHtml,
      elementInnerText,
    };

    if (event.type === 'input') {
      doznEvent.fieldType = event.target.type;
      doznEvent.fieldValue = event.target.value;
    }

    return doznEvent;
  }
}
