import { DatePipe } from '@angular/common';
import { Component, enableProdMode, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CategoryMaster } from 'src/app/Models/categorymaster';
import { packagingcharges } from 'src/app/Models/packagingcharges';
import { ProductMaster } from 'src/app/Models/productmaster';
import { UnitMaster } from 'src/app/Models/unitmaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrls: ['./addproduct.component.css'],
})
export class AddproductComponent implements OnInit {
  // #temp
  // @Input()
  // datadata: packagingcharges = new packagingcharges();

  @Input()
  drawerClose!: Function;
  @Input()
  data: ProductMaster = new ProductMaster();
  @Input()
  drawerVisible: boolean = false;
  @Input() multipleImages: any = [];
  isSpinning = false;
  isOk = true;
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // namepatt=/^[a-zA-Z \-\']+/
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  mobpattern = /^[6-9]\d{9}$/;
  uniquecode = /^[a-zA-Z\d\-\_]+$/;
  openingdate = new Date();
  category: CategoryMaster[] = [];
  // acctype:AccountTypeMaster[]=[];
  // accgroup:AccountGroupMaster[]=[];

  selected: any;
  @Input()
  disabled: any;

  current = new Date();
  dateFormat = 'dd-MM-yyyy';
  parentaccount: any;
  parentgroup: any;
  parenttype: any;
  type: any;
  group: any;
  main: any;
  cgst: any;
  sgst: any;
  fileURL1: any = null;
  imageSrc1: any;
  folderName = 'productImages';
  uploadedAttachmentStr1: string = '';
  units: UnitMaster[] = [];
  imagecount: number = 0;
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    // console.log(this.data.UNIT_ID,"this.data.UNIT_ID");
    this.loadcategory();
    this.loadunit();

    this.disabled;
    console.log('true' + this.disabled);

