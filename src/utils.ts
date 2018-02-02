import { InjectionToken } from '@angular/core';

export const GET_COMPANY_USERS = 'https://us-central1-ioniczen-7709c.cloudfunctions.net/getUsers?apikey=';
export const GET_FEATURES = 'https://us-central1-ioniczen-7709c.cloudfunctions.net/getFeatures?apikey=';
export const GET_FLOWS = 'https://us-central1-ioniczen-7709c.cloudfunctions.net/getFlows?apikey=';
export const POST_SESSION = 'https://us-central1-ioniczen-7709c.cloudfunctions.net/postSession';
export const POST_ACTION = 'https://us-central1-ioniczen-7709c.cloudfunctions.net/postAction';
export const POST_FEATURE = 'https://us-central1-ioniczen-7709c.cloudfunctions.net/postFeature';
export const POST_FLOW = 'https://us-central1-ioniczen-7709c.cloudfunctions.net/postFlow';

export interface IDoznConfig {
  apiKey: string;
}

export let DOZN_CONFIG = new InjectionToken<IDoznConfig>('dozn.config');
