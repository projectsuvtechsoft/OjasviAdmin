import { DatePipe } from '@angular/common';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { appkeys } from 'src/app/app.constant';
import { AboutMaster } from 'src/app/Models/aboutmaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-addaboutmaster',
  templateUrl: './addaboutmaster.component.html',
  styleUrls: ['./addaboutmaster.component.css']
})
export class AddaboutmasterComponent implements OnInit {

  @Input()
  drawerClose!: Function;
  @Input()
  data: AboutMaster = new AboutMaster;
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk=true;
  emailpattern=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  // namepatt=/^[a-zA-Z \-\']+/
  namepatt=/[a-zA-Z][a-zA-Z ]+/
  mobpattern=/^[6-9]\d{9}$/
  fileURL:any;
  // albume:AlbumeMaster[]=[]
  imgurl= appkeys.retriveimgUrl;


  constructor(private api:ApiServiceService, private message: NzNotificationService , private datePipe:DatePipe) { }

  ngOnInit(): void {
    // this.loadalbume();
  }
 

  close(): void {
    this.drawerClose(); 
  }
  resetDrawer(websitebannerPage: NgForm) {
    this.data=new AboutMaster();
    // websitebannerPage.form.reset();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
  //// Only number
  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  //save
  save(addNew:boolean,websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk=true;

    if (this.data.TITLE.trim() == "" && this.data.TITLE_MR.trim() == "" 
       && this.data.TEXT.trim()==""  &&this.data.TEXT_MR.trim()=="" 
       && this.data.SEQUENCE_NO!=undefined && this.data.IMG_URL.trim()== "") 
     {
      this.isOk =false
     this.message.error(" Please Fill All Required Fields", "");
   }else
   if(this.data.TITLE== null || this.data.TITLE.trim()==''){
    this.isOk =false
    this.message.error(' Please Enter Title','')

  }
  // else
  // if(this.data.TITLE_MR== null || this.data.TITLE_MR.trim()==''){
  //  this.isOk =false
  //  this.message.error(' Please Enter Title (Marathi)','')

  // }
  else
  if(this.data.TEXT== null || this.data.TEXT.trim()==''){
   this.isOk =false
   this.message.error(' Please Enter Description','')

  }
  // else
  // if(this.data.TEXT_MR== null || this.data.TEXT_MR.trim()==''){
  //  this.isOk =false
  //  this.message.error(' Please Enter Description (Marathi)','')

  // }
  else 

  if(this.data.SEQUENCE_NO== undefined || this.data.SEQUENCE_NO<=0){
    this.isOk =false
    this.message.error(' Please Enter Sequence Number ','')
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
  if(this.isOk)
  {
    // this.isSpinning=false; 

    this.isSpinning=true; 
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
        .onUpload('aboutusImage', this.fileURL, url)
        .subscribe((successCode: HttpEvent<any>) => {
                      console.log('Upload response:', successCode);
                     switch (successCode.type) {
                    case HttpEventType.UploadProgress:
                     
                      break;
                    case HttpEventType.Response:
          if (successCode.body['code'] ==200) {
            this.data.IMG_URL =url
              if (this.data.ID) {
                this.api.updateAboutMaster(this.data).subscribe((successCode) => {
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
                this.api.createAboutMaster(this.data).subscribe((successCode) => {
                  if (successCode.code == '200') {
                    this.message.success(' Information Save Successfully...', '');
                    if (!addNew) this.drawerClose();
                    else {
                      this.data = new AboutMaster();
                      this.resetDrawer(websitebannerPage);
                      this.data.IMG_URL= '';
                      this.fileURL=''
                      
                      
                      this.api.getAboutMaster(1,1,'SEQUENCE_NO','desc','').subscribe (data =>{
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
            this.message.error(' Failed To Save Image...', '');
            this.isSpinning = false;
          }}
        });
    } else if(this.data.IMG_URL == null || this.data.IMG_URL == ''){
      this.message.error(' Please Select Image...', '');
            this.isSpinning = false;
    }else{
      if (this.data.ID) {
        this.api.updateAboutMaster(this.data).subscribe((successCode) => {
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
        this.api.createAboutMaster(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(' Information Save Successfully...', '');
            if (!addNew) this.drawerClose();
            else {
              this.data = new AboutMaster();
            }
            this.isSpinning = false;
          } else {
            this.message.error(' Failed To Save Information...', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }
  }
  //Choose Image
  imagePreviews
 onFileSelected(event: any) {
  const file = event.target.files[0];

  if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png')) {
    this.fileURL = file;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreviews = e.target.result; // Assign string to bind to <img>
    };
    reader.readAsDataURL(file); // Don’t forget to call this!
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
  deleteCancel(){}
}
