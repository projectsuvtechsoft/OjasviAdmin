import { DatePipe } from '@angular/common';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { appkeys } from 'src/app/app.constant';
import { WebsiteBannerMaster } from 'src/app/Models/websitebannermaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-addwebsitebanner',
  templateUrl: './addwebsitebanner.component.html',
  styleUrls: ['./addwebsitebanner.component.css'],
  providers: [DatePipe],
})
export class AddwebsitebannerComponent implements OnInit {
  @Input()
  drawerClose!: Function;
  @Input()
  data: WebsiteBannerMaster = new WebsiteBannerMaster();
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk = true;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  imgurl= appkeys.retriveimgUrl;
  @Input() color:any;
  @Input() colort1:any;
  @Input() colort2:any;

  // namepatt=/^[a-zA-Z \-\']+/
  fileURL: any;
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    public datePipe: DatePipe
  ) {}
fullImageUrl
  ngOnInit(): void {
     if (
      this.data.ID != null &&
      this.data.ID != undefined &&
      this.data.IMG_URL != null &&
      this.data.IMG_URL != undefined &&
      this.data.IMG_URL != ' '
    ) {
      this.fullImageUrl =
        this.imgurl + 'websiteBanner/' + this.data.IMG_URL;
      // window.open(fullImageUrl, '_blank');
    } else {
      // this.message.info('Document Not Uploaded.', '');
    }
  }

  close(): void {
    this.drawerClose();
  }
 deleteCancel() {}
  resetDrawer(websitebannerPage: NgForm) {
    this.data=new WebsiteBannerMaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }

    //// Only number
