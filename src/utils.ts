import { InjectionToken } from '@angular/core';

export const GET_COMPANY_USERS = '';
export const GET_FEATURES = '';
export const GET_FLOWS = '';
export const POST_SESSION = '';
export const POST_ACTION = '';
export const POST_FEATURE = '';
export const POST_FLOW = '';

export interface IDoznConfig {
  apiKey: string;
}

export let DOZN_CONFIG = new InjectionToken<IDoznConfig>('dozn.config');
