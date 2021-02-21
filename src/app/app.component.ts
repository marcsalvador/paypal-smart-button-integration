import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PayPalButtonAction, PayPalItem as PayPalItem, PaypalService } from './services/paypal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  public environment = environment;

  public formGroup!: FormGroup;
  public response = '';

  public items = [
    { description: 'Sample Item 1', unit_amount: 5, quantity: 1, amount: 5 },
    { description: 'Sample Item 2', unit_amount: 10, quantity: 1, amount: 10 },
    { description: 'Sample Item 3', unit_amount: 15, quantity: 1, amount: 15 },
    { description: 'Sample Item 4', unit_amount: 20, quantity: 1, amount: 20 },
    { description: 'Sample Item 5', unit_amount: 25, quantity: 1, amount: 25 }
  ];

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public paypalService: PaypalService) {
  }

  ngOnInit(): void {
    let appPath = '';
    if (this.router.url !== '/') {
      appPath = document.location.href.replace(this.router.url, '') + '/';
    }
    else {
      appPath = document.location.href;
    }
    this.formGroup = this.formBuilder.group({
      timeWithMat: new FormControl(null),
      timeNoMat: new FormControl(null)
    });
  }

  ngAfterViewInit(): void {
    // Single Button
    const item: PayPalItem= {
      description: 'Single Button Sample',
      unit_amount: 1,
      amount: 1,
      quantity: 1
    };
    const singleButton: PayPalButtonAction = {
      items : [item],
      id:'singleSmartButton',
      transactionId: '',
      errorCallback: () => { },
      cancelCallBack: () => { },
      successCallback: () => { },
      clickCallBack: (data: any, item: PayPalButtonAction) => { console.log(data, item); return true; }
    };

    // Multiple Button
    const multipleItems: PayPalButtonAction[] = [];
    this.items.map((x, index) => { 
      const mItem: PayPalItem= {
        description: x.description,
        amount: x.amount,
        unit_amount: x.unit_amount,
        quantity: x.quantity
      };
      multipleItems.push({
        items : [mItem],
        id: 'multipleButton' + index,
        transactionId: '',
        errorCallback: () => { },
        cancelCallBack: () => { },
        successCallback: () => { },
        clickCallBack: (data: any, item: PayPalButtonAction) => { console.log(data, item); return true; }
      })
    });

    // Multi Item Single Button
    const multiItems = [];
    this.items.map((x, index) => { 
      const mItem: PayPalItem= {
        description: x.description,
        quantity: x.quantity,
        unit_amount: x.unit_amount,
        amount: x.amount,
      };
      multiItems.push(mItem);
    });    
    const multiItemOneButton: PayPalButtonAction = {
      items : multiItems,
      id:'multiItemOneButton',
      transactionId: '',
      errorCallback: () => { },
      cancelCallBack: () => { },
      successCallback: () => { },
      clickCallBack: (data: any, item: PayPalButtonAction) => { console.log(data, item); return true; }
    };

    // Load
    this.paypalService.init().subscribe(() => { 
      this.paypalService.loadSingleButton(singleButton);
      this.paypalService.loadSingleButton(multiItemOneButton); 
      this.paypalService.loadMultiButton(multipleItems); 
    }, () => { 
      
    });
  }

  submit(): void {
    console.log(this.formGroup);
    if (!this.formGroup.valid) {
      alert('Please Fill up required Fields.');
      return;
    }

    const model = this.formGroup.getRawValue();
    this.response = JSON.stringify(model);
  }
}

