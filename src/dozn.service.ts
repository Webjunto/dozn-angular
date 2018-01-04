import { Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

const API_URL = 'https://doznapi.herokuapp.com/api';

const { version: appVersion, name: project } = require('../../package.json');

@Injectable()
export class DoznService {
  public currentViewName: string;
  public eventSession: string;
  public doznEvents = new Subject();
  public appVersion: string;

  constructor(
    public http: Http
  ) {

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

  startSession(code, feature, flow) {
    const newEventSession = {
      device: this.getBrowserInfo(),
      project,
      tester: code,
      appVersion,
      featureId: feature,
      flowId: flow,
      status: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.http.post(`${API_URL}/EventSessions`, newEventSession)
      .map(response => response.json())
      .subscribe(data => {
        this.eventSession = data.id;
      });
  }

  private prepareEvtData(event: any) {
    const actualPath: any[] = [];

    const path = event.path.reverse();
    path.splice(0, 1);
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

  private getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let tem, M = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem =  /\brv[ :]+(\d+)/g.exec(userAgent) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) {
          return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = userAgent.match(/version\/(\d+)/i)) != null) {
      M.splice(1, 1, tem[1]);
    }
    return M.join(' ');
  }
}
