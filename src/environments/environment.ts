// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
declare const require: any;

export const environment = {
  production: false,
  package: require('../../package.json'),
  paypal: {
    mode: 'sandbox',
    sandboxClientId: 'AW35MxsELLQji9DqLDeEK0wd7O1CjeBIVdlE1xs4p0VNQtaC9h-xzDY_lZFEm-4lmxQ-C6sT9uvCbiqr',
    productionClientId: 'AVHs4otUqjovQtm-pkY9Mv_BLy_D5CRNCwZ0WuyhPyZuRhZHRNh7L2cV0M09kJI6TQidyW_bS4i61GiU',
    currency: 'USD'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
