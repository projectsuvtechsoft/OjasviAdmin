export class OrderDetailMaster {
  ID: number = 0;
  // NAME:string='';
  // EMAIL_ID:string='';
  // PASSWORD:string='';
  // MOBILE_NO:any;
  // CUSTOMER_ID:number=0;
  // CART_ID:number=0;
  // ADDRESS:any;
  // CITY:string='';
  // STATE_ID:number=0;
  // PINCODE:number=0;
  // PRODUCT_ID:number=0;
  // ORDER_TOTAL_QTY:number=0;
  // OREDER_ID:number=0;
  // CREATED_DATETIME:any;

  // STATUS:boolean=true;
  // SEQUENCE_NO:number=0 ;

  // REMARK_NAME: string = '';
  // IS_ACTIVE: boolean=true;
  // // REJECTED_DATA:string="";
  // // APPROVED_DATA:string="";
  // REMARK:any;
  // IS_VERIFIED:any;

  CURRENT_STAGE: any = 'A';
  TRACKING_ID: any = " ";
  COURIER_NAME: any;


  FROM_STAGE: any;
  TO_STAGE: any;
  USER_ID: any;

  DELIVERY_ID: any;
  EXPECTED_BEING_PREPARE: any;
  ACTUAL_BEING_PREPARE: any;
  ACTUAL_DELIVERY_DATETIME: any;
  EXPECTED_DELIVERY_DATETIME: any;
  DISPATCH_ID: any;
  EXPECTED_DISPATCH_DATETIME: any;
  ACTUAL_DISPATCH_DATETIME: any;
  PRODUCT_NAME: string = '';
  CUSTOMER_NAME: string = '';
  CUSTOMER_ID: number = 0;
  CART_ID: number = 0;
  COUNTRY_NAME: string = '';
  ORDER_DATETIME: any;
  ORDER_NUMBER: number = 0;
  TOTAL_AMOUNT: number = 0;
  ADDON_AMOUNT: number = 0;
  NET_AMOUNT: number = 0;
  // ORDER_STATUS: string = 'A';
  ORDER_STATUS: any = 'A';

  ORDER_CONFIRMED_DATETIME: any;
  ORDER_CONFIRMED_ID: number = 0;
  REJECT_REMARK: string = '';
  EXPECTED_PREPARE_PACKAGING_DATETIME: any;
  ACTUAL_PREPARE_PACKAGING_DATETIME: any;
  ACTUAL_PREPARE_DISPATCH_DATETIME: any;
  EXPECTED_PREPARE_DISPATCH_DATETIME: any;
  PREPARE_PACKAGING_ID: number = 0;
  PREPARE_DISPATCH_ID: number = 0;

  ADDRESS: any;
  CITY: any;
  EMAIL_ID: any;
  MOBILE_NO: number = 0;
  PINCODE: number = 0;
  STATE_NAME: any;
  CART_ITEMS: any = [];
  // ORDER_DATETIME:any=new Date();
}
