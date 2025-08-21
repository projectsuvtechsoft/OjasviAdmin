import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { appkeys } from 'src/app/app.constant';
import { CategoryMaster } from 'src/app/Models/categorymaster';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { CommonFunctionService } from 'src/app/Service/CommonFunctionService';

@Component({
  selector: 'app-addcategories',
  templateUrl: './addcategories.component.html',
  styleUrls: ['./addcategories.component.css'],
})
export class AddcategoriesComponent implements OnInit {
  //save
  // save(addNew: boolean, websitebannerPage: NgForm): void {
  //   this.isSpinning = false;
  //   this.isOk = true;

  //   if (
  //     this.data.CATEGORY_NAME.trim() == '' &&
  //     this.data.CATEGORY_NAME_MR.trim() == '' &&
  //     this.data.SHORT_CODE.trim() == '' &&
  //     this.data.IMAGE.trim() == ''
  //   ) {
  //     this.isOk = false;
  //     this.message.error(' Please Fill All Required Fields ', '');
  //   } else if (
  //     this.data.CATEGORY_NAME == null ||
  //     this.data.CATEGORY_NAME.trim() == ''
  //   ) {
  //     this.isOk = false;
  //     this.message.error('Please Enter Category Name(English)', '');
  //   } else if (
  //     this.data.CATEGORY_NAME_MR == null ||
  //     this.data.CATEGORY_NAME_MR.trim() == ''
  //   ) {
  //     this.isOk = false;
  //     this.message.error('Please Enter Category Name(Marathi)', '');
  //   } else if (
  //     this.data.SHORT_CODE == null ||
  //     this.data.SHORT_CODE.trim() == ''
  //   ) {
  //     this.isOk = false;
  //     this.message.error(' Please Enter Short Code ', '');
  //   } else if (
  //     this.data.SEQUENCE_NO == undefined ||
  //     this.data.SEQUENCE_NO <= 0
  //   ) {
  //     this.isOk = false;
  //     this.message.error(' Please Enter Sequence Number ', '');
  //   } else if (this.data.IMAGE == null || this.data.IMAGE.trim() == '') {
  //     // alert(this.data.IMAGE)

  //     this.isOk = false;
  //     this.message.error(' Please Select Image ', '');
  //   }
  //   if (this.isOk) {
  //     // this.isSpinning=false;

  //     this.isSpinning = true;
  //     if (this.fileURL != null) {
  //       var number = Math.floor(100000 + Math.random() * 900000);
  //       var fileExt = this.fileURL.name.split('.').pop();
  //       var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
  //       var url = '';
  //       url = d == null ? '' : d + number + '.' + fileExt;
  //       if (this.data.IMAGE != undefined && this.data.IMAGE.trim() != '') {
  //         var arr = this.data.IMAGE.split('/');
  //         if (arr.length > 1) {
  //           url = arr[5];
  //         }
  //       }
  //       console.log(url);
  //       console.log('FileUrl=', this.fileURL);

  //       this.api
  //         .onUpload('categoryImage ', this.fileURL, url)
  //         .subscribe((successCode) => {
  //           console.log('successCode', successCode);