omit(event:any) {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}
    ///// Allow only number and character
    numchar(event: any) {
      const charCode = event.which ? event.which : event.keyCode;
      if(charCode == 32)
      return true;
     if(48 <= charCode && charCode <= 57)
      return true;
     if(65 <= charCode && charCode <= 90)
      return true;
     if(97 <= charCode && charCode <= 122)
      return true;
    return false;
    }

    nonumchar(event: any) {
      const charCode = event.which ? event.which : event.keyCode;
      if(charCode == 32)
      return false;
     if(48 <= charCode && charCode <= 57)
      return false;
     if(65 <= charCode && charCode <= 90)
      return false;
     if(97 <= charCode && charCode <= 122)
      return false;
    return false;
    }
   
  //save
  save(addNew: boolean,websitebannerPage: NgForm): void {

    this.isSpinning = false;
    this.isOk = true;
    this.data.COLOR_CODE_NAME =this.color;
    this.data.COLOR_CODE_T1 =this.colort1;
    // this.data.COLOR_CODE_T2 =this.colort2;

    if (
      // this.data.NAME.trim() == '' &&
      // this.data.NAME_MR.trim() == '' &&
      // this.data.COLOR_CODE_NAME == null &&
      // this.data.SUB_TITLE.trim() == '' &&
      // this.data.SUB_TITLE_MR.trim() == '' &&
      // this.data.COLOR_CODE_T1 == null &&
      // this.data.SUB_TITLE2.trim() == '' &&
      // this.data.SUB_TITLE2_MR.trim() == '' &&
      // this.data.COLOR_CODE_T2 == null &&
      (this.data.SEQUENCE_NO == undefined || this.data.SEQUENCE_NO == null || this.data.SEQUENCE_NO == 0) &&
     ( this.data.IMG_URL.trim() == '' ||  !this.data.IMG_URL || this.data.IMG_URL== null ||this.data.IMG_URL == undefined)
    ) {
      this.isOk = false;
      this.message.error(' Please Fill All Required Fields', '');

    } 
    // else if (this.data.NAME == null || this.data.NAME.trim() == '') {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Banner Name', '');
    // } else if (!this.namepatt.test(this.data.NAME)) {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Valid Banner Name', '');

    // } 
    // else if (this.data.NAME_MR == null || this.data.NAME_MR.trim() == '') {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Banner Name (Marathi)', '');

    // } 
    // else if (this.data.COLOR_CODE_NAME == null || this.data.COLOR_CODE_NAME.trim() == '') {
    //   this.isOk = false;
    //   this.message.error(' Please Select Banner Color', '');

    // } else if (this.data.SUB_TITLE == null || this.data.SUB_TITLE.trim() == '') {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Sub Title', '');
    // } else if (!this.namepatt.test(this.data.SUB_TITLE)) {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Valid Sub Title', '');

    // } 
    // else if (this.data.SUB_TITLE_MR == null || this.data.SUB_TITLE_MR.trim() == '') {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Sub Title (Marathi)', '');

    // } 
    // else if (this.data.COLOR_CODE_T1 == null || this.data.COLOR_CODE_T1.trim() == '') {
    //   this.isOk = false;
    //   this.message.error(' Please Select Sub Title Color', '');

    // } else if (this.data.SUB_TITLE2 == null || this.data.SUB_TITLE2.trim() == '') {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Sub Title2', '');
    // } else if (!this.namepatt.test(this.data.SUB_TITLE2)) {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Valid Sub Title2', '');

    // } 
    // else if (this.data.SUB_TITLE2_MR == null || this.data.SUB_TITLE2_MR.trim() == '') {
    //   this.isOk = false;
    //   this.message.error(' Please Enter Sub Title2 (Marathi)', '');

    // } 
    // else if (this.data.COLOR_CODE_T2 == null || this.data.COLOR_CODE_T2.trim() == '') {
    //   this.isOk = false;
    //   this.message.error(' Please Select Sub Title2 Color', '');
    //   // } else
    //   // if (!this.namepatt.test(this.data.NAME_MR)) {
    //   //   this.isOk = false;
    //   //   this.message.error('Please Enter Valid Marathi Name', '');
    // }
     else if (this.data.SEQUENCE_NO == null || this.data.SEQUENCE_NO <= 0) {
      this.isOk = false;
      this.message.error(' Please Enter Sequence Number', '');
    }
     if (!this.data.ID) {
  if (!this.fileURL) {
    this.isOk = false;
    this.message.error('Please Select Image', '');
  }
} else {
  const isImgMissing = !this.data.IMG_URL || this.data.IMG_URL.trim() === '';
  const isFileNotSelected = !this.fileURL;

  if (isImgMissing && isFileNotSelected) {
    this.isOk = false;
    this.message.error('Please Select Image', '');
  }
}

    if (this.isOk) { 
      //  this.isSpinning=false;
    //   this.data.COLOR_CODE=this.color
      this.isSpinning = true;
 this.api.getAllwebsiteBanner(0, 0, '', 'desc', '').subscribe(
    (allData: any) => {
      const banner = allData?.data || [];

      const nameExists = banner.some(
        (s: any) =>
          s.NAME.trim().toLowerCase() === this.data.NAME.trim().toLowerCase() &&
          s.ID !== this.data.ID
      );

     const subtitle = banner.some(
        (s: any) =>
          s.SUB_TITLE.trim().toLowerCase() === this.data.SUB_TITLE.trim().toLowerCase() &&
          s.ID !== this.data.ID
      );

      const sequenceExists = banner.some(
        (s: any) =>
          Number(s.SEQUENCE_NO) === Number(this.data.SEQUENCE_NO) &&
          s.ID !== this.data.ID
      );

      if (nameExists) {
        this.message.error('Banner name already exists', '');
        this.isSpinning = false;
        return;
      }
    if (subtitle) {
        this.message.error('Sub Title  already exists', '');
        this.isSpinning = false;
        return;
      }
      if (sequenceExists) {
        this.message.error('Sequence number already exists', '');
        this.isSpinning = false;
        return;
      }

      {
        if (this.fileURL != null) {
          var number = Math.floor(100000 + Math.random() * 900000);
          var fileExt = this.fileURL.name.split('.').pop();
          var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
          var url = '';
          url = d == null ? '' : d + number + '.' + fileExt;
          if (
            this.data.IMG_URL != undefined &&
            this.data.IMG_URL.trim() != '' 
          ) {
            var arr = this.data.IMG_URL.split('/');
            if (arr.length > 1) {
              url = arr[5];
            }
          }
          this.api
            .onUpload('websiteBanner', this.fileURL, url)
            .subscribe((successCode: HttpEvent<any>) => {
             switch (successCode.type) {
            case HttpEventType.UploadProgress:
             
              break;
            case HttpEventType.Response:
              if (successCode.body['code'] === 200) {
                this.data.IMG_URL = url;
                // appkeys.retriveimgUrl + 'websiteBanner/' + url;
                if (this.data.ID) {
                  this.api
                    .updatewebsiteBanner(this.data)
                    .subscribe((successCode) => {
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
                    .createwebsiteBanner(this.data)
                    .subscribe((successCode) => {
                      if (successCode.code == '200') {
                        this.message.success(' Information Save Successfully...', '');
                        if (!addNew) this.drawerClose();
                        else {
                          this.data = new WebsiteBannerMaster();
                          this.resetDrawer(websitebannerPage);
                          this.color=""
                          this.colort2=""
                          this.colort1=""
                          this.data.STATUS==true;
                          // this.data.IMG_URL==null;
                          this.fileURL='';
                          this.api.getAllwebsiteBanner(1,1,'SEQUENCE_NO','desc','').subscribe (data =>{
                            if (data['count']==0){
                              this.data.SEQUENCE_NO=1;
                            }else
                            {
                              this.data.SEQUENCE_NO=data['data'][0]['SEQUENCE_NO']+1;
                            }
                          },err=>{
                            console.log(err);
                          })
                        }
                        this.isSpinning = false;
                      } else {
                        this.message.error(' Failed To Save Information...', '');
                        this.isSpinning = false;
                      }
                    });
                }
              } else {
                this.message.error(" Failed To Save Image...", "");
                this.isSpinning = false;
              }}
            });
        } else if (this.data.IMG_URL == null || this.data.IMG_URL == '') {
          this.message.error(' Please select image...', '');
          this.isSpinning = false;
        } else {
          if (this.data.ID) {
            this.api.updatewebsiteBanner(this.data).subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success(" Information Updated Successfully...", "");
                if (!addNew) this.drawerClose();
                this.isSpinning = false;
              } else {
                this.message.error(" Failed To Update Information...", "");
                this.isSpinning = false;
              }
            });
          } else {
            this.api.createwebsiteBanner(this.data).subscribe((successCode) => {
              if (successCode.code == '200') {
                this.message.success(" Information Save Successfully...", "");
                if (!addNew) this.drawerClose();
                else {
                  this.color=""
                  this.colort2=""
                  this.colort1=""
                this.resetDrawer(websitebannerPage);
                this.data = new WebsiteBannerMaster();
                }
                this.isSpinning = false;
              } else {
                this.message.error(" Failed To Save Information...", "");
                this.isSpinning = false;
              }
            });
          }
        }
      }
         },
    () => {
      this.message.error('Something went wrong, please try again later', '');
      this.isSpinning = false;
    }
  );
    }

    //  else
    //  {
    //    this.message.error("Please Fill All Required Fields...","");
    //    this.isSpinning = false;

    //  }
  }
  ////
  ////
  //Choose image
  imagePreviews
