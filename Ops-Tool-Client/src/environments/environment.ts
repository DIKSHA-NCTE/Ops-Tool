// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// development
export const environment = {
  production: false,
  PLAY_URL: '<host for adopter\'s instance>/play/content/',
  base : '<host for adopter\'s instance>/api/',
  key_base : '<host for adopter\'s instance>',
  LOCALHOST : '<host for adopter\'s ops tool instance>/api/',
  RESOURCE: '<ops tool keycloak client id>',
  CUSTODIAN_ORG: '<Custodian Organisation name of the instance>',
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
