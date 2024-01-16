// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // baseURL: 'https://jimgate.com/jim/api/index.php/', //'/jim-api/index.php/', //
  baseURL: 'http://localhost/api/api/', //'/jim-api/index.php/', //
  // mediaURL: 'https://jimgate.com/jim/api/uploads/', //'/jim-api/uploads/', //
  mediaURL: 'http://localhost/api/api/uploads/', //'/jim-api/uploads/', //
  onesignal: {
    appId: 'YOUR_APP_ID',
    googleProjectNumber: 'GOOGLE_PROJECT_NUMBER',
    restKey: 'REST_KEY'
  },
  general: {
    symbol: 'OMR',
    code: 'OMR'
  },
  mapbox: {
		accessToken: 'pk.eyJ1IjoibXJzb2x2ZXIiLCJhIjoiY2txc2RodW8xMTY2NDJ4bzFibGZhaGVnNCJ9.gbDvdy_EThZQw7XQ60FIIg'
	},
  authToken: '123456',
  default_country_code: '968'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
