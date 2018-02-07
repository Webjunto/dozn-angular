const environment = {
  production: true,
  firebase: {
    GET_COMPANY_USERS : 'https://us-central1-dozn-prod.cloudfunctions.net/getUsers?apikey=',
    GET_FEATURES : 'https://us-central1-dozn-prod.cloudfunctions.net/getFeatures?apikey=',
    GET_FLOWS : 'https://us-central1-dozn-prod.cloudfunctions.net/getFlows?apikey=',
    POST_SESSION : 'https://us-central1-dozn-prod.cloudfunctions.net/postSession',
    POST_ACTION : 'https://us-central1-dozn-prod.cloudfunctions.net/postAction',
    POST_FEATURE : 'https://us-central1-dozn-prod.cloudfunctions.net/postFeature',
    POST_FLOW : 'https://us-central1-dozn-prod.cloudfunctions.net/postFlow',
  }
};

export { environment };
