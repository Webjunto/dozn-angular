import { InjectionToken } from '@angular/core';

export const GET_COMPANY_USERS = 'https://us-central1-ioniczen-7709c.cloudfunctions.net/getUsers?apikey=';
export const GET_FEATURES = 'https://us-central1-ioniczen-7709c.cloudfunctions.net/getFlows?apikey=';
export const GET_FLOWS = 'https://us-central1-ioniczen-7709c.cloudfunctions.net/getFeatures?apikey=';
export const POST_SESSION = '';
export const POST_ACTION = '';
export const POST_FEATURE = '';
export const POST_FLOW = '';

export interface IDoznConfig {
  apiKey: string;
}

export let DOZN_CONFIG = new InjectionToken<IDoznConfig>('dozn.config');
