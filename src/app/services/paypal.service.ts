import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { environment } from 'src/environments/environment';

declare let paypal: any;

export class PayPalButton {
  public id = '';
  public items: PayPalItem[];
  public transactionId = '';
  public errorCallback: any;
  public clickCallBack: any;
  public cancelCallBack: any;
  public successCallback: any;
  public style: PayPalStyleConfiguration;
}

export class PayPalItem {
  public description = '';
  public unit_amount = 0;
  public quantity = 0;
  public amount = 0;
}

export interface ScriptModel {
  name: string,
  src: string,
  loaded: boolean
}

export class PayPalStyleConfiguration {
  public layout = 'horizontal';
  public size =  'small';
  public tagline = false;
  public label = 'paypal';
  public color = 'blue';
  public shape = 'rect'; 
}

@Injectable({
  providedIn: 'root'
})
export class PaypalService {

  private buttons: PayPalButton[] = [];
  private defaultStyleConfig: PayPalStyleConfiguration = {
    layout: 'horizontal',
    size: 'small',
    tagline: false,
    color: 'blue',
    shape: 'rect',
    label: 'pay'
  };

  constructor() {

  }

  init(style: PayPalStyleConfiguration = null): Observable<any> {
    let clientId: string = '';
    if (environment.paypal.mode === 'sandbox') {
      clientId = environment.paypal.sandboxClientId;
    } else if (environment.paypal.mode === 'production') {
      clientId = environment.paypal.productionClientId;
    }
    const scriptUrl = 'https://www.paypal.com/sdk/js?currency=' + environment.paypal.currency + '&client-id=' + clientId;

    const script = {
      name: 'paypal',
      src: scriptUrl,
      loaded: false,
    };

    if (style != null) { this.defaultStyleConfig = style };

    return this.load(script);
  }

  loadSingleButton(button: PayPalButton) {
    this.buttons = [];
    this.buttons.push(button);
    this.loadPayPalSmartPaymentButton();
  }  

  loadMultiButton(buttons: PayPalButton[]) {
    this.buttons = buttons;
    this.loadPayPalSmartPaymentButton();
  }

  private scripts: ScriptModel[] = [];
  private load(script: ScriptModel): Observable<ScriptModel> {
    return new Observable<ScriptModel>((observer: Observer<ScriptModel>) => {
      var existingScript = this.scripts.find(s => s.name == script.name);

      // Complete if already loaded
      if (existingScript && existingScript.loaded) {
        observer.next(existingScript);
        observer.complete();
      }
      else {
        // Add the script
        this.scripts = [...this.scripts, script];

        // Load the script
        let scriptElement = document.createElement("script");
        scriptElement.type = "text/javascript";
        scriptElement.src = script.src;

        scriptElement.onload = () => {
          script.loaded = true;
          observer.next(script);
          observer.complete();
        };

        scriptElement.onerror = (error: any) => {
          observer.error("Couldn't load script " + script.src);
        };

        document.getElementsByTagName('body')[0].appendChild(scriptElement);
      }
    });
  }

  private loadPayPalSmartPaymentButton(): void {
    this.buttons.forEach((i) => {
      if (i.style != null && i.style.layout == 'vertical') {
        i.style.tagline = false;
      }
      paypal.Buttons({
        style: i.style == null ? this.defaultStyleConfig : i.style,

        onClick: (data: any, actions: any) => {
          if (i.clickCallBack == null || i.clickCallBack == undefined) return true;
          return i.clickCallBack(data, i);
        },

        createOrder: (data: any, actions: any) => {
          if (i.items == null || i.items == undefined || i.items.length == 0) {
            console.log('Item to be pay not yet setup');
            return;
          }
          const totalAmount = i.items.reduce((total, currentValue) => {
            return total + currentValue.amount;
          }, 0);
          const description = i.items[0].description;
          let purchaseUnit: any = {
            amount: {
              value: totalAmount, 
              currency_code: environment.paypal.currency,
            },
          };
          if (i.transactionId != '' && i.transactionId != undefined && i.transactionId != null) {
            purchaseUnit.invoice_id = i.transactionId;
          }
          if (description != '' && description != undefined && description != null) {
            purchaseUnit.description = description;
          }
          if (i.items.length > 1) {
            purchaseUnit.amount.breakdown = {
              item_total: { value: totalAmount, currency_code: environment.paypal.currency }
            }
            purchaseUnit.items = i.items.map(x => {
              return { 
                name: x.description, 
                unit_amount: { value: x.unit_amount, currency_code: environment.paypal.currency },
                quantity: x.quantity
              };
            });
          }
          return actions.order.create({
            purchase_units: [purchaseUnit],
          });
        },

        onApprove: (data: any, actions: any) => {
          // data.orderID
          // proceed paypal payment
          return actions.order.capture().then(
            (payment: any) => {
              if (i.successCallback == null || i.successCallback == undefined) {
                console.log('Your success callback function not yet set.', payment);
                return;
              }
              i.successCallback(payment);
            },
            (error: any) => {
              if (i.errorCallback == null || i.errorCallback == undefined) {
                console.log('Your success callback function not yet set.', error);
                return;
              }

              i.errorCallback(error);
              return;
            });
        },

        onCancel: (data: any, actions: any) => {
          if (i.cancelCallBack == null || i.cancelCallBack == undefined) {
            console.log('Your success callback function not yet set.', data);
            return;
          }
          i.cancelCallBack(data);
          return;
        },

        onError: (data: any, actions: any) => {
          if (i.errorCallback == null || i.errorCallback == undefined) {
            console.log('Your success callback function not yet set.', data);
            return;
          }
          i.errorCallback(data);
          return;
        },
      }).render('#' + i.id);
    });
  }
}