  //           if (successCode.status === '200') {
  //             this.data.IMAGE = url;
  //             // appkeys.retriveimgUrl + 'categoryImage /' + url;
  //             if (this.data.ID) {
  //               this.api
  //                 .updateCategoryMaster(this.data)
  //                 .subscribe((successCode) => {
  //                   if (successCode.code == '200') {
  //                     this.message.success(
  //                       ' Information Updated Successfully...',
  //                       ''
  //                     );
  //                     if (!addNew) this.drawerClose();
  //                     this.isSpinning = false;
  //                   } else {
  //                     this.message.error(
  //                       ' Failed To Update Information...',
  //                       ''
  //                     );
  //                     this.isSpinning = false;
  //                   }
  //                 });
  //             } else {
  //               this.api
  //                 .createCategoryMaster(this.data)
  //                 .subscribe((successCode) => {
  //                   if (successCode.code == '200') {
  //                     this.message.success(
  //                       ' Information Save Successfully...',
  //                       ''
  //                     );
  //                     if (!addNew) this.drawerClose();
  //                     else {
  //                       this.data = new CategoryMaster();
  //                       this.resetDrawer(websitebannerPage);
  //                       this.data.IMAGE = '';
  //                       this.fileURL = '';
  //                       this.api
  //                         .getAllCategoryMaster(1, 1, 'SEQUENCE_NO', 'desc', '')
  //                         .subscribe(
  //                           (data) => {
  //                             if (data['count'] == 0) {
  //                               this.data.SEQUENCE_NO = 1;
  //                             } else {
  //                               this.data.SEQUENCE_NO =
  //                                 data['data'][0]['SEQUENCE_NO'] + 1;
  //                             }
  //                           },
  //                           (err) => {
  //                             console.log(err);
  //                           }
  //                         );
  //                     }
  //                     this.isSpinning = false;
  //                   } else {
  //                     this.message.error(' Failed To Save Information...', '');
  //                     this.isSpinning = false;
  //                   }
  //                 });
  //             }
  //           } else {
  //             this.message.error(' Failed To Save Image...', '');
  //             this.isSpinning = false;
  //           }
  //         });
  //     } else if (this.data.IMAGE == null || this.data.IMAGE == '') {
  //       this.message.error(' Please Select Image...', '');
  //       this.isSpinning = false;
  //     } else {
  //       if (this.data.ID) {
  //         this.api.updateCategoryMaster(this.data).subscribe((successCode) => {
  //           if (successCode.code == '200') {
  //             this.message.success(' Information Updated Successfully...', '');
  //             if (!addNew) this.drawerClose();
  //             this.isSpinning = false;
  //           } else {
  //             this.message.error(' Failed To Update Information...', '');
  //             this.isSpinning = false;
  //           }
  //         });
  //       } else {
  //         this.api.createCategoryMaster(this.data).subscribe((successCode) => {
  //           if (successCode.code == '200') {
  //             this.message.success(' Information Save Successfully...', '');
  //             if (!addNew) this.drawerClose();
  //             else {
  //               this.data = new CategoryMaster();
  //             }
  //             this.isSpinning = false;
  //           } else {
  //             this.message.error(' Failed To Save Information...', '');
  //             this.isSpinning = false;
  //           }
  //         });
  //       }
  //     }
  //   }
  // }

  @ViewChild('image1') myElementRef!: ElementRef;
  CropImageModalCancel() {
    this.CropImageModalVisible = false;
    this.cropimageshow = false;
    this.myElementRef.nativeElement.value = null;
  }
  @Input() drawerClose: Function;
  @Input() data: CategoryMaster;
  @Input() drawerVisible: boolean;
  Parentcategories: any = [];
  orgId = this.cookie.get('orgId');
  loadingRecords = true;
  isSpinning = false;
  isOk = true;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  isFocused: string = '';
  onlynum = /^[0-9]*$/;
  onlychar = /^[a-zA-Z ]*$/;

  imgUrl;

