declare const require: any;

export const environment = {
  production: true,
  package: require('../../package.json'),
  paypal: {
    mode: 'production',
    sandboxClientId: 'AW35MxsELLQji9DqLDeEK0wd7O1CjeBIVdlE1xs4p0VNQtaC9h-xzDY_lZFEm-4lmxQ-C6sT9uvCbiqr',
    productionClientId: 'AVHs4otUqjovQtm-pkY9Mv_BLy_D5CRNCwZ0WuyhPyZuRhZHRNh7L2cV0M09kJI6TQidyW_bS4i61GiU',
    currency: 'usd'
  }
};
