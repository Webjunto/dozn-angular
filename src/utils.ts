import { InjectionToken } from '@angular/core';
import { ViewController, Navbar } from 'ionic-angular';
import { DoznService } from './dozn.service';

export interface IDoznConfig {
  projectKey: string;
}

export let DOZN_CONFIG = new InjectionToken<IDoznConfig>('dozn.config');