  public commonFunction = new CommonFunctionService();
  CropImageModalVisible = false;
  // CropImageModalFooter: string|TemplateRef<{}>|ModalButtonOptions<any>[]|null|undefined;
  isSpinningCrop = false;
  cropimageshow: any;
  constructor(
    private api: ApiServiceService,
    private cookie: CookieService,
    private datePipe: DatePipe,
    private message: NzNotificationService,
    private sanitizer: DomSanitizer
  ) {}
  fullImageUrl: string;
  retriveimgUrl = appkeys.retriveimgUrl;
  validateInput(event: KeyboardEvent): void {
    const allowedPattern = /^[a-zA-Z\s\/\(\)_\-]*$/; // Updated pattern
    const char = String.fromCharCode(event.keyCode || event.which);

    if (!allowedPattern.test(char)) {
      event.preventDefault(); // Prevent invalid characters
    }
  }
  uploadedImage: any = '';
  ngOnInit() {
    if (
      this.data.ID != null &&
      this.data.ID != undefined &&
      this.data.IMAGE != null &&
      this.data.IMAGE != undefined &&
      this.data.IMAGE != ' ' &&
      this.data.IMAGE != ''
    ) {
      this.fullImageUrl =
        this.retriveimgUrl + 'categoryImage/' + this.data.IMAGE;
      this.uploadedImage = this.data.IMAGE;

      console.log('this.fullImageUrl', this.fullImageUrl);

      // window.open(fullImageUrl, '_blank');
    } else {
      // this.message.info('Document Not Uploaded.', '');
    }
  }

  omit(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }

