import { InjectionToken } from '@angular/core';

export interface IDoznConfig {
  apiKey: string;
  env?: string;
}

export let DOZN_CONFIG = new InjectionToken<IDoznConfig>('dozn.config');
