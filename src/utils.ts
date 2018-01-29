import { InjectionToken } from '@angular/core';
import { DoznService } from './dozn.service';

export interface IDoznConfig {
  apiKey: string;
}

export let DOZN_CONFIG = new InjectionToken<IDoznConfig>('dozn.config');