    return true;
  }

  close(accountMasterPage: NgForm) {
    this.drawerClose();
    this.resetDrawer(accountMasterPage);
  }

  resetDrawer(accountMasterPage: NgForm) {
    this.data = new CategoryMaster();
    accountMasterPage.form.markAsPristine();
    accountMasterPage.form.markAsUntouched();
    this.fileURL = '';
  }

  alphaOnly(event) {
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

  UrlImageOne;
  progressBarImageOne: boolean = false;
  percentImageOne = 0;
  timer: any;
  urlImageOneShow: boolean = false;
  fileURL: any = '';

  deleteCancel() {}
  removeImage() {
    this.data.IMAGE = ' ';
    this.fileURL = null;
  }

  ViewImage: any;
  ImageModalVisible = false;

  ImageModalCancel() {
    this.ImageModalVisible = false;
  }
  image1DeleteConfirm(data: any) {
    this.fileURL = null;
    this.UrlImageOne = null;
    this.data.IMAGE = ' ';
    // this.data.IMAGE = "";

    this.fileURL = null;
  }
  viewImage(imageURL: string): void {
    this.ViewImage = 1;
    this.GetImage(imageURL);
  }
  sanitizedLink: any = '';
  GetImage(link: string) {
    let imagePath = this.api.retriveimgUrl + 'Category/' + link;
    this.sanitizedLink =
      this.sanitizer.bypassSecurityTrustResourceUrl(imagePath);
    this.imageshow = this.sanitizedLink;

    // Display the modal only after setting the image URL
    this.ImageModalVisible = true;
  }
  sanitizedFileURL: SafeUrl | null = null;
  imageshow;

  imagePreview: any;
  selectedFile: any;
  // onFileSelected(event: any): void {
  //   const maxFileSize = 1 * 1024 * 1024; // 1 MB
  //   const allowedWidth = 200;
  //   const allowedHeight = 200;

  //   if (event.target.files[0]?.type.match(/image\/(jpeg|jpg|png)/)) {
  //     // this.fileURL = this.base64ToFile(this.croppedImage, 'cropped-image.png');
  //     this.fileURL = <File>event.target.files[0];

  //     if (this.fileURL.size > maxFileSize) {
  //       this.message.error('File size should not exceed 1MB.', '');
  //       this.fileURL = null;
  //       // event.target.value = null;
  //       return;
  //     }

  //     // Validate image dimensions
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       const img = new Image();
  //       img.src = this.croppedImage;
  //       const input = event.target as HTMLInputElement;

  //       if (input?.files?.length) {
  //         this.selectedFile = input.files[0];

  //         // Generate a preview of the selected image
  //         const reader = new FileReader();
  //         reader.onload = () => {
  //           this.imagePreview = this.croppedImage; // Base64 image data
  //           //
  //         };
  //         reader.readAsDataURL(this.selectedFile);
  //       }
  //       img.onload = () => {
  //         if (img.width !== allowedWidth || img.height !== allowedHeight) {
  //           this.message.error(
  //             `Image dimensions should be exactly ${allowedWidth} x ${allowedHeight} px.`,
  //             ''
  //           );
  //           this.fileURL = null;
  //           this.sanitizedFileURL = null;
  //         } else {
  //           // Sanitize the file URL for preview
  //           //
  //           // this.fileURL = this.base64ToFile(
  //           //   this.croppedImage,
  //           //   'cropped-image.png'
  //           // );
  //           this.sanitizedFileURL = this.sanitizer.bypassSecurityTrustUrl(
  //             URL.createObjectURL(this.fileURL)
  //           );
  //           this.data.IMAGE = this.fileURL.name;
  //           // if (
  //           //   this.data.IMAGE != null &&
  //           //   this.data.IMAGE != undefined &&
  //           //   this.data.IMAGE != ' ' &&
  //           //   this.data.IMAGE != ''
  //           // ) {
  //           //   this.fullImageUrl =
  //           //     this.retriveimgUrl + 'Category/' + this.data.IMAGE;
  //           //   // window.open(fullImageUrl, '_blank');
  //           //
  //           // } else {
  //           //   // this.message.info('Document Not Uploaded.', '');
  //           // }
  //         }
  //       };
  //     };

  //     reader.readAsDataURL(this.fileURL);
  //     this.CropImageModalVisible = false;
  //     // event.target.value = null;
  //   } else {
  //     this.message.error(
  //       'Please select a valid image file (PNG, JPG, JPEG).',
  //       ''
  //     );
  //     this.fileURL = null;
  //     this.sanitizedFileURL = null;
  //     event.target.value = null;
  //   }
  // }
  onFileSelected(event: any): void {
    const maxFileSize = 1 * 1024 * 1024; // 1MB
    const allowedWidth = 200;
    const allowedHeight = 200;
    if (
      event.target.files[0]?.type === 'image/jpeg' ||
      event.target.files[0]?.type === 'image/jpg' ||
      event.target.files[0]?.type === 'image/png'
    ) {
      const input = event.target as HTMLInputElement;

      if (input?.files?.length) {
        this.selectedFile = input.files[0];

        // Validate file size
        if (this.selectedFile.size > maxFileSize) {
          this.message.error('Category Image size should not exceed 1MB.', '');

          return;
        }

        // Set preview and proceed
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const image = new Image();
          image.src = e.target.result;

          image.onload = () => {
            if (
              image.width !== allowedWidth ||
              image.height !== allowedHeight
            ) {
              this.message.error(
                `Image dimensions should be exactly ${allowedWidth} x ${allowedHeight} px.`,
                ''
              );
              this.fileURL = null;
              this.sanitizedFileURL = null;
              this.selectedFile = null;
              return;
            }

            // If dimensions are valid, continue upload logic
            this.imagePreview = e.target.result;
            this.fileURL = this.selectedFile;

            var number = Math.floor(100000 + Math.random() * 900000);
            var fileExt = this.fileURL.name.split('.').pop();
            var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
            var url = d == null ? '' : d + number + '.' + fileExt;

            if (this.data.IMAGE != undefined && this.data.IMAGE.trim() !== '') {
              var arr = this.data.IMAGE.split('/');
              if (arr.length > 1) {
                url = arr[5];
              }
            }

            const uploadedfileExt = this.uploadedImage.split('.').pop();

            if (this.data.ID && this.data.IMAGE) {
              this.UrlImageOne = this.uploadedImage.split('?')[0];
            } else {
              this.UrlImageOne = url;
            }

            this.timer = this.api
              .onUpload('categoryImage', this.fileURL, this.UrlImageOne)
              .subscribe((res) => {
                this.data.IMAGE = this.UrlImageOne;
                this.uploadedImage = this.data.IMAGE;
                if (res.type === HttpEventType.UploadProgress) {
                  const percentDone = Math.round(
                    (100 * res.loaded) / res.total
                  );
                  this.percentImageOne = percentDone;
                  if (this.percentImageOne === 100) {
                    this.isSpinning = false;
                    setTimeout(() => {
                      this.progressBarImageOne = false;
                    }, 2000);
                  }
                } else if (res.type == 2 && res.status != 200) {
                  this.message.error('Failed To Upload Category Image...', '');
                  this.isSpinning = false;
                  this.progressBarImageOne = false;
                  this.percentImageOne = 0;
                  this.data.IMAGE = ' ';
                } else if (res.type == 4 && res.status == 200) {
                  if (res.body['code'] === 200) {
                    this.message.success(
                      'Category Image Uploaded Successfully...',
                      ''
                    );
                    this.isSpinning = false;
                    this.data.IMAGE = this.UrlImageOne;
                  } else {
                    this.isSpinning = false;
                    this.progressBarImageOne = false;
                    this.percentImageOne = 0;
                    this.data.IMAGE = ' ';
                  }
                }
              });
          };
        };
        reader.readAsDataURL(this.selectedFile);
      }
    } else {
      this.message.error(
        'Please select a valid Image file (PNG, JPG, JPEG).',
        ''
      );
      this.fileURL = null;
      this.isSpinning = false;
      this.progressBarImageOne = false;
      this.percentImageOne = 0;
      this.data.IMAGE = ' ';
    }
  }
  base64ToFile(base64String: string, filename: string): File {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  imageChangedEvent: any = '';
  croppedImage: any = '';
  fileChangeEvent(event: any): void {
    //

    this.CropImageModalVisible = true;
    this.cropimageshow = true;

    this.imageChangedEvent = event;
  }

  cropperPosition = { x1: 0, y1: 0, x2: 200, y2: 200 };
  imageCropped2(event: ImageCroppedEvent) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = 200;
    canvas.height = 200;

    const img: any = new Image();
    img.src = event.base64;
    img.onload = () => {
      ctx.fillStyle = '#ffffff'; // Change this color if needed
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, 200, 200);

      // Convert to JPEG with reduced quality
      this.compressImage(canvas, 1); // Start with 70% quality
    };
  }
  imageCropped(event: any) {
    let cropWidth: any;
    let cropHeight: any;

    cropWidth = 200;
    cropHeight = 200;

    this.enhanceImageQuality(event.base64, cropWidth, cropHeight);
    this.imageWidth = event?.original?.size.width;
    this.imageHeight = event?.original?.size.height;
  }
  async enhanceImageQuality(
    base64: string,
    finalWidth: number,
    finalHeight: number
  ): Promise<void> {
    try {
      this.croppedImage = await new Promise((resolve, reject) => {
        const img = new Image();
        img.src = base64;
        img.crossOrigin = 'Anonymous';

        img.onload = async () => {
          await img.decode(); // Ensures image is fully loaded before processing.

          // Create a high-resolution canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) return reject('Canvas context not available');

          // Set canvas to final size initially
          canvas.width = finalWidth * 2;
          canvas.height = finalHeight * 2;

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw image at high resolution first
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Stepwise Downscaling to Avoid Blur
          const downscaleCanvas = (
            sourceCanvas: HTMLCanvasElement,
            width: number,
            height: number
          ) => {
            const newCanvas = document.createElement('canvas');
            const newCtx = newCanvas.getContext('2d');
            if (!newCtx) return sourceCanvas;

            newCanvas.width = width;
            newCanvas.height = height;

            newCtx.imageSmoothingEnabled = true;
            newCtx.imageSmoothingQuality = 'high';

            newCtx.drawImage(sourceCanvas, 0, 0, width, height);
            return newCanvas;
          };

          // Reduce stepwise to avoid quality loss
          let currentCanvas = canvas;
          const downscaleSteps = [
            [Math.floor(finalWidth * 1.5), Math.floor(finalHeight * 1.5)], // Reduce gradually
            [finalWidth, finalHeight], // Final resolution
          ];

          for (const [w, h] of downscaleSteps) {
            currentCanvas = downscaleCanvas(currentCanvas, w, h);
          }

          // Convert to WebP or PNG at High Quality
          resolve(currentCanvas.toDataURL('image/png', 2)); // WebP preserves more details
        };

        img.onerror = (err) => reject(`Image load error: ${err}`);
      });
    } catch (error) {
      console.error('Image enhancement failed:', error);
    }
  }

  // Function to compress image and ensure size < 1MB
  compressImage(canvas: HTMLCanvasElement, quality: number) {
    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const sizeInMB = blob.size / (1024 * 1024); // Convert to MB

        if (sizeInMB > 1 && quality > 0.1) {
          // If size is still >1MB, reduce quality and try again
          this.compressImage(canvas, quality - 0.1);
        } else {
          // Final compressed image (size is now below 1MB)
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            this.croppedImage = reader.result as string;
            //
          };
        }
      },
      'image/jpeg',
      quality
    ); // Convert to JPEG with given quality
  }

  imageWidth: number = 0;
  imageHeight: number = 0;
  imageLoaded(event) {
    //
    setTimeout(() => {
      this.cropperPosition = { x1: 0, y1: 0, x2: 200, y2: 200 };
    }, 50);
    this.imagePreview = this.croppedImage;
    // this.imageWidth = event.original.size.width;
    // this.imageHeight = event.original.size.height;
    // Image loaded successfully
  }

  cropperReady(event) {}

  loadImageFailed() {
    // Image failed to load
  }
  imagePreviewURL;
  save(addNew: boolean, accountMasterPage: NgForm): void {
    this.isOk = true;

    this.data.CATEGORY_NAME = this.data.CATEGORY_NAME?.trim() || '';
    this.data.CATEGORY_NAME_MR = this.data.CATEGORY_NAME_MR?.trim() || '';

    // Validate required fields
    if (
      (this.data.CATEGORY_NAME.trim() === '' ||
        this.data.CATEGORY_NAME == null ||
        this.data.CATEGORY_NAME == undefined) &&
      (this.data.IMAGE == undefined ||
        this.data.IMAGE == null ||
        this.data.IMAGE == '' ||
        this.data.IMAGE == ' ')
    ) {
      this.isOk = false;
      this.message.error('Please fill all required details.', '');
      return;
    } else if (
      this.data.CATEGORY_NAME.trim() === '' ||
      this.data.CATEGORY_NAME == null ||
      this.data.CATEGORY_NAME == undefined
    ) {
      this.isOk = false;
      this.message.error('Please Enter Category Name', '');
      return;
    } else if (
      this.data.SHORT_CODE == null ||
      this.data.SHORT_CODE.trim() == ''
    ) {
      this.isOk = false;
      this.message.error(' Please Enter Short Code ', '');
      return;
    } else if (
      this.data.IMAGE == undefined ||
      this.data.IMAGE == null ||
      this.data.IMAGE == '' ||
      this.data.IMAGE == ' '
    ) {
      this.isOk = false;
      this.message.error('Please Upload Category IMAGE', '');
      return;
    } else if (
      this.data.SEQUENCE_NO == undefined ||
      this.data.SEQUENCE_NO == null ||
      this.data.SEQUENCE_NO == 0
    ) {
      this.isOk = false;
      this.message.error('Please Enter Sequence No.', '');
      return;
    }
    this.isSpinning = true;

     if (this.isOk) {
        this.isSpinning = true;
    
        this.api.getAllCategoryMaster(0, 0, '', 'desc', '').subscribe(
          (allData: any) => {
            const countries = allData?.data || [];
    
            const nameExists = countries.some(
              (c: any) =>
                c.CATEGORY_NAME.trim().toLowerCase() === this.data.CATEGORY_NAME.trim().toLowerCase() &&
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
              this.message.error('Category Name already exists', '');
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
    
                  // Handle image upload first
          if (this.fileURL) {
            const number = Math.floor(100000 + Math.random() * 900000);
            const fileExt = this.fileURL.name.split('.').pop();
            const d = this.datePipe.transform(new Date(), 'yyyyMMdd');
            var url = `${d ?? ''}${number}.${fileExt}`;

            const uploadedfileExt = this.uploadedImage.split('.').pop();

            if (this.data.ID) {
              if (uploadedfileExt == fileExt) {
                //
                this.UrlImageOne = this.uploadedImage;
              } else {
                this.UrlImageOne = url;
              }
            } else {
              this.UrlImageOne = url;
            }

            this.api
              .onUpload('categoryImage', this.fileURL, this.UrlImageOne)
              .subscribe((res) => {
                if (res.type === HttpEventType.Response && res.status === 200) {
                  this.data.IMAGE = this.UrlImageOne;
                  this.uploadedImage = this.data.IMAGE;

                  // this.message.success('IMAGE Uploaded Successfully...', '');
                  this.handleSaveOperation(addNew, accountMasterPage);
                } else if (res.type === HttpEventType.Response) {
                  this.message.error('Failed to Upload IMAGE.', '');
                  this.isSpinning = false;
                }
              });
          } else {
            // If no image file, proceed directly to save
            this.handleSaveOperation(addNew, accountMasterPage);
          }
          },
          () => {
            this.message.error('Something went wrong, please try again later', '');
            this.isSpinning = false;
          }
        );
      }
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
  handleSaveOperation(addNew: boolean, accountMasterPage: NgForm): void {
    if (this.data.CATEGORY_NAME_MR == '') {
      this.data.CATEGORY_NAME_MR = '';
    }
    if (this.data.ID) {
      // Update category
      this.api.updateCategoryMaster(this.data).subscribe(
        (successCode) => {
          this.isSpinning = false;
          if (successCode['code'] === 200) {
            this.message.success('Category updated successfully.', '');
            if (!addNew) this.drawerClose();
            this.resetDrawer(accountMasterPage);
          } else {
            this.message.error('Category update failed.', '');
          }
        },
        (err) => {
          this.message.error(
            'Something went wrong, please try again later',
            ''
          );
          this.isSpinning = false;
        }
      );
    } else {
      // Create category
      this.api.createCategoryMaster(this.data).subscribe(
        (successCode) => {
          this.isSpinning = false;
          if (successCode['code'] === 200) {
            this.message.success('Category created successfully.', '');
            if (!addNew) {
              this.drawerClose();
              this.resetDrawer(accountMasterPage);
            } else {
              this.data = new CategoryMaster();
              this.resetDrawer(accountMasterPage);
              this.api
                .getAllCategoryMaster(1, 1, 'SEQUENCE_NO', 'desc', '')
                .subscribe(
                  (data) => {
                    if (data['code'] == 200) {
                      if (data['count'] == 0) {
                        this.data.SEQUENCE_NO = 1;
                      } else {
                        this.data.SEQUENCE_NO =
                          data['data'][0]['SEQUENCE_NO'] + 1;
                      }
                    } else {
                      this.message.error('Server Not Found', '');
                    }
                  },
                  () => {}
                );
            }
          } else {
            this.message.error('Failed to create category.', '');
          }
        },
        (err) => {
          this.message.error(
            'Something went wrong, please try again later',
            ''
          );
          this.isSpinning = false;
        }
      );
    }
  }

  removeImage1(): void {
    this.data.IMAGE = ' ';
    this.fileURL = null;
    this.imagePreviewURL = null;
    this.message.success('IMAGE removed successfully.', '');
  }
  openImageInNewWindow(): void {
    if (this.fileURL) {
      const imageURL = URL.createObjectURL(this.fileURL); // Get blob URL
      window.open(imageURL, '_blank');
    } else {
      alert('No IMAGE selected to view.');
    }
  }
  deleteImage(): void {
    // Remove selected file and its preview
    this.fileURL = null;
    this.sanitizedFileURL = null;
  }
}