    // this.loadaccgroup();
  }

  //category master
  loadcategory() {
    this.api.getAllCategoryMaster(0, 0, '', '', ' AND STATUS=1').subscribe(
      (data) => {
        this.category = data['data'];
      },
      (err) => {
        console.log(err);
        this.isSpinning = false;
      }
    );
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
  //  // account type
  //  loadacctype(){
  //   this.api.getAllaccountType(0,0,'','',' AND STATUS=1').subscribe(data =>{
  //     this.acctype=data['data'];
  //   },err => {
  //     console.log(err);
  //     this.isSpinning=false;
  //   });
  // }

  //  // account type
  //  loadaccgroup(){
  //   this.api.getAllaccountGroup(0,0,'','',' AND STATUS=1').subscribe(data =>{
  //     this.accgroup=data['data'];
  //   },err => {
  //     console.log(err);
  //     this.isSpinning=false;
  //   });
  // }

  ///
  close(): void {
    this.drawerClose();
  }

  ///Allow only characters
  alphaOnly(event: any) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (
      charCode > 32 &&
      (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122)
    ) {
      return false;
    }
    return true;
  }

  //// Only number and dot
  onlynumdot(event: any) {
    console.log(event);

    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 46 || charCode > 57)) {
      return false;
    }
    return true;
  }

  //// Only number
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  ///// Allow only number and character
  numchar(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode == 32) return true;
    if (48 <= charCode && charCode <= 57) return true;
    if (65 <= charCode && charCode <= 90) return true;
    if (97 <= charCode && charCode <= 122) return true;
    return false;
  }

  resetDrawer(websitebannerPage: NgForm) {
    this.data = new ProductMaster();
    // this.data.PARENT_ACCOUNT_ID=this.parentaccount;
    // this.data.GROUP_ID=this.parentgroup;
    // this.data.TYPE_ID=this.parenttype;
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
  value: any;
  calculateIGST() {
    this.value = Number(this.data.CGST) + Number(this.data.SGST);
    this.data.IGST = this.value;
  }
  changevarient(event: any) {
    if (this.data.IS_VERIENT_AVAILABLE == true) {
      this.data.IN_COUNTRY == null;
      this.data.OUT_COUNTRY == null;
      console.log(this.data.IN_COUNTRY, 'this.data.IN_COUNTRY');
      console.log(this.data.OUT_COUNTRY, 'this.data.IN_COUNTRY');
    }
  }

  //save
  save(addNew: boolean, websitebannerPage: NgForm): void {
    console.log(this.data.UNIT_ID, 'this.data.UNIT_ID');
    console.log('data data ', this.data);
    console.log(this.data.OPENING_STOCK);

    // console.log('PRICE2:',this.data.PRICE2);
    // console.log('SIZE2:',this.data.SIZE2);
    // console.log('UNIT_ID2:',this.data.UNIT_ID2);
    // console.log('PRICE3:',this.data.PRICE3);
    // console.log('SIZE3:',this.data.SIZE3);
    // console.log('UNIT_ID3:',this.data.UNIT_ID3);
    // console.log('PRICE4:',this.data.PRICE4);
    // console.log('SIZE4:',this.data.SIZE4);
    // console.log('UNIT_ID4:',this.data.UNIT_ID4);

    console.log(this.multipleImages.length);
    this.imagecount = this.multipleImages.length;
    // console.log('Count::::',this.imagecount);

    this.isSpinning = false;
    this.isOk = true;

    if (
      this.data.CATEGORY_ID == 0 &&
      this.data.NAME.trim() == '' &&
      this.data.NAME_MR.trim() == '' &&
      this.data.UNIQUE_CODE.trim() == '' &&
      // this.data.UNIT_ID == 0 &&

      // this.data.PRICE1 == 0 &&
      // this.data.SIZE1 == 0 &&

      // this.data.GST_TYPE == 0 &&
      // this.data.CGST == 0 &&
      // this.data.SGST == 0 &&
      // this.data.IGST == 0 &&

      // this.data.RATE == 0 &&
      // this.data.SIZE == 0   &&
      this.data.DESCRIPTION.trim() == '' &&
      this.data.DESCRIPTION_MR.trim() == ''
      //  &&

      // this.multipleImages.length == 0
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields', '');
    } else if (
      this.data.CATEGORY_ID == undefined ||
      this.data.CATEGORY_ID <= 0
    ) {
      this.isOk = false;
      this.message.error('Please Select Category', '');
    } else if (this.data.NAME == null || this.data.NAME.trim() == '') {
      this.isOk = false;
      this.message.error(' Please Enter Product Name(English)', '');
    } else if (this.data.NAME_MR == null || this.data.NAME_MR.trim() == '') {
      this.isOk = false;
      this.message.error(' Please Enter Product Name(Marathi)', '');
    } else if (
      this.data.UNIQUE_CODE == null ||
      this.data.UNIQUE_CODE.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Unique Code ', '');
    }

    //else if (this.data.PRICE1 == undefined || this.data.PRICE1 <= 0) {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Price 1', '');
    // }
    //else if (this.data.SIZE1 == undefined || this.data.SIZE1 <= 0) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Quantity 1 ', '');
    // } else if (this.data.UNIT_ID1 == undefined || this.data.UNIT_ID1 <= 0) {
    //   this.isOk = false;
    //   this.message.error(' Please Select Unit 1', '');
    // } else if (this.data.GST_TYPE == undefined || this.data.GST_TYPE <= 0) {
    //   this.isOk = false;
    //   this.message.error(' Please select GST Type ', '');
    // } else if (this.data.CGST == undefined || this.data.CGST <= 0) {
    //   this.isOk = false;
    //   this.message.error('Please Enter CGST', '');
    // } else if (this.data.SGST == undefined || this.data.SGST <= 0) {
    //   this.isOk = false;
    //   this.message.error('Please Enter SGST', '');
    // } else if (this.data.IGST == undefined || this.data.IGST <= 0) {
    //   this.isOk = false;
    //   this.message.error('Please Enter IGST', '');
    //}
    // else if (
    //   this.data.DISCOUNT_TYPE == undefined ||
    //   this.data.DISCOUNT_TYPE <= 0
    // )
    //  {
    //   this.isOk = false;
    //   this.message.error(' Please Select Discount Type ', '');
    // }
    // else if (this.data.DISCOUNT == undefined || this.data.DISCOUNT <= 0) {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Discount ', '');
    // }

    // else if (this.data.UNIT_ID == undefined || this.data.UNIT_ID <= 0) {
    //   this.isOk = false;
    //   this.message.error(' Please Select Unit ', '');

    // }
    else if (
      this.data.IS_VERIENT_AVAILABLE == false &&
      this.data.IN_COUNTRY == undefined
    ) {
      this.isOk = false;
      this.message.error(
        'Please Enter Correct In Country Packaging Charges ',
        ''
      );
    } else if (
      this.data.IS_VERIENT_AVAILABLE == false &&
      this.data.OUT_COUNTRY == undefined
    ) {
      this.isOk = false;
      this.message.error(
        'Please Enter Correct Out Country Packaging charges  ',
        ''
      );
    } else if (
      this.data.IS_MAINTAIN_STOCK == false &&
      this.data.IS_VERIENT_AVAILABLE == false &&
      (this.data.SIZE == undefined || this.data.SIZE <= 0)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Base Size ', '');
    } else if (
      this.data.IS_MAINTAIN_STOCK == false &&
      this.data.IS_VERIENT_AVAILABLE == false &&
      (this.data.RATE == undefined || this.data.RATE <= 0)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Base Rate ', '');
    } else if (
      this.data.IS_MAINTAIN_STOCK == false &&
      this.data.IS_VERIENT_AVAILABLE == false &&
      (this.data.UNIT_ID == undefined || this.data.UNIT_ID <= 0)
    ) {
      this.isOk = false;
      this.message.error('Please Select Base Unit ', '');
    }

    // false true
    else if (
      this.data.IS_MAINTAIN_STOCK == true &&
      this.data.IS_VERIENT_AVAILABLE == false &&
      (this.data.SIZE == undefined || this.data.SIZE <= 0)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Base Size ', '');
    } else if (
      this.data.IS_MAINTAIN_STOCK == true &&
      this.data.IS_VERIENT_AVAILABLE == false &&
      (this.data.RATE == undefined || this.data.RATE <= 0)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Base Rate ', '');
    } else if (
      this.data.IS_MAINTAIN_STOCK == true &&
      this.data.IS_VERIENT_AVAILABLE == false &&
      (this.data.UNIT_ID == undefined || this.data.UNIT_ID <= 0)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Base Unit ', '');
    } else if (
      this.data.IS_MAINTAIN_STOCK == true &&
      this.data.IS_VERIENT_AVAILABLE == true &&
      (this.data.UNIT_ID == undefined || this.data.UNIT_ID <= 0)
    ) {
      this.isOk = false;
      this.message.error('Please Enter Base Unit ', '');
    } else if (
      this.data.DESCRIPTION == null ||
      this.data.DESCRIPTION.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Description(English) ', '');
    } else if (
      this.data.DESCRIPTION_MR == null ||
      this.data.DESCRIPTION_MR.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Description(Marathi) ', '');
    } else if (this.multipleImages.length == 0) {
      this.isOk = false;
      this.message.error(' Please Select Image ', '');
    } else if (this.multipleImages.length > 4) {
      this.isOk = false;
      this.message.error(' Please Select Only 4 Images ', '');
    } else this.cgst = this.data.CGST;
    this.sgst = this.data.SGST;

    if (this.isOk) {
      this.isSpinning = true;
      if (
        this.data.PRICE2.toString() == '' ||
        this.data.PRICE2 == undefined ||
        this.data.PRICE2 == null
      ) {
        this.data.PRICE2 = 0;
      } else if (
        this.data.SIZE2.toString() == '' ||
        this.data.SIZE2 == undefined ||
        this.data.SIZE2 == null
      ) {
        this.data.SIZE2 = 0;
      } else if (
        this.data.PRICE3.toString() == '' ||
        this.data.PRICE3 == undefined ||
        this.data.PRICE3 == null
      ) {
        this.data.PRICE3 = 0;
      } else if (
        this.data.SIZE3.toString() == '' ||
        this.data.SIZE3 == undefined ||
        this.data.SIZE3 == null
      ) {
        this.data.SIZE3 = 0;
      } else if (
        this.data.PRICE4.toString() == '' ||
        this.data.PRICE4 == undefined ||
        this.data.PRICE4 == null
      ) {
        this.data.PRICE4 = 0;
      } else if (
        this.data.SIZE4.toString() == '' ||
        this.data.SIZE4 == undefined ||
        this.data.SIZE4 == null
      ) {
        this.data.SIZE4 = 0;
      }

      // if (this.data.IS_MAINTAIN_STOCK == false && (this.data.OPENING_STOCK == null || this.data.OPENING_STOCK == undefined || this.data.OPENING_STOCK > 0)) {
      //   this.data.OPENING_STOCK = 0
      // }
      // else

      if (
        this.data.IS_MAINTAIN_STOCK == false &&
        this.data.IS_VERIENT_AVAILABLE == false
      ) {
        this.data.CURRENT_STOCK == null;
        this.data.OPENING_STOCK == null;
      } else if (this.data.IS_VERIENT_AVAILABLE == true) {
        this.data.IN_COUNTRY = 0;
        this.data.OUT_COUNTRY = 0;
      }

      // if (this.data.IS_MAINTAIN_STOCK == false && (this.data.CURRENT_STOCK == null || this.data.CURRENT_STOCK == undefined || this.data.CURRENT_STOCK > 0)) {
      //   this.data.CURRENT_STOCK = 0
      // } else{
      // }

      // this.data.PRICE2 = this.data.PRICE2
      // this.data.PRICE3 = this.data.PRICE3
      // this.data.PRICE3 = this.data.PRICE3
      // this.data.SIZE2 = this.data.SIZE2
      // this.data.SIZE3 = this.data.SIZE3
      // this.data.SIZE4 = this.data.SIZE4
      // this.data.UNIT_ID2 = this.data.UNIT_ID2
      // this.data.UNIT_ID3 = this.data.UNIT_ID3
      // this.data.UNIT_ID4 = this.data.UNIT_ID4
      this.imageUpload1();
      this.data.imageData = this.multipleImages;
      if (this.data.ID) {
        this.api.updateProductMaster(this.data).subscribe((successCode) => {
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
        this.api
          .createProductMaster(this.data)
          // this.type=.TYPE_ID
          .subscribe((successCode) => {
            if (successCode.code == '200') {
              this.message.success(' Information Save Successfully...', '');
              if (!addNew) this.drawerClose();
              else {
                this.data = new ProductMaster();
                this.resetDrawer(websitebannerPage);
                this.multipleImages = [];
                this.api.getAllProductMaster(1, 1, '', 'desc', '').subscribe(
                  (data) => {
                    // if (data['count']==0){
                    //   this.data.SEQUENCE_NO=1;
                    // }else
                    // {
                    //   this.data.SEQUENCE_NO=data['data'][0]['SEQUENCE_NO']+1;
                    // }
                  },
                  (err) => {
                    console.log(err);
                  }
                );
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
  ///////// Multiple Photo Save /////////
  onFileSelected1(event: any) {
    console.log('Event', event);
    this.imagecount = Number(this.multipleImages.length) + 1;
    console.log('Count===', this.imagecount);

    if (
      event.target.files[0].type == 'image/jpeg' ||
      event.target.files[0].type == 'image/jpg' ||
      event.target.files[0].type == 'image/png'
    ) {
      if (
        Number(
          parseFloat(String(event.target.files[0].size / 1024 / 1024)).toFixed(
            0
          )
        ) <= 1
      ) {
        this.fileURL1 = <File>event.target.files[0];

        const reader = new FileReader();
        if (event.target.files && event.target.files.length) {
          const [file] = event.target.files;
          reader.readAsDataURL(file);

          reader.onload = () => {
            this.imageSrc1 = reader.result as string;

            var obj1: any = new Object();
            obj1['ImgSrc'] = this.imageSrc1;
            obj1['PHOTO_SEQ_NO'] = 0;
            obj1['File'] = <File>event.target.files[0];
            obj1['PHOTO_URL'] = '';
            this.multipleImages.push(obj1);

            console.log('onFileSelected1', this.multipleImages);
          };
        }
      } else {
        this.fileURL1 = null;
        this.message.error(
          "File Size Must Be Less Than Or Equal To '1 MB'",
          ''
        );
      }
    } else {
      this.message.error('Please Select Only JPEG/ JPG/ PNG File', '');
      this.fileURL1 = null;
    }
  }

  deleteImage(img: any, i: any) {
    this.imagecount = this.multipleImages.length - 1;
    console.log('Count:::::', this.imagecount);
    this.multipleImages.splice(i, 1);

    this.fileURL1 = null;
    this.imageSrc1 = null;
  }
  cancel() {}
  onImageSelected(imagePath: any) {
    window.open(imagePath);
  }

  imageUpload1() {
    for (var i = 0; i < this.multipleImages.length; i++) {
      this.uploadedAttachmentStr1 = '';

      if (this.multipleImages[i]['File'] != '') {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.multipleImages[i]['File'].name.split('.').pop();
        var url = 'PI' + number + '.' + fileExt;
        console.log('Folder=', this.folderName);
        this.api
          .onUpload(this.folderName, this.multipleImages[i]['File'], url)
          .subscribe((res) => {
            if (res['code'] == 200) {
              console.log('Uploaded');
            } else {
              console.log('Not Uploaded');
            }
          });

        this.uploadedAttachmentStr1 = url;
        this.multipleImages[i]['PHOTO_URL'] = this.uploadedAttachmentStr1;
        this.multipleImages[i]['PHOTO_SEQ_NO'] = i + 1;
      } else {
        this.multipleImages[i]['PHOTO_URL'] =
          this.multipleImages[i]['PHOTO_URL'];
        this.multipleImages[i]['PHOTO_SEQ_NO'] = i + 1;
      }
    }

    console.log('imageUpload1', this.multipleImages);
  }

  //  check(){
  //   var imgpath=document.getElementById(this.multipleImages);
  //   if (!imgpath.value==""){
  //     var img=imgpath.files[0].size;
  //     var imgsize=img/1024;
  //     alert(imgsize);
  //   }
  // }
}
