export class ProductMapping {
    ID: number = 0;
    PRODUCT_ID: number = 0;
    UNIT_ID: number = 0;
    SIZE: number = 0; 
    RATE: number = 0;
    IS_MAINTAIN_STOCK: boolean = true;
    STATUS: boolean = true;
    OPENING_STOCK:number = 9999999999.00; 
    CURRENT_STOCK: any ;
    RATIO_WITH_MAIN_STOCK: any=1; 
    UNIT_NAME:string =''
    IN_COUNTRY:number=0 ;
    OUT_COUNTRY:number=0 ;
    VARIENT_IMAGE_URL=''
}