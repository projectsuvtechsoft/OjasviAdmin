import { DatePipe } from '@angular/common';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { appkeys } from 'src/app/app.constant';
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
    private message: NzNotificationService,
    private datePipe:DatePipe
  ) {}

  @Input()
  data1: ProductMaster = new ProductMaster();
  IS_MAINTAIN_STOCK: boolean = true;

  ngOnInit(): void {
    // console.log('map drawer' + this.disabled);

    this.loadunit();
    this.maintain = this.maintain;
    this.varient = this.varient;
    // console.log(this.imagePreviews,this.data,this.fileURL)
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
  // save(addNew: boolean, websitebannerPage: NgForm): void {
  //   // console.log(this.productId );
  //   this.data.PRODUCT_ID = this.productId;
  //   this.isSpinning = false;
  //   this.isOk = true;

  //   if (this.data.SIZE == 0 && this.data.UNIT_ID == 0 && this.data.RATE == 0 ) {
  //     this.isOk = false;
  //     this.message.error(' Please Fill All Required Fields', '');
  //   } else if (this.data.SIZE == 0 || this.data.SIZE == undefined) {
  //     this.isOk = false;
  //     this.message.error('Please Enter Size', '');
  //   } else if (this.data.UNIT_ID == 0 || this.data.UNIT_ID == null) {
  //     this.isOk = false;
  //     this.message.error('Please Select Unit', '');
  //   }

  //   // else if (this.data.IN_COUNTRY == undefined ) {
  //   //   this.isOk = false;
  //   //   this.message.error(' Please Enter Correct In Country Packaging Charges ', '');
  //   // }else if (this.data.OUT_COUNTRY == undefined ) {
  //   //   this.isOk = false;
  //   //   this.message.error('Please Enter Correct Out Country Packaging charges  ', '');
  //   // }
  //   else if (this.data.RATE == 0 || this.data.RATE == undefined) {
  //     this.isOk = false;
  //     this.message.error('Please Enter Rate', '');
  //   }
  //   else if(this.maintain == 1 && this.varient == 1)
  //   {
  //      if (
  //       this.data.IS_MAINTAIN_STOCK == true &&
  //       (this.data.RATIO_WITH_MAIN_STOCK == 0 ||
  //         this.data.RATIO_WITH_MAIN_STOCK == undefined)
  //     ) {
  //       this.isOk = false;
  //       this.message.error('Please Enter Ratio With Maintain  Stock ', '');
  //     }

  //     else if (
  //       this.data.IS_MAINTAIN_STOCK == false &&
  //       (this.data.RATIO_WITH_MAIN_STOCK == 0 ||
  //         this.data.RATIO_WITH_MAIN_STOCK == undefined)

  //     ) {
  //       this.isOk = false;
  //       this.message.error('Please Enter Ratio With Maintain  Stock ', '');
  //     }
  //      else if (
  //       this.data.IS_MAINTAIN_STOCK == false &&
  //       (this.data.OPENING_STOCK == 0 ||
  //         this.data.OPENING_STOCK == undefined)

  //     ) {
  //       this.isOk = false;
  //       this.message.error('Please Enter Opening Stock ', '');
  //     }
  //   }

  //   // else if (
  //   //   this.data.IS_MAINTAIN_STOCK == false &&
  //   //   (this.data.RATIO_WITH_MAIN_STOCK == 0 ||
  //   //     this.data.RATIO_WITH_MAIN_STOCK == undefined)
  //   // ) {
  //   //   this.isOk = false;
  //   //   this.message.error('Please Enter Ratio With Maintain  Stock ', '');
  //   // }

  //   // else
  //   //   if (this.data.IS_MAINTAIN_STOCK == true && (this.data.OPENING_STOCK == 0 || this.data.OPENING_STOCK == undefined)) {
  //   //     this.isOk = false
  //   //     this.message.error('Please Enter Opening Stock', '')
  //   //   }

  //   //   else
  //   //     if (this.data.IS_MAINTAIN_STOCK == true && (this.data.CURRENT_STOCK == 0 || this.data.CURRENT_STOCK == undefined)) {
  //   //       this.isOk = false
  //   //       this.message.error('Please Enter Current Stock', '')

  //   //     }

  //   // else
  //   //   if ( this.maintain == 0 && this.varient == 1 && this.data.IS_MAINTAIN_STOCK == true &&  (this.data.OPENING_STOCK == 0 || this.data.OPENING_STOCK == undefined)) {
  //   //     this.isOk = false
  //   //     this.message.error('Please Enter Opening Stock', '')
  //   //   }

  //   // else
  //   // if ( this.maintain == 0 && this.varient == 1 && this.data.IS_MAINTAIN_STOCK == true &&  (this.data.CURRENT_STOCK == 0 || this.data.CURRENT_STOCK == undefined)) {
  //   //   this.isOk = false
  //   //   this.message.error('Please Enter Current Stock', '')
  //   // }

  //   if (this.isOk) {
  //     this.isSpinning = true;

  //      if(this.maintain == 1 && this.varient == 1)
  //      {
  //       if(this.data.IS_MAINTAIN_STOCK == false )
  //       {
  //         this.data.OPENING_STOCK = null;
  //         // this.data.CURRENT_STOCK = null;
  //       }
  //      }
  //      else if(this.maintain == 0 && this.varient == 1)
  //      {
  //       if(this.data.IS_MAINTAIN_STOCK == false )
  //       {
  //         this.data.OPENING_STOCK = null;
  //         // this.data.CURRENT_STOCK = null;
  //       }
  //      }

  //     // if(this.data.IS_MAINTAIN_STOCK == true && (this.data.CURRENT_STOCK > 0 || this.data.CURRENT_STOCK == null)){
  //     //   this.data.CURRENT_STOCK = 0
  //     // }else{
  //     //   this.data.CURRENT_STOCK = this.data.CURRENT_STOCK
  //     // }

  //     if (this.data.ID) {
  //       this.api.updateProductVarient(this.data).subscribe((successCode) => {
  //         if (successCode.code == '200') {
  //           this.message.success(' Information Updated Successfully...', '');
  //           if (!addNew) this.drawerClose();
  //           this.isSpinning = false;
  //         } else {
  //           this.message.error(' Failed To Update Information...', '');
  //           this.isSpinning = false;
  //         }
  //       });
  //     } else {
  //       this.api.createProductVarient(this.data).subscribe((successCode) => {
  //         if (successCode.code == '200') {
  //           this.message.success(' Information Save Successfully...', '');
  //           if (!addNew) this.drawerClose();
  //           else {
  //             this.data = new ProductMapping();
  //             this.resetDrawer(websitebannerPage);
  //             // this.data.img= '';

  //             // this.api.getAllcontact(1,1,'','desc','').subscribe (data =>{
  //             // if (data['count']==0){
  //             //   this.data.SEQUENCE_NO=1;
  //             // }else
  //             // {
  //             //   this.data.SEQUENCE_NO=data['data'][0]['SEQUENCE_NO']+1;
  //             // }
  //             // },err=>{
  //             //   console.log(err);
  //             // })
  //           }
  //           this.isSpinning = false;
  //         } else {
  //           this.message.error(' Failed To Save Information...', '');
  //           this.isSpinning = false;
  //         }
  //       });
  //     }
  //   }

  //   // else
  //   // {
  //   //   this.message.error("Please Fill All Required Fields...","");
  //   //   this.isSpinning = false;
  //   // }
  // }
  save(addNew: boolean, websitebannerPage: NgForm): void {
    // console.log(this.productId );
    this.data.PRODUCT_ID = this.productId;
    this.isSpinning = false;
    this.isOk = true;

    if (this.data.SIZE == 0 && this.data.UNIT_ID == 0 && this.data.RATE == 0) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields', '');
    } else if (this.data.SIZE == 0 || this.data.SIZE == undefined) {
      this.isOk = false;
      this.message.error('Please Enter Size', '');
    } else if (this.data.UNIT_ID == 0 || this.data.UNIT_ID == null) {
      this.isOk = false;
      this.message.error('Please Select Unit', '');
    } else if (this.data.RATE == 0 || this.data.RATE == undefined) {
      this.isOk = false;
      this.message.error('Please Enter Rate', '');
    } else if (this.maintain == 1 && this.varient == 1) {
      if (
        this.data.IS_MAINTAIN_STOCK == true &&
        (this.data.RATIO_WITH_MAIN_STOCK == 0 ||
          this.data.RATIO_WITH_MAIN_STOCK == undefined)
      ) {
        this.isOk = false;
        this.message.error('Please Enter Ratio With Maintain Stock ', '');
      } else if (
        this.data.IS_MAINTAIN_STOCK == false &&
        (this.data.RATIO_WITH_MAIN_STOCK == 0 ||
          this.data.RATIO_WITH_MAIN_STOCK == undefined)
      ) {
        this.isOk = false;
        this.message.error('Please Enter Ratio With Maintain Stock ', '');
      } else if (
        this.data.IS_MAINTAIN_STOCK == false &&
        (this.data.OPENING_STOCK == 0 || this.data.OPENING_STOCK == undefined)
      ) {
        this.isOk = false;
        this.message.error('Please Enter Opening Stock ', '');
      }
    }

    // --- START: Added Image Validation (from reference) ---
    // This assumes you have an 'IMAGE' property on 'this.data' and 'this.fileURL' for the selected file
    if (!this.data.ID) {
      // Creating a new record
      if (!this.fileURL) {
        this.isOk = false;
        this.message.error('Please Select Image', '');
      }
    } else {
      // Editing an existing record
      const isImgMissing = !this.data.VARIENT_IMAGE_URL || this.data.VARIENT_IMAGE_URL.trim() === '';
      const isFileNotSelected = !this.fileURL;

      if (isImgMissing && isFileNotSelected) {
        this.isOk = false;
        this.message.error('Please Select Image', '');
      }
    }
    // --- END: Added Image Validation ---

    if (this.isOk) {
      this.isSpinning = true;

      if (this.maintain == 1 && this.varient == 1) {
        if (this.data.IS_MAINTAIN_STOCK == false) {
          this.data.OPENING_STOCK = null;
        }
      } else if (this.maintain == 0 && this.varient == 1) {
        if (this.data.IS_MAINTAIN_STOCK == false) {
          this.data.OPENING_STOCK = null;
        }
      }

      // --- START: Added File Upload Logic (from reference) ---
      if (this.fileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL.name.split('.').pop();
        var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = d == null ? '' : d + number + '.' + fileExt;

        // This logic (from your reference) reuses the old filename if one exists
        if (this.data.VARIENT_IMAGE_URL != undefined && this.data.VARIENT_IMAGE_URL.trim() != '') {
          var arr = this.data.VARIENT_IMAGE_URL.split('/');
          if (arr.length > 1) {
            url = arr[5]; // Using arr[5] as per your reference
          }
        }

        this.api
          .onUpload('VarientImages', this.fileURL, url) // Changed folder to 'ProductImage'
          .subscribe((successCode: HttpEvent<any>) => {
            switch (successCode.type) {
              case HttpEventType.UploadProgress:
                break;
              case HttpEventType.Response:
                if (successCode.body['code'] == 200) {
                  this.data.VARIENT_IMAGE_URL = url; // Set the image name on the data object

                  // --- Original Save/Update logic is now nested ---
                  if (this.data.ID) {
                    this.api
                      .updateProductVarient(this.data)
                      .subscribe((successCode) => {
                        if (successCode.code == '200') {
                          this.message.success(
                            ' Information Updated Successfully...',
                            ''
                          );
                          if (!addNew) this.drawerClose();
                          this.isSpinning = false;
                        } else {
                          this.message.error(
                            ' Failed To Update Information...',
                            ''
                          );
                          this.isSpinning = false;
                        }
                      });
                  } else {
                    this.api
                      .createProductVarient(this.data)
                      .subscribe((successCode) => {
                        if (successCode.code == '200') {
                          this.message.success(
                            ' Information Save Successfully...',
                            ''
                          );
                          if (!addNew) this.drawerClose();
                          else {
                            this.data = new ProductMapping();
                            this.resetDrawer(websitebannerPage);
                            // Reset image fields as per reference
                            this.data.VARIENT_IMAGE_URL = '';
                            this.fileURL = '';
                          }
                          this.isSpinning = false;
                        } else {
                          this.message.error(
                            ' Failed To Save Information...',
                            ''
                          );
                          this.isSpinning = false;
                        }
                      });
                  }
                } else {
                  this.message.error(' Failed To Save Image...', '');
                  this.isSpinning = false;
                }
            }
          });
      } else if (this.data.VARIENT_IMAGE_URL == null || this.data.VARIENT_IMAGE_URL == '') {
        // This case should be caught by validation, but it's a safeguard from your reference
        this.message.error(' Please Select Image...', '');
        this.isSpinning = false;
      } else {
        // This block handles updates WHERE THE IMAGE IS NOT CHANGED
        // (i.e., this.fileURL is null, but this.data.IMAGE exists)
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
          // This block is for *create* but no file was selected.
          // The validation logic added above should prevent this,
          // but we include it to match the reference structure.
          this.api.createProductVarient(this.data).subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(' Information Save Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new ProductMapping();
                this.resetDrawer(websitebannerPage);
              }
              this.isSpinning = false;
            } else {
              this.message.error(' Failed To Save Information...', '');
              this.isSpinning = false;
            }
          });
        }
      }
      // --- END: Added File Upload Logic ---
    }
  }
  //Open social media link method
  open(link: any) {
    if (link != null || link != undefined) {
      window.open(link);
    }
  }
  fileURL: any;
  imgurl = appkeys.retriveimgUrl;
  today = new Date();
  dateFormat = 'dd-MM-yyyy';
  deleteCancel() {}
  //Choose Image
  imagePreviews;
 onFileSelected(event: any) {
  const file = event.target.files[0];

  // Reset preview and file before validation
  this.fileURL = null;
  this.imagePreviews = '';
  this.data.VARIENT_IMAGE_URL = '';

  if (!file) return;

  // ✅ File type validation
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!validTypes.includes(file.type)) {
    this.message.error('Select only JPEG, JPG, or PNG file', '');
    return;
  }

  // ✅ File size validation (<= 100 KB)
  const maxSizeKB = 40;
  const fileSizeKB = file.size / 1024;
  if (fileSizeKB > maxSizeKB) {
    this.message.error('File size should not exceed 40 KB', '');
    return;
  }

  // ✅ Read and validate image dimensions (<= 500x500)
  const reader = new FileReader();
  reader.onload = (e: any) => {
    const img = new Image();
    img.onload = () => {
      const width = img.width;
      const height = img.height;

      if (width !=500  && height != 500) {
        this.message.error('Image dimensions must be 500x500 pixels or less', '');
        this.fileURL = null;
        event.target.files=null
        this.imagePreviews = '';
        this.data.VARIENT_IMAGE_URL = '';
        return;
      }

      // ✅ Passed all validations
      this.fileURL = file;
      this.imagePreviews = e.target.result;
    };

    img.onerror = () => {
      event.target.files=null
      this.message.error('Invalid image file', '');
    };

    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
}


  removeImage() {
    this.data.VARIENT_IMAGE_URL = '';
    this.fileURL = '';
    this.imagePreviews = '';
  }
}
