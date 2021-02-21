declare const require: any;

export const environment = {
  production: true,
  package: require('../../package.json'),
  paypal: {
    mode: 'sandbox',
    sandboxClientId: 'AW35MxsELLQji9DqLDeEK0wd7O1CjeBIVdlE1xs4p0VNQtaC9h-xzDY_lZFEm-4lmxQ-C6sT9uvCbiqr',
    productionClientId: '',
    currency: 'USD'
  }
};
