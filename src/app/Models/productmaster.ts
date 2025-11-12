export class ProductMaster {
    ID:number=0;
    NAME:string='';
    NAME_MR:string='';
    DESCRIPTION:string='';
    DESCRIPTION_MR:string='';
    PRICE1:number=0; 
    PRICE2:number=0; 
    PRICE3:number=0; 
    PRICE4:number=0; 
    IN_COUNTRY:number=0 ;
    OUT_COUNTRY:number=0 ;
    // UNIT:string='';
    RATE:any;
    SIZE:any;
    SIZE1:number=0;
    SIZE2:number=0;
    SIZE3:number=0;
    SIZE4:number=0;
    CATEGORY_ID:number=0;
    CGST:number=0;
    SGST:number=0; 
    IGST:number=0; 
    GST_TYPE:number=0;  
    DISCOUNT_TYPE: any;
    DISCOUNT: any; 
    UNIQUE_CODE:string='';
    IS_POPULAR:boolean=true;
    IS_BEST_SELLER:boolean=true;
    IS_NEW_ARRIVAL:boolean=true;
    IMAGES:any=[];
    STATUS:boolean=true;
    CATEGORY_NAME:string='';
    imageData:string='';
    UNIT_ID1:any;
    UNIT_ID2:number=0;
    UNIT_ID3:number=0;
    UNIT_ID4:number=0;
    
    IS_MAINTAIN_STOCK:boolean=true;
    IS_VERIENT_AVAILABLE:boolean=true;
    UNIT_ID:any=1;
    OPENING_STOCK:any=1;
    CURRENT_STOCK:any=1;
    BENIFITS:any
    IS_UPCOMING:boolean=false;
}

export class ProductImages{
    ID:number=0; 
    PRODUCT_ID:number=0; 
    PHOTO_URL:string='';   
}