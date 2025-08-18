import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ContactInfo } from 'src/app/Models/contactinfo';
import { ApiServiceService } from 'src/app/Service/api-service.service';
@Component({
  selector: 'app-addcontact',
  templateUrl: './addcontact.component.html',
  styleUrls: ['./addcontact.component.css']
})
export class AddcontactComponent implements OnInit {

  @Input()
  drawerClose!: Function;
  @Input()
  data: ContactInfo = new ContactInfo;
  @Input()
  drawerVisible: boolean = false;
  isSpinning = false;
  isOk=true;
  emailpattern=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  // namepatt=/^[a-zA-Z \-\']+/
  namepatt=/[a-zA-Z][a-zA-Z ]+/
   mobpattern = /^(\(\d{3}\)\s?|\d{3}[-.\s]?)\d{3}[-.\s]?\d{4}$/;
  

//Google Map 

  constructor(private api:ApiServiceService, private message: NzNotificationService) { }

  //Google map
  latitude: number=0;
  longitude: number=0;
  zoom = 12;
  @Input() center: google.maps.LatLngLiteral={ lat: 16.867634, lng: 74.570389 };
  markerOptions: google.maps.MarkerOptions = { draggable: true };
  @Input() markerPositions: google.maps.LatLngLiteral ={ lat: 16.867634, lng: 74.570389 };

  addMarker2(event: any) {
    this.markerPositions = event.latLng.toJSON();
    this.latitude = this.markerPositions.lat;
    this.longitude = this.markerPositions.lng;

    this.data.LATITUDE = this.latitude.toString();
    this.data.LONGITUDE   = this.longitude.toString();
  }

  googleMapPointer() {
    this.center = {
      lat: Number(this.data.LATITUDE),
      lng: Number(this.data.LONGITUDE  ),
    }
    this.markerPositions = { lat: Number(this.data.LATITUDE), lng: Number(this.data.LONGITUDE  ) };
  }
//////

  ngOnInit(): void {
  }

  close(): void {
    this.drawerClose();
  }

   //// Only number
 omit(event: any) {
  const charCode = event.which ? event.which : event.keyCode;
  const allowedChars = [32, 40, 41, 45, 46]; // space, (, ), -, .
  
  // Allow digits (48–57), backspace (8), delete (46), and formatting chars
  if (
    (charCode >= 48 && charCode <= 57) || // digits
    charCode === 8 ||                    // backspace
    allowedChars.includes(charCode)
  ) {
    return true;
  }

  return false;
}
  ////

  resetDrawer(websitebannerPage: NgForm) {
    this.data=new ContactInfo();
    websitebannerPage.form.markAsPristine();
    websitebannerPage.form.markAsUntouched();
  }
  //save
  save(addNew: boolean,websitebannerPage: NgForm): void {
    this.isSpinning = false;
    this.isOk=true;

    if (this.data.EMAIL_ID.trim()==""  && this.data.CONTACT_NO!=undefined 
    && this.data.WHATSAPP_NO!=undefined && this.data.ADDRESS_DETAILS.trim() == ""
    && this.data.ADDRESS_DETAILS_MR.trim() == "" ){
      this.isOk =false 
     this.message.error(" Please Fill All Required Fields", ""); 
    }else

    if(this.data.EMAIL_ID==null || this.data.EMAIL_ID.trim()==''){
      this.isOk =false
      this.message.error('Please Enter Email ID','')
    }else 

    if(!this.emailpattern.test(this.data.EMAIL_ID)){
      this.isOk =false
      this.message.error('Please Enter Valid Email ID','')
    }else 

    if(this.data.CONTACT_NO== undefined || this.data.CONTACT_NO<=0){
      this.isOk =false
      this.message.error('Please Enter Contact Number','')
    }else 
    if(!this.mobpattern.test(this.data.CONTACT_NO.toString())){
      this.message.error('Please Enter Valid Contact Number ','')
    }else 

    if(this.data.WHATSAPP_NO== undefined || this.data.WHATSAPP_NO<=0){ 
      this.isOk =false
      this.message.error('Please Enter Whatsapp Number','')
    }else 
    if(!this.mobpattern.test(this.data.WHATSAPP_NO.toString())){
      this.isOk =false
      this.message.error('Please Enter Valid Whatsapp Number ','')
    }else 

    if(this.data.ADDRESS_DETAILS==null || this.data.ADDRESS_DETAILS.trim()==''){
     this.isOk =false
     this.message.error('Please Enter Address','')
    }
    // else 
    
    // if(this.data.ADDRESS_DETAILS_MR==null || this.data.ADDRESS_DETAILS_MR.trim()==''){
    //  this.isOk =false
    //  this.message.error('Please Enter Address (Marathi)','')

// }
if(this.isOk)
{
  this.isSpinning=false; 
  // this.data.LATITUDE = this.latitude.toString();
  // this.data.LONGITUDE   = this.longitude.toString();
  this.isSpinning=true; 
if(this.data.ID)
{
    this.api.updatecontact(this.data)
    .subscribe(successCode => {
      if(successCode.code=="200")
      {
        this.message.success(' Information Updated Successfully...', '');
        if(!addNew)
          this.drawerClose();
          this.isSpinning = false;
      }   
      else
      {
        this.message.error(' Failed To Update Information...', '');
        this.isSpinning = false;
      }
    });
  }
  else{
  
      this.api.createcontact(this.data)
      .subscribe(successCode => {
        if(successCode.code=="200")
        {
          this.message.success(' Information Save Successfully...', '');
          if(!addNew)
         this.drawerClose();
            else
            {
              this.data=new ContactInfo();
              this.resetDrawer(websitebannerPage);
              // this.data.img= '';
              
              this.api.getAllcontact(1,1,'','desc','').subscribe (data =>{
                // if (data['count']==0){
                //   this.data.SEQUENCE_NO=1;
                // }else
                // {
                //   this.data.SEQUENCE_NO=data['data'][0]['SEQUENCE_NO']+1;
                // }
              },err=>{
                console.log(err);
              })
            }
            this.isSpinning = false;
          }
           else
           {
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
  open(link:any){
    if(link!=null || link!=undefined){
    window.open(link);
    }
  }
}
