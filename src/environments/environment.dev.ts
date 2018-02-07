const environment = {
  production: false,
  firebase: {
    GET_COMPANY_USERS : 'https://us-central1-ioniczen-7709c.cloudfunctions.net/getUsers?apikey=',
    GET_FEATURES : 'https://us-central1-ioniczen-7709c.cloudfunctions.net/getFeatures?apikey=',
    GET_FLOWS : 'https://us-central1-ioniczen-7709c.cloudfunctions.net/getFlows?apikey=',
    POST_SESSION : 'https://us-central1-ioniczen-7709c.cloudfunctions.net/postSession',
    POST_ACTION : 'https://us-central1-ioniczen-7709c.cloudfunctions.net/postAction',
    POST_FEATURE : 'https://us-central1-ioniczen-7709c.cloudfunctions.net/postFeature',
    POST_FLOW : 'https://us-central1-ioniczen-7709c.cloudfunctions.net/postFlow',
  }
};

export { environment };
