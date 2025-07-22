export const environment = {
  production: true,

  firebase: {
    vapid:
      'BMnTXkD1p2ExPL_iPgdTHrrdLLHdCNYg2ZCUJRb1h-2tTuTfkeZVzNVXJN1b36rBSHpjIqel-mc_PLOsA9Lckf8',
    apiKey: 'AIzaSyA5p3rU3z-A0QwV5_fEryVvQh4CFvlJckg',
    authDomain: 'pockit-df54e.firebaseapp.com',
    projectId: 'pockit-df54e',
    storageBucket: 'pockit-df54e.firebasestorage.app',
    messagingSenderId: '658839127239',
    appId: '1:658839127239:web:9d5101fb9718275b116ae2',
    measurementId: 'G-N76JL181BX',

    appVersion1: require('../../package.json').version + '-dev',
    appVersion2: require('../../package.json').version,
  },
  appVersioning: {
    appVersion: require('../../package.json').version,
  },
};