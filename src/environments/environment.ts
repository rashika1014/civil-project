// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: false
// };

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
export const environment = {
  production: true,
  firebase : {
    apiKey: "AIzaSyBIcKeBqMJ06oDc7sf7VDbbLxYwXK4U6nE",
    authDomain: "pwasurvey.firebaseapp.com",
    databaseURL: "https://pwasurvey.firebaseio.com",
    projectId: "pwasurvey",
    storageBucket: "pwasurvey.appspot.com",
    messagingSenderId: "81398920452",
    appId: "1:81398920452:web:aa7f56f3307c0a83c2cc51",
    measurementId: "G-N8T5ZY9WXR",
  }
};