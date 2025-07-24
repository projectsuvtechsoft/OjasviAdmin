import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { packagingcharges } from 'src/app/Models/packagingcharges';
import { ProductMapping } from 'src/app/Models/productmapping';
import { ProductMaster } from 'src/app/Models/productmaster';
import { UnitMaster } from 'src/app/Models/unitmaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-addproductmapping',
  templateUrl: './addproductmapping.component.html',
  styleUrls: ['./addproductmapping.component.css'],
})
export class AddproductmappingComponent implements OnInit {
  @Input()
  datadata: packagingcharges = new packagingcharges();
  @Input()
  maintain: any;

  @Input()
  disabled: any;

  @Input()
  varient: any;

  @Input()
  drawerClose!: Function;
  @Input()
  data: ProductMapping = new ProductMapping();
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk = true;
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // namepatt=/^[a-zA-Z \-\']+/
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  mobpattern = /^[6-9]\d{9}$/;
  units: UnitMaster[] = [];
  @Input() productId: any;
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService
  ) {}

  @Input()
  data1: ProductMaster = new ProductMaster();
  IS_MAINTAIN_STOCK: boolean = true;

  ngOnInit(): void {
    console.log('map drawer' + this.disabled);

    this.loadunit();
    this.maintain = this.maintain;
    this.varient = this.varient;

    // if(this.varient == 1){
    //   this.IS_MAINTAIN_STOCK = false
    // }
  }

  ///Unit Mastre
  loadunit() {
    this.api.getAllUnitMaster(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        this.units = data['data'];
      },
      (err) => {
        console.log(err);
        this.isSpinning = false;
      }
    );
  }
  //// Only number and dot
  onlynumdot(event: any) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 46 || charCode > 57)) {
      return false;
    }
    return true;
  }
  close(): void {
    this.drawerClose();
  }

  //// Only number
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  ////

  // datachange(event:any)
  // {
  //   this.data.RATIO_WITH_MAIN_STOCK == 0
  // }
  resetDrawer(websitebannerPage: NgForm) {
    this.data = new ProductMapping();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
  //save
  save(addNew: boolean, websitebannerPage: NgForm): void {
    // console.log(this.productId );
    // console.log(this.data.UNIT_ID );
    // console.log(this.data.RATE );

    console.log(this.data.OPENING_STOCK);
    console.log(this.data.CURRENT_STOCK);
    console.log(this.data.RATIO_WITH_MAIN_STOCK);
    this.data.PRODUCT_ID = this.productId;
    this.isSpinning = false;
    this.isOk = true;

    if (this.data.SIZE == 0 && this.data.UNIT_ID == 0 && this.data.RATE == 0 ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields', '');
    } else if (this.data.SIZE == 0 || this.data.SIZE == undefined) {
      this.isOk = false;
      this.message.error('Please Enter Size', '');
    } else if (this.data.UNIT_ID == 0 || this.data.UNIT_ID == null) {
      this.isOk = false;
      this.message.error('Please Select Unit', '');
    } 
    else if (this.data.IN_COUNTRY == undefined ) {
      this.isOk = false;
      this.message.error(' Please Enter Correct In Country Packaging Charges ', '');
    }else if (this.data.OUT_COUNTRY == undefined ) {
      this.isOk = false;
      this.message.error('Please Enter Correct Out Country Packaging charges  ', '');
    }else if (this.data.RATE == 0 || this.data.RATE == undefined) {
      this.isOk = false;
      this.message.error('Please Enter Rate', '');
    }
    else if(this.maintain == 1 && this.varient == 1)
    {
       if (
        this.data.IS_MAINTAIN_STOCK == true &&
        (this.data.RATIO_WITH_MAIN_STOCK == 0 ||
          this.data.RATIO_WITH_MAIN_STOCK == undefined)
      ) {
        this.isOk = false;
        this.message.error('Please Enter Ratio With Maintain  Stock ', '');
      }
  
      else if (
        this.data.IS_MAINTAIN_STOCK == false &&
        (this.data.RATIO_WITH_MAIN_STOCK == 0 ||
          this.data.RATIO_WITH_MAIN_STOCK == undefined)
          
      ) {
        this.isOk = false;
        this.message.error('Please Enter Ratio With Maintain  Stock ', '');
      }
    }
    



  
    // else if (
    //   this.data.IS_MAINTAIN_STOCK == false &&
    //   (this.data.RATIO_WITH_MAIN_STOCK == 0 ||
    //     this.data.RATIO_WITH_MAIN_STOCK == undefined)
    // ) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Ratio With Maintain  Stock ', '');
    // }


    // else
    //   if (this.data.IS_MAINTAIN_STOCK == true && (this.data.OPENING_STOCK == 0 || this.data.OPENING_STOCK == undefined)) {
    //     this.isOk = false
    //     this.message.error('Please Enter Opening Stock', '')
    //   }

    //   else
    //     if (this.data.IS_MAINTAIN_STOCK == true && (this.data.CURRENT_STOCK == 0 || this.data.CURRENT_STOCK == undefined)) {
    //       this.isOk = false
    //       this.message.error('Please Enter Current Stock', '')

    //     }

    // else
    //   if ( this.maintain == 0 && this.varient == 1 && this.data.IS_MAINTAIN_STOCK == true &&  (this.data.OPENING_STOCK == 0 || this.data.OPENING_STOCK == undefined)) {
    //     this.isOk = false
    //     this.message.error('Please Enter Opening Stock', '')
    //   }

    // else
    // if ( this.maintain == 0 && this.varient == 1 && this.data.IS_MAINTAIN_STOCK == true &&  (this.data.CURRENT_STOCK == 0 || this.data.CURRENT_STOCK == undefined)) {
    //   this.isOk = false
    //   this.message.error('Please Enter Current Stock', '')
    // }

    if (this.isOk) {
      this.isSpinning = true;

       if(this.maintain == 1 && this.varient == 1)
       {
        if(this.data.IS_MAINTAIN_STOCK == false )
        {
          this.data.OPENING_STOCK = null;
          // this.data.CURRENT_STOCK = null;
        }
       }
       else if(this.maintain == 0 && this.varient == 1)
       {
        if(this.data.IS_MAINTAIN_STOCK == false )
        {
          this.data.OPENING_STOCK = null;
          // this.data.CURRENT_STOCK = null;
        }
       }

     

      // if(this.data.IS_MAINTAIN_STOCK == true && (this.data.CURRENT_STOCK > 0 || this.data.CURRENT_STOCK == null)){
      //   this.data.CURRENT_STOCK = 0
      // }else{
      //   this.data.CURRENT_STOCK = this.data.CURRENT_STOCK
      // }

      if (this.data.ID) {
        this.api.updateProductVarient(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(' Information Updated Successfully...', '');
            if (!addNew) this.drawerClose();
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Update Information...', '');
            this.isSpinning = false;
          }
        });
      } else {
        this.api.createProductVarient(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(' Information Save Successfully...', '');
            if (!addNew) this.drawerClose();
            else {
              this.data = new ProductMapping();
              this.resetDrawer(websitebannerPage);
              // this.data.img= '';

              // this.api.getAllcontact(1,1,'','desc','').subscribe (data =>{
              // if (data['count']==0){
              //   this.data.SEQUENCE_NO=1;
              // }else
              // {
              //   this.data.SEQUENCE_NO=data['data'][0]['SEQUENCE_NO']+1;
              // }
              // },err=>{
              //   console.log(err);
              // })
            }
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Save Information...', '');
            this.isSpinning = false;
          }
        });
      }
    }

    // else
    // {
    //   this.message.error("Please Fill All Required Fields...","");
    //   this.isSpinning = false;
    // }
  }
  //Open social media link method
  open(link: any) {
    if (link != null || link != undefined) {
      window.open(link);
    }
  }
}