//  onFileSelected(event: any) {
//   const file = event.target.files[0];

//   if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png')) {
//     this.fileURL = file;

//     const reader = new FileReader();
//     reader.onload = (e: any) => {
//       this.imagePreviews = e.target.result; // Assign string to bind to <img>
//     };
//     reader.readAsDataURL(file); // Don’t forget to call this!
//   } else {
//     this.message.error("Select only JPEG/ JPG/ PNG file", "");
//     this.fileURL = null;
//     this.data.IMG_URL = '';
//     this.imagePreviews = '';
//   }
// }
onFileSelected(event: any) {
  const file = event.target.files[0];

  if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png')) {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        if (img.width === 1920 && img.height === 600) {
          this.fileURL = file;
          this.imagePreviews = e.target.result; // Assign string to bind to <img>
        } else {
          this.message.error("Image must be exactly 1920px width and 600px height.", "");
          this.fileURL = null;
          this.data.IMG_URL = '';
          this.imagePreviews = '';
        }
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(file); // Don't forget to call this!
  } else {
    this.message.error("Select only JPEG/ JPG/ PNG file", "");
    this.fileURL = null;
    this.data.IMG_URL = '';
    this.imagePreviews = '';
  }
}

  removeImage() {
    this.data.IMG_URL='';
    this.fileURL='';   
    this.imagePreviews='';    
  }
}
