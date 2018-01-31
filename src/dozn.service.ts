import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { DOZN_CONFIG, IDoznConfig, POST_SESSION, POST_ACTION, POST_FEATURE, POST_FLOW } from './utils';

declare var require: any;
const { version: appVersion } = require('../../../../package.json');

@Injectable()
export class DoznService {
  private session;

  public doznEvents = new Subject();
  public currentViewName: string;
  public sessionId: string;
  public appVersion: string;
  public apiKey: string;

  constructor(
    public http: Http,
    @Inject(DOZN_CONFIG) config: IDoznConfig
  ) {

    this.apiKey = config.apiKey;

    this.doznEvents.asObservable()
    .distinctUntilChanged()
    .switchMap((event: any) => {
      const payload: any = this.prepareEvtData(event);
      return this.http.post(POST_ACTION, payload);
    })
    .subscribe(data => {
      console.log('saved event:', data);
    });
  }

  createFeature(name) {
    this.http.post(POST_FEATURE, {
      name,
      projectId: this.apiKey
    });
  }

  createFlow(name, featureId) {
    this.http.post(POST_FLOW, {
      name,
      projectId: this.apiKey,
      featureId,
      testDescription: ''
    });
  }

  startSession(code, feature, flow) {
    this.session = {
      apiKey: this.apiKey,
      device: this.getBrowserInfo(),
      projectId : this.apiKey,
      tester: code,
      appVersion,
      featureId: feature,
      flowId: flow,
      status: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.http.post(POST_SESSION, this.session).toPromise().then((res: any) => {
      this.sessionId = res.id;
    });
  }

  private prepareEvtData(event: any) {
    const actualPath: any[] = [];
    const path = event.path.reverse();

    path.splice(0, 6);
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

    for (let len = allElements.length; nodeListIndex < len; nodeListIndex++) {
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
      projectId: this.session.projectId,
      featureId: this.session.featureId,
      flowId: this.session.flowId,
      pageId: '',
      pageName: this.currentViewName,
      snapshot: document.getElementsByTagName('html')[0].innerHTML,
      cssSelector: cssSelectorPath,
      nodeIdx: nodeListIndex,
      type: event.type,
      sessionId: this.sessionId,
      elementHtml,
      elementInnerText,
      createdAt: new Date()
    };

    if(event.type === 'input') {
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
