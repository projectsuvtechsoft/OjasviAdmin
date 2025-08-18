import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CountryMaster } from 'src/app/Models/CountryMaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-addcountry',
  templateUrl: './addcountry.component.html',
  styleUrls: ['./addcountry.component.css'],
})
export class AddcountryComponent {
  @Input() data: any = CountryMaster;
  @Input() drawerClose!: () => void;
  @Input() drawerVisible: boolean = false;
  public commonFunction = new CommonFunctionService();
  constructor(
    private message: NzNotificationService,
    private api: ApiServiceService
  ) {}
  isSpinning = false;
  isOk = true;
  isFocused: string = '';
  resetDrawer(CountryDrawer: NgForm) {
    this.data = new CountryMaster();
    CountryDrawer.form.markAsPristine();
    CountryDrawer.form.markAsUntouched();
  }
  validateInput(event: KeyboardEvent): void {
    const allowedPattern = /^[a-zA-Z\s\/\(\)_\-\&]*$/; // Updated pattern to include '&'
    const char = event.key; // Get the key value directly

    if (!allowedPattern.test(char)) {
      event.preventDefault(); // Prevent invalid characters
    }
  }

  save(addNew: boolean, CountryDrawer: NgForm): void {
  this.isSpinning = false;
  this.isOk = true;

  if (
    (this.data.NAME?.trim() == '' || !this.data.NAME) &&
    (!this.data.SHORT_CODE || this.data.SHORT_CODE == 0) &&
    (!this.data.SEQUENCE_NO || this.data.SEQUENCE_NO == 0)
  ) {
    this.isOk = false;
    this.message.error('Please Fill All The Required Fields ', '');
  } else if (!this.data.NAME?.trim()) {
    this.isOk = false;
    this.message.error('Please Enter Country Name.', '');
  } else if (!this.data.SHORT_CODE || this.data.SHORT_CODE == 0) {
    this.isOk = false;
    this.message.error('Please Enter Short Code.', '');
  } else if (!this.data.SEQUENCE_NO || this.data.SEQUENCE_NO == 0) {
    this.isOk = false;
    this.message.error('Please Enter Sequence No.', '');
  }

  if (this.isOk) {
    this.isSpinning = true;

    this.api.getAllCountryMaster(0, 0, '', 'desc', '').subscribe(
      (allData: any) => {
        const countries = allData?.data || [];

        const nameExists = countries.some(
          (c: any) =>
            c.NAME.trim().toLowerCase() === this.data.NAME.trim().toLowerCase() &&
            c.ID !== this.data.ID
        );
        const shortCodeExists = countries.some(
          (c: any) =>
            c.SHORT_CODE.trim().toLowerCase() === this.data.SHORT_CODE.trim().toLowerCase() &&
            c.ID !== this.data.ID
        );
       const sequenceExists = countries.some(
          (c: any) =>
            Number(c.SEQUENCE_NO) === Number(this.data.SEQUENCE_NO) &&
            c.ID !== this.data.ID
        );

        if (nameExists) {
          this.message.error('Name already exists', '');
          this.isSpinning = false;
          return;
        }
        if (shortCodeExists) {
          this.message.error('Short code already exists', '');
          this.isSpinning = false;
          return;
        }
      
        if (sequenceExists) {
          this.message.error('Sequence no. already exists', '');
          this.isSpinning = false;
          return;
        }

        if (this.data.ID) {
          this.api.updateCountryMaster(this.data).subscribe(
            (successCode: any) => {
              if (successCode.code == '200') {
                this.message.success('Country Updated Successfully', '');
                if (!addNew) this.drawerClose();
              } else {
                this.message.error('Country Updation Failed', '');
              }
              this.isSpinning = false;
            },
            () => {
              this.message.error('Something went wrong, please try again later', '');
              this.isSpinning = false;
            }
          );
        } else {
          this.api.createCountryMaster(this.data).subscribe(
            (successCode: any) => {
              if (successCode.code == '200') {
                this.message.success('Country Created Successfully', '');
                if (!addNew) {
                  this.drawerClose();
                } else {
                  this.data = new CountryMaster();
                  this.resetDrawer(CountryDrawer);
                  this.api.getAllCountryMaster(0, 0, '', 'desc', '').subscribe(
                    (data) => {
                      if (data['count'] == 0) {
                        this.data.SEQUENCE_NO = 1;
                      } else {
                        this.data.SEQUENCE_NO =
                          data['data'][0]['SEQUENCE_NO'] + 1;
                      }
                    },
                    () => {
                      this.message.error('Something went wrong, please try again later', '');
                      this.isSpinning = false;
                    }
                  );
                }
              } else {
                this.message.error('Country Creation Failed...', '');
              }
              this.isSpinning = false;
            },
            () => {
              this.message.error('Something went wrong, please try again later', '');
              this.isSpinning = false;
            }
          );
        }
      },
      () => {
        this.message.error('Something went wrong, please try again later', '');
        this.isSpinning = false;
      }
    );
  }
}

  close() {
    this.drawerClose();
  }
  getErrorMessage(control: any): string {
    if (control.errors?.['required'] && control.touched) {
      return 'Please enter a country name.';
    }
    if (control.errors?.['maxlength'] && control.touched) {
      return 'Country name is too long.';
    }
    return '';
  }
}
