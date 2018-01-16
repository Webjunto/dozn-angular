import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { AngularFirestore } from 'angularfire2/firestore';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

const { version: appVersion, name: project } = require('../../package.json');

@Injectable()
export class DoznService {
  public currentViewName: string;
  public flowSession: string;
  public doznEvents = new Subject();
  public appVersion: string;
  public session;

  constructor(
    public http: Http,
    private _af: AngularFirestore
  ) {

    this.doznEvents.asObservable()
    .distinctUntilChanged()
    .switchMap((event: any) => {
      const payload: any = this.prepareEvtData(event);
      return this._af.collection('actions').add(payload);
    })
    .subscribe(data => {
      console.log('saved event:', data);
    });
  }

  startSession(code, feature, flow) {
    this.session = {
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

    this._af.collection('sessions').add(this.session).then(res => {
      this.flowSession = res.id;
    });
  }

  private prepareEvtData(event: any) {
    const actualPath: any[] = [];

    const path = event.path.reverse();
    path.splice(0, 2);
    path.forEach((el: any) => {
      let className = '';
      if (el.nodeName.toLowerCase() === 'button') {
        className = className.replace('.activated', '');
      }
      actualPath.push(el.nodeName.toLowerCase() + className);
    });

    const cssSelectorPath = actualPath.join(' > ');
    // Find index of this specific target element, because selector can match multiples.
    const allElements = document.querySelectorAll(cssSelectorPath);
    let nodeListIndex = 0, elementHtml, elementInnerText;

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
      projectId: this.session.project,
      featureId: this.session.featureId,
      flowId: this.session.flowId,
      pageId: '',  // Plugin sends the name not the ID
      pageName: this.currentViewName,
      snapshot: '',
      cssSelector: cssSelectorPath,
      nodeIdx: nodeListIndex,
      type: event.type,
      flowSession: this.flowSession,
      elementHtml,
      elementInnerText,
      createdAt: new Date()
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
