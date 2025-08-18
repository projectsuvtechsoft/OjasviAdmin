import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { appkeys } from 'src/app/app.constant';
import { BlogMaster } from 'src/app/Models/blogmaster';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { IngredientMaster } from 'src/app/Models/ingredients';
@Component({
  selector: 'app-addingredients',
  templateUrl: './addingredients.component.html',
  styleUrls: ['./addingredients.component.css']
})
export class AddingredientsComponent {
@Input()
  drawerClose!: Function;
  @Input()
  data: IngredientMaster = new IngredientMaster;
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk=true;
  emailpattern=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  // namepatt=/^[a-zA-Z \-\']+/
  namepatt=/[a-zA-Z][a-zA-Z ]+/
  mobpattern=/^[6-9]\d{9}$/
  fileURL:any;
  imgurl= appkeys.retriveimgUrl;
  today = new Date();
  dateFormat = 'dd-MM-yyyy'; 

  constructor(private api:ApiServiceService, private message: NzNotificationService , private datePipe:DatePipe) { }

  ngOnInit(): void {
  
  }  

  //// Only number
omit(event:any) {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
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

  close(): void {
    this.drawerClose(); 
  }
  resetDrawer(websitebannerPage: NgForm) {
    this.data=new IngredientMaster();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
     //Disable date
     disabledDate = (current: Date): boolean =>
     differenceInCalendarDays(current, this.today) > 0;

  //save
  save(addNew: boolean,websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk=true;

    if ( this.data.NAME.trim() == ""  &&
        this.data.LOGO.trim()== ""
         && this.data.DESCRIPTION.trim() == ""  )  {
      this.isOk =false
      this.message.error(" Please Fill All Required Fields", "");

   }else
   if(this.data.NAME== null || this.data.NAME.trim()==''){
    this.isOk =false
    this.message.error(' Please Enter Name ','')

  }
 
 


  else

  if(this.data.DESCRIPTION== null || this.data.DESCRIPTION.trim()==''){
   this.isOk =false
   this.message.error(' Please Enter Description ','')
  }
     if (!this.data.ID) {
  if (!this.fileURL) {
    this.isOk = false;
    this.message.error('Please Select Image', '');
  }
} else {
  const isImgMissing = !this.data.LOGO || this.data.LOGO.trim() === '';
  const isFileNotSelected = !this.fileURL;

  if (isImgMissing && isFileNotSelected) {
    this.isOk = false;
    this.message.error('Please Select Image', '');
  }
}
  // else

  // if(this.data.DESCRIPTION_MR== null || this.data.DESCRIPTION_MR.trim()==''){
  //  this.isOk =false
  //  this.message.error(' Please Enter Description(Marathi) ','')
  // }
  if(this.isOk)
  {
    // this.isSpinning=false; 

    this.isSpinning=true; 

    if (this.fileURL != null) {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.fileURL.name.split('.').pop();
      var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
      var url = '';
      url = (d == null )? '' : d + number + '.' + fileExt;
      if (
        this.data.LOGO != undefined &&
        this.data.LOGO.trim() != ''
      ) {
        var arr = this.data.LOGO.split('/');
        if (arr.length > 1) {
          url = arr[5];
        }
      }
      console.log(url)
      console.log('FileUrl=',this.fileURL)

      this.api
        .onUpload('ingredientLogo ', this.fileURL, url)
        .subscribe((successCode: HttpEvent<any>) => {
                      console.log('Upload response:', successCode);
                     switch (successCode.type) {
                    case HttpEventType.UploadProgress:
                     
                      break;
                    case HttpEventType.Response:
          if (successCode.body['code'] ==200) {
            this.data.LOGO =url
              if (this.data.ID) {
                this.api.updateIngredientMaster(this.data).subscribe((successCode) => {
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
                this.api.createIngredientMaster(this.data).subscribe((successCode) => {
                  if (successCode.code == '200') {
                    this.message.success(" Information Save Successfully...", "");
                    if (!addNew) this.drawerClose();
                    else {
                      this.data = new IngredientMaster();
                            this.resetDrawer(websitebannerPage);
                      this.data.LOGO= '';
                      this.fileURL = '';                      
                      // this.api.getAllIngredientMaster(1,1,'SEQUENCE_NO','desc','').subscribe (data =>{
                      //   if (data['count']==0){
                      //     this.data.SEQUENCE_NO=1;
                      //   }else
                      //   {
                      //     this.data.SEQUENCE_NO=data['data'][0]['SEQUENCE_NO']+1;
                      //   }
                      // },err=>{
                      //   console.log(err);
                      // })
                    }
                    this.isSpinning = false;
                  } else {
                    this.message.error(" Failed To Save Information...", "");
                    this.isSpinning = false;
                  }
                });
              }
          } else {
            this.message.error(" Failed To Save Image...", "");
            this.isSpinning = false;
          }}
        });
    } else if(this.data.LOGO == null || this.data.LOGO == ''){
      this.message.error(' Please Select Image...', '');
            this.isSpinning = false;
    }else{
      if (this.data.ID) {
        this.api.updateIngredientMaster(this.data).subscribe((successCode) => {
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
        this.api.createIngredientMaster(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success(" Information Save Successfully...", "");
            if (!addNew) this.drawerClose();
            else {
              this.data = new IngredientMaster();
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

  }
  deleteCancel(){}
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
    this.data.LOGO = '';
    this.imagePreviews = '';
  }
}

  removeImage() {
    this.data.LOGO='';
    this.fileURL='';   
     this.imagePreviews='';       
  }
}

