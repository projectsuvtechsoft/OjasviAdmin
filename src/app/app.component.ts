import { Component, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { NavigationEnd, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DatePipe } from '@angular/common';
import { ApiServiceService } from './Service/api-service.service';
import { environment } from 'src/environments/environment.prod';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { NgForm } from '@angular/forms';
import { CommonFunctionService } from './Service/CommonFunctionService';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NzDrawerPlacement } from 'ng-zorro-antd/drawer';
import { initializeApp } from 'firebase/app';
import { appkeys } from './app.constant';
import { NotificationDB } from './notification-db';
export class PasswordData {
  LOGIN_ID: any;
  OLD_PASSWORD: any;
  NEW_PASSWORD: any;
  USER_ID: any;
  USER_NAME: any;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DatePipe],
})
export class AppComponent {
  currentApplicationVersion: any;
  isCollapsed: boolean = false;
  isLogedIn: boolean = false;
  public commonFunction = new CommonFunctionService();
  columns: string[][] = [
    ['TITLE', 'TITLE'],
    ['DESCRIPTION', 'DESCRIPTION'],
  ];
  notficationfilter: any = '';
  // selectedRecord2: any = new VendorMasterData();
  userId = sessionStorage.getItem('userId');
  decrepteduserIDString = this.userId
    ? this.commonFunction.decryptdata(this.userId)
    : '';
  decrepteduserID = parseInt(this.decrepteduserIDString, 10);

  roleId = sessionStorage.getItem('roleId');
  decreptedroleIdString = this.roleId
    ? this.commonFunction.decryptdata(this.roleId)
    : '';
  decreptedroleId = parseInt(this.decreptedroleIdString, 10);
  appUrl = appkeys.baseUrl;

  USERNAME = sessionStorage.getItem('userName');
  decreptedUserName = this.USERNAME
    ? this.commonFunction.decryptdata(this.USERNAME)
    : '';

  Emaiid = sessionStorage.getItem('emailId');
  decryptedEmail = this.Emaiid
    ? this.commonFunction.decryptdata(this.Emaiid)
    : '';

  MobileNo = sessionStorage.getItem('mobile');
  year: any;
  level = Number(this.cookie.get('level'));
  menus: any[] = [];
  sendNotiDrawerVisible = false;
  sendNotiDrawerTitle: string;
  isNotificationVisible = false;
  notificationCount: any = 0;
  searchTerm: string = '';
  selectedTab: string = 'all';
  RoleDetails: any = sessionStorage.getItem('roledetailss');
  widthMenu: any = '100%';
  RoleName: any = sessionStorage.getItem('roleName');
  screenwidth = 0;
  currentroute = window.location.href;
  ROLE_ID: any;
  passwordData = new PasswordData();
  vendorId1 = sessionStorage.getItem('vendorId');
  decreptedvenderIdString = this.vendorId1
    ? this.commonFunction.decryptdata(this.vendorId1)
    : '';
  decreptedvendorId = parseInt(this.decreptedvenderIdString, 10);
  earningdata: any[] = [];
  private routerSubscription: Subscription;
  profile_url: string | null = sessionStorage.getItem('profile_url');
  imagePath: string | undefined = undefined;
  constructor(
    private router: Router,
    private cookie: CookieService,
    private _notificationService: NzNotificationService,
    private datePipe: DatePipe,
    private api: ApiServiceService,
    private message: NzNotificationService
  ) {}

  loggerInit() {
    if (
      this.cookie.get('supportKey') === '' ||
      this.cookie.get('supportKey') === null
    ) {
      this.api.loggerInit().subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.cookie.set(
              'supportKey',
              data['data'][0]['supportkey'],
              365,
              '',
              '',
              false,
              'Strict'
            );
          }
        },
        () => {}
      );
    } else {
    }
  }
  pageName: string = '';
  pageNameForJob: string = '';

  roleDetails: any[];
  roleNames: string[] = [];
  lastlogin: any = sessionStorage.getItem('lastlogindate');
  decryptedLastLogin = this.lastlogin
    ? this.commonFunction.decryptdata(this.lastlogin)
    : '';
  uniquidddd: any;
  teritoryIds: any = [];
  backofficeId = sessionStorage.getItem('backofficeId');
  decreptedbackofficeId = 0;
  private messaging;
  currentMessage = new BehaviorSubject<any>(null);
  arraysub: any;
  subscribedChannels1: any = sessionStorage.getItem('subscribedChannels1');
  ngOnInit(): void {
    this.currentApplicationVersion = environment.appVersioning.appVersion;

    this.requestPermission();
    const firebaseApp = initializeApp(environment.firebase);
    this.messaging = getMessaging(firebaseApp);
    let url: any = window.location.href;
    var arr: any = url.split('/');
    this.pageName = arr[3];

    var urlJob = window.location.href; // Full URL: http://localhost:4200/job-completed?key=vAgvydQHgaywRUGMiTmBFwPwVKEJPV
    var pathnameJob = new URL(urlJob).pathname; // Extracts the path: /job-completed
    this.pageNameForJob = pathnameJob.replace('/', '');

    var queryParams = new URL(urlJob).searchParams; // Access the query parameters
    var keyss = queryParams.get('key');
    this.decrepteduserIDString = this.userId
      ? this.commonFunction.decryptdata(this.userId)
      : '';
    this.decrepteduserID = parseInt(this.decrepteduserIDString, 10);
    if (this.cookie.get('token') === '' || this.cookie.get('token') === null) {
      // this.api.logoutForSessionValues();
      sessionStorage.clear();
      localStorage.clear();
      this.cookie.delete('token');
      this.cookie.delete('supportKey');
      this.cookie.delete('roleId');
      this.cookie.delete('emailId');
      this.cookie.delete('profile_url');
      this.cookie.delete('userId');

      if (this.pageNameForJob == 'job-completed') {
        this.isLogedIn = true;
        this.router.navigate(['/job-completed'], {
          queryParams: { key: keyss },
        });
        // this.router.navigate(['/job-completed/'] + arr[3]);
      } else {
        this.isLogedIn = false;
        this.router.navigate(['/login']);
      }
    } else {
      if (this.decrepteduserID && this.decreptedroleId != 0) {
        this.isLogedIn = true;
        this.loadForms();
        // this.orgDrawer();

        this.getEarnings();
        if (this.profile_url) {
          this.imagePath = `${this.api.retriveimgUrl}userProfile/${this.profile_url}`;
        }
        this.onMasterChange(this.selectedMaster1);
        // this.storeRoleID(this.decreptedroleId);
      } else {
        this.isLogedIn = false;
        // this.api.logoutForSessionValues();
        sessionStorage.clear();
        localStorage.clear();
        this.cookie.delete('token');
        this.cookie.delete('supportKey');
        this.cookie.delete('roleId');
        this.cookie.delete('emailId');
        this.cookie.delete('profile_url');
        this.cookie.delete('userId');

        this.router.navigate(['/login']);
      }
      // let urls: any = window.location.href;
      // var arrr: any = urls.split('/');
      // if (arrr[3] != undefined) {
      //   if (arrr[3] == '/') {
      //     if (arrr[3] != undefined && arrr[4] != undefined) {
      //       this.accessPageForRedirect(arrr[3], arrr[4]);
      //     }
      //   }
      // }

      const subscribedChannels = sessionStorage.getItem('subscribedChannels');
      const subscribedChannels1 = sessionStorage.getItem('subscribedChannels1');
      if (subscribedChannels) {
        let channelsArray = JSON.parse(subscribedChannels);

        if (Array.isArray(channelsArray) && channelsArray.length > 0) {
          var topics = channelsArray.map(
            (channel: any) => channel.CHANNEL_NAME
          );
          if (this.decreptedroleId == 4) {
            topics = [...topics, ...['job_chat_initiate_channel']];
          }

          this.api.subscribeToMultipleTopics(topics).subscribe({
            next: () => {
              // Remove pushed channels from array
              channelsArray = channelsArray.filter(
                (channel: any) => !topics.includes(channel.CHANNEL_NAME)
              );

              // Update sessionStorage
              sessionStorage.setItem(
                'subscribedChannels',
                JSON.stringify(channelsArray)
              );
            },
            error: (err) => {
              console.error('Failed to subscribe to topics:', err);
            },
          });
        } else if (
          subscribedChannels1 &&
          JSON.parse(subscribedChannels1).length == 0
        ) {
          if (this.decreptedroleId == 4) {
            var topics2: any = [
              'job_chat_initiate_channel',
              'backoffice_channel',
            ];
            var channelsArray2: any = [
              { CHANNEL_NAME: 'job_chat_initiate_channel' },
              { CHANNEL_NAME: 'backoffice_channel' },
            ];

            this.api.subscribeToMultipleTopics(topics2).subscribe({
              next: () => {
                // Update sessionStorage
                sessionStorage.setItem(
                  'subscribedChannels1',
                  JSON.stringify(channelsArray2)
                );
              },
              error: (err) => {
                console.error('Failed to subscribe to topics:', err);
              },
            });
          }
        }
      }
    }

    this.year = new Date().getFullYear();
    this.RoleDataGet();

    const roleDetailsString: any = sessionStorage.getItem('roledetailss');
    this.roleDetails = JSON.parse(roleDetailsString);

    if (this.roleDetails) {
      this.roleDetails.forEach((role) => {
        this.roleNames.push(role.ROLE_NAME);
      });
    }

    this.lastlogin = this.datePipe.transform(
      this.decryptedLastLogin,
      'dd/MM/yyyy, HH:mm:ss a'
    );

    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Clear search query on route change
        this.searchQuery = '';
      }
    });

    const storedIcons = sessionStorage.getItem('clickedIcons');
    if (storedIcons) {
      this.clickedIcons = JSON.parse(storedIcons);
    }

    if (this.decreptedroleId == 2 || this.decreptedroleId == 20) {
      this.masters = ['All', 'Customer', 'Order'];
    } else if (this.decreptedroleId == 3) {
      this.masters = ['Order'];
    } else if (this.decreptedroleId == 4) {
      this.masters = ['Job'];
    } else if (this.decreptedroleId == 5) {
      this.masters = ['Technician'];
    } else if (this.decreptedroleId == 9) {
      this.masters = ['All', 'Technician', 'Order', 'Job'];
    } else if (this.decreptedroleId == 21) {
      this.masters = ['All', 'Order', 'Job'];
    } else if (this.decreptedroleId == 22) {
      this.masters = ['All', 'Customer', 'Order', 'Job'];
    } else {
      this.masters = [
        'All',
        'Customer',
        'Vendor',
        'Technician',
        'Order',
        'Job',
      ];
    }
    this.selectedMaster1 = this.masters[0];
    this.teritoryIds = [];
    if (this.decreptedroleId == 9) {
      this.api
        .getVendorTerritoryMappedData(
          0,
          0,
          '',
          '',
          ' AND IS_ACTIVE =1 AND VENDOR_ID =' + this.decreptedvendorId
        )
        .subscribe((data2) => {
          if (data2['code'] == '200') {
            if (data2['count'] > 0) {
              data2['data'].forEach((element: any) => {
                this.teritoryIds.push(element.TERITORY_ID);
              });
            }
          }
        });
    } else if (
      this.decreptedvendorId != 1 &&
      this.decreptedvendorId != 6 &&
      this.decreptedvendorId != 8 &&
      this.decreptedvendorId != 9
    ) {
      var decreptedbackofficeId = this.backofficeId
        ? this.commonFunction.decryptdata(this.backofficeId)
        : '';
      this.decreptedbackofficeId = parseInt(decreptedbackofficeId, 10);
      if (this.decreptedbackofficeId > 0)
        this.api
          .getBackofcTerritoryMappedData(
            0,
            0,
            '',
            '',
            ' AND IS_ACTIVE =1 AND BACKOFFICE_ID =' + this.decreptedbackofficeId
          )
          .subscribe((data2) => {
            if (data2['code'] == '200') {
              if (data2['count'] > 0) {
                data2['data'].forEach((element) => {
                  this.teritoryIds.push(element.TERITORY_ID);
                });
              }
            }
          });
    }

    NotificationDB.getCount().then((count) => {
      this.notificationCount = count;
    });

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', async (event) => {
        this.notificationCount++;
        await NotificationDB.setCount(this.notificationCount);
      });
    }
  }

  viewfaqs() {
    this.isProfileCancel();
    this.router.navigate(['/support/view-faqs']);
  }
  getEarnings() {
    this.api
      .getEarnings(
        0,
        0,
        '',
        '',
        ' AND VENDOR_ID = ' + this.decreptedvenderIdString,
        'V'
      )
      .subscribe((data) => {
        this.earningdata = data.data;
      });
  }

  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, { vapidKey: environment.firebase.vapid })
      .then((currentToken) => {
        if (currentToken) {
          this.cookie.set('CLOUD_ID', currentToken, 365, '', '', true, 'None');
          this.receiveMessages();
        }
      })
      .catch((err) => {
        Notification.requestPermission().then(function (getperm) {});
      });
  }
  receiveMessages() {
    onMessage(this.messaging, (payload) => {
      // Store message in LocalStorage
      let storedMessages = JSON.parse(
        localStorage.getItem('NOTIFICATIONS') || '[]'
      );
      storedMessages.push(payload.notification);
      localStorage.setItem('NOTIFICATIONS', JSON.stringify(storedMessages));

      // Notify UI
      this.currentMessage.next(payload.notification);
    });
  }
  onKeyDown3() {
    if (this.searchQuery.length >= 3) {
      this.selectedMaster = this.selectedMaster1;
      this.matchedRecord = [];
      this.pageIndex = 1;
      this.onKeyDown2();
    } else {
      this.matchedRecord = [];
    }
  }

  accessPageForRedirect(first: any, second: any) {
    if (this.decreptedroleId != 0) {
      let url = window.location.href;
      var arr = url.split('/');
      let validPage = '/' + arr[3];
      let validPage1 = '/' + first + '/' + second;
      this.api
        .getCheckAccessOfForm(this.decreptedroleId, validPage1)
        .subscribe((data) => {
          if (data['data'] == true) {
            this.router.navigateByUrl(validPage1);
            this.pageName = arr[3];
          } else {
            if (validPage != '/login') {
              // this.api.logoutForSessionValues();
              this.logout();
              // alert('You do not have access to this page');
            }
          }
        });
    }
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  callAfterMessageReceived() {}

  forms: any[] = [];
  allTitles: any[] = [];
  titleWiseChildren: Record<string, any[]> = {};

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  loadForms() {
    this.api.getForms(this.decreptedroleId).subscribe((data) => {
      if (data['code'] == 200 && data['data']) {
        data['data'].forEach((element: any) => {
          element['children'].sort(this.sortFunction);
          if (element['children'].length == 0) delete element['children'];
        });

        this.menus = data['data'].sort(this.sortFunction);

        this.forms = data['data'];

        // Create an object that maps each title to its corresponding children
        this.titleWiseChildren = this.forms.reduce((acc, item) => {
          acc[item.title] = item.children; // Associate title with its children
          return acc;
        }, {});

        // Collecting all titles from the nested children arrays
        this.allTitles = this.forms.flatMap((category) =>
          category.children ? category.children.map((item) => item.title) : []
        );
      } else if (data['code'] == 403) {
        this.logout();
      }
    });
  }

  selectedMaster: string = '';
  navigateToMaster(masterLink: string) {
    this.router.navigate([masterLink]);
  }

  sortFunction(a, b) {
    var dateA = a.SEQ_NO;
    var dateB = b.SEQ_NO;
    return dateA > dateB ? 1 : -1;
  }

  isSpinning: boolean = false;
  loadlogout: boolean = false;

  logout() {
    this.loadlogout = true;
    this.api.logoutcall().subscribe(
      (data) => {
        if (data['code'] == '200') {
          const subscribedChannels = sessionStorage.getItem(
            'subscribedChannels1'
          );
          if (subscribedChannels) {
            let channelsArray = JSON.parse(subscribedChannels);

            if (Array.isArray(channelsArray) && channelsArray.length > 0) {
              const topics = channelsArray.map(
                (channel: any) => channel.CHANNEL_NAME
              );

              this.api.unsubscribeToMultipleTopics(topics).subscribe(() => {
                // Remove pushed channels from array
                channelsArray = channelsArray.filter(
                  (channel: any) => !topics.includes(channel.CHANNEL_NAME)
                );

                // Update sessionStorage
                sessionStorage.setItem(
                  'subscribedChannels1',
                  JSON.stringify(channelsArray)
                );

                this.finalizeLogout();
              });
            } else {
              this.finalizeLogout(); // Call finalize directly if no topics
            }
          } else {
            this.finalizeLogout(); // Call finalize if no channels are stored
          }
        } else {
          this.finalizeLogout();
        }
      },
      (err) => {
        this.finalizeLogout();
      }
    );
  }

  finalizeLogout() {
    this.cookie.deleteAll();
    sessionStorage.clear();
    localStorage.clear();
    this._notificationService.success('Logout Successfully', '');
    this.loadlogout = false;
    window.location.reload();
  }

  rolesData: any = [];

  RoleDataGet() {
    if (this.RoleDetails && this.RoleDetails.length > 0) {
      let tempRoleDetails: any = JSON.parse(this.RoleDetails);
      let roleIDS: any = [];
      tempRoleDetails.forEach((element) => {
        roleIDS.push(element.ROLE_ID);
      });

      this.api
        .getAllRoles(0, 0, '', '', ' AND ID in (' + roleIDS.toString() + ')')
        .subscribe(
          (data) => {
            if (data['code'] == 200) {
              this.rolesData = data['data'];
              this.ROLE_ID = this.decreptedroleId;
            } else {
              this.rolesData = [];
            }
          },
          () => {}
        );
    } else {
      this.rolesData = [];
    }
  }

  sendNotiDrawerClose() {
    this.sendNotiDrawerVisible = false;
    this.getnotifications();
  }

  get sendNotiDrawerCloseCallback() {
    return this.sendNotiDrawerClose.bind(this);
  }

  // isNotification() {
  //   this.isNotificationVisible = true;
  //   this.getnotifications();
  // }

  async isNotification() {
    this.isNotificationVisible = true;
    this.notificationCount = 0;
    await NotificationDB.clearCount();
    this.getnotifications();
  }
  isNotificationCancel() {
    this.resetForm();
    this.isNotificationVisible = false;
  }

  // Handle tab change
  onTabChange(selectedIndex: any): void {
    const tabMapping = ['all', 'orders', 'jobs'];
    const tabvalue = tabMapping[selectedIndex];
    if (tabvalue == 'orders') {
      this.selectedTab = 'O';
    } else if (tabvalue == 'jobs') {
      this.selectedTab = 'J';
    } else {
      this.selectedTab = 'all';
    }
    this.filterNotifications();
  }
  isExpanded = false;
  expandedNotifications: { [key: string]: boolean } = {};

  toggleExpand(notificationId: string): void {
    this.expandedNotifications[notificationId] =
      !this.expandedNotifications[notificationId];
  }
  getTruncatedText(text: string): string {
    if (!text) return '';
    const maxLength = 130; // Approximate length for two lines
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  }
  notifications: any[] = [];
  filteredNotifications: any[] = [];

  // Handle search input changes

  // Filter notifications based on the active tab and search input
  filterNotifications(): void {
    this.filteredNotifications = this.notifications.filter(
      (notification) =>
        (this.selectedTab === 'all' ||
          notification?.NOTIFICATION_TYPE == this.selectedTab) &&
        (notification.DESCRIPTION?.toLowerCase().includes(
          this.searchTerm.toLowerCase()
        ) ||
          notification.ORDER_NO?.toLowerCase().includes(
            this.searchTerm.toLowerCase()
          ) ||
          notification.JOB_CARD_NO?.toLowerCase().includes(
            this.searchTerm.toLowerCase()
          ))
    );
  }

  // Profile Drawer Code
  isProfileVisible = false;

  isProfile() {
    this.isProfileVisible = true;
  }

  isProfileCancel() {
    this.resetForm();
    this.isProfileVisible = false;
  }

  public visiblesave = false;

  saveQuery() {
    this.visiblesave = !this.visiblesave;
  }

  isChangePasswordVisible = false;

  isChangePassword() {
    this.visiblesave = true;
  }

  isChangePasswordCancel() {
    this.resetForm();
    this.isChangePasswordVisible = false;
  }

  @ViewChild('resetform') resetform: NgForm;
  resetForm(): void {
    // Reset form fields
    this.PASSWORD = '';
    this.NEWPASSWORD = '';
    this.CONFPASSWORD = '';

    // Reset the form's dirty and touched states to avoid showing validation errors
    if (this.resetform) {
      this.resetform.resetForm();
    }
  }

  isPasswordVisible: boolean = false;
  passwordVisible: boolean = false;
  newPasswordVisible: boolean = false;
  reEnterNewPasswordVisible: boolean = false;
  checkPasswordLoading: boolean = false;
  resetPasswordLoading: boolean = false;
  showConfirmPassword: boolean = false;
  PASSWORD: any = '';
  NEWPASSWORD: any = '';
  CONFPASSWORD: any = '';
  isLoading = false;
  passwordPattern: RegExp =
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?\":{}|<>])[A-Za-z0-9!@#$%^&*(),.?\":{}|<>]{8,}$/;

  handleOkTop(): void {
    let isOk = true;

    // Check if all fields are undefined, null, or empty
    if (
      (!this.PASSWORD || this.PASSWORD.trim() === '') &&
      (!this.NEWPASSWORD || this.NEWPASSWORD.trim() === '') &&
      (!this.CONFPASSWORD || this.CONFPASSWORD.trim() === '')
    ) {
      isOk = false;
      this._notificationService.error(
        'Please fill all the required fields',
        ''
      );
      return;
    }
    // Check if current PASSWORD is filled
    else if (!this.PASSWORD || this.PASSWORD.trim() === '') {
      isOk = false;
      this._notificationService.error('Please enter current password', '');
    } else if (
      this.NEWPASSWORD == null ||
      this.NEWPASSWORD == undefined ||
      this.NEWPASSWORD.trim() == ''
    ) {
      isOk = false;
      this._notificationService.error('Please enter new password.', '');
    } else if (this.NEWPASSWORD.length < 8) {
      isOk = false;
      this._notificationService.error(
        'New Password must be at least 8 characters long.',
        ''
      );
    } else if (!this.passwordPattern.test(this.NEWPASSWORD.trim())) {
      isOk = false;
      this._notificationService.error(
        'Password must meet the required pattern',
        ''
      );
    } else if (this.PASSWORD && this.NEWPASSWORD === this.PASSWORD) {
      isOk = false;
      this._notificationService.error(
        'Change the new password',
        'Your new password is similar to the old password. Please choose a different password.'
      );
    } else if (this.CONFPASSWORD.trim() === '') {
      isOk = false;
      this._notificationService.error('Please Enter Confirm Password.', '');
    } else if (this.NEWPASSWORD !== this.CONFPASSWORD) {
      isOk = false;
      this._notificationService.error(
        'Password mismatch',
        'The new password and the confirmation password do not match. Please ensure both fields contain the same password.'
      );
    }
    if (isOk) {
      this.resetPasswordLoading = true;
      this.passwordData.LOGIN_ID = this.decryptedEmail;
      this.passwordData.OLD_PASSWORD = this.PASSWORD;
      this.passwordData.NEW_PASSWORD = this.CONFPASSWORD;
      this.passwordData.USER_ID = this.decrepteduserID;
      this.passwordData.USER_NAME = this.decreptedUserName;
      this.isLoading = true; // Show the spinner
      this.api.changePassword(this.passwordData).subscribe(
        (successCode) => {
          if (successCode['code'] == 200) {
            this.resetPasswordLoading = false;
            this._notificationService.success(
              'Password reset successfully',
              ''
            );
            this.resetForm();
            this.isPasswordVisible = false;
            this.isLoading = false;

            // this.showConfirmPassword = false;
            this.visiblesave = false;
            // this.isChangePasswordVisible = false;
          } else if (successCode['message'] == 'Password not match') {
            this._notificationService.info(
              'Invalid old password',
              'The old password you entered is incorrect. Please double-check and try again.'
            );
            this.resetPasswordLoading = false;
            this.isLoading = false;
          } else {
            this.resetPasswordLoading = false;
            this.isLoading = false;
            this._notificationService.error('Failed to reset password', '');
          }
        },
        () => {
          this.resetPasswordLoading = false;
          this.isLoading = false;
          this._notificationService.error('Failed to reset password', '');
        }
      );
    }
  }

  handleCancelTop(): void {
    this.resetForm();
    this.visiblesave = false;
  }

  masters = ['All', 'Customer', 'Vendor', 'Technician', 'Order', 'Job'];

  selectedMaster1 = 'All';
  masterRecords: any[] = [];
  searchQuery: string = '';
  drawerVisible: boolean = false;
  selectedRecord: any;
  drawerTitle: string = '';

  onMasterChange(value: any) {
    this.selectedMaster1 = value;
    this.masterRecords = [];
    this.pageIndex = 1;
  }

  matchedRecord: any = [];
  onGlobalSearch(event): void {
    this.searchQuery = event;
  }
  onKeyDown(event: KeyboardEvent) {
    if (this.searchQuery.length >= 3 && event.key === 'Enter') {
      this.selectedMaster = this.selectedMaster1;
      this.matchedRecord = [];
      this.pageIndex = 1;
      this.onKeyDown2();
    } else {
      this.matchedRecord = [];
    }
  }

  reset() {
    this.searchQuery = '';
  }

  orgdrawerVisible: boolean = false;
  organizationData: any;
  // organizationEditData: OrganizationMaster = new OrganizationMaster();
  // orgDrawer() {
  //   this.api.getAllOrganizationsNew(0, 0, '', '', '').subscribe(
  //     (records) => {
  //       this.organizationData = records['body']['data'][0];
  //     },
  //     (err) => { }
  //   );
  // }

  // orgedit(): void {
  //   this.drawerTitle = 'Update Organization Details';
  //   this.organizationEditData = Object.assign({}, this.organizationData);

  //   this.orgdrawerVisible = true;
  // }

  orgcloseCallback = () => {
    this.orgdrawerVisible = false;
  };

  orgdrawerClose = () => {
    this.orgdrawerVisible = false;
  };

  visible = false;
  placement: NzDrawerPlacement = 'left';
  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  showResults = false;
  hideResults(event): void {
    setTimeout(() => {
      this.showResults = false; // Reset when click is outside
    }, 500); // Delay to allow click on results
  }

  pageIndex = 1;
  pageSize = 10;
  totaldataLength = 0;
  totalRecord = 10;
  isSpining = false;

  onMatchedRecordClick(data) {
    if (data.CATEGORY == 'Customer') {
      this.view(data);
    } else if (data.CATEGORY == 'Order') {
      this.vieworder(data);
    } else if (data.CATEGORY == 'Job') {
      this.openjobcarddetails(data);
    } else if (data.CATEGORY == 'Technician') {
      // this.openTechnicianscarddetails(data);
    } else if (data.CATEGORY == 'Vendor') {
      // this.viewVendor(data);
    }
  }

  loadMore() {
    this.pageIndex = this.pageIndex + 1;
    this.onKeyDown2();
  }

  onKeyDown2() {
    this.isSpining = true;
    this.totalRecord = 0;
    this.totaldataLength = 0;

    if (this.searchQuery.length >= 3) {
      this.api
        .globalSearch(
          this.pageIndex,
          this.pageSize,
          'ID',
          'DESC',
          this.searchQuery,
          this.selectedMaster == 'All' ? '' : this.selectedMaster,
          this.teritoryIds
        )
        .subscribe(
          (records) => {
            if (
              records['code'] == 200 &&
              records['data'] != null &&
              records['data'].length > 0
            ) {
              records['data'].forEach((element: any) => {
                if (
                  this.decreptedroleId != 3 &&
                  this.decreptedroleId != 21 &&
                  this.decreptedroleId != 4 &&
                  this.decreptedroleId != 9 &&
                  this.decreptedroleId != 5
                )
                  if (element.CATEGORY == 'Customer') {
                    var i = this.matchedRecord.findIndex(
                      (x) => x.CATEGORY == 'Customer'
                    );

                    if (element.MATCHED_RECORDS.length > 0) {
                      if (i != undefined && i != -1) {
                        var Customer = [
                          ...this.matchedRecord[i]['MATCHED_RECORDS'],
                          ...element.MATCHED_RECORDS,
                        ];
                        this.matchedRecord[i]['MATCHED_RECORDS'] = Customer;
                        this.matchedRecord[i]['CATEGORY'] = 'Customer';
                      } else {
                        this.matchedRecord.push({
                          CATEGORY: 'Customer',
                          MATCHED_RECORDS: element.MATCHED_RECORDS,
                        });
                      }
                    }
                  }

                if (
                  this.decreptedroleId != 2 &&
                  this.decreptedroleId != 20 &&
                  this.decreptedroleId != 21 &&
                  this.decreptedroleId != 22 &&
                  this.decreptedroleId != 3 &&
                  this.decreptedroleId != 4 &&
                  this.decreptedroleId != 9 &&
                  this.decreptedroleId != 5
                )
                  if (element.CATEGORY == 'Vendor') {
                    var ii = this.matchedRecord.findIndex(
                      (x) => x.CATEGORY == 'Vendor'
                    );

                    if (element.MATCHED_RECORDS.length > 0) {
                      if (ii != undefined && ii != -1) {
                        var Vendor = [
                          ...this.matchedRecord[ii]['MATCHED_RECORDS'],
                          ...element.MATCHED_RECORDS,
                        ];
                        this.matchedRecord[ii]['MATCHED_RECORDS'] = Vendor;
                        this.matchedRecord[ii]['CATEGORY'] = 'Vendor';
                      } else {
                        this.matchedRecord.push({
                          CATEGORY: 'Vendor',
                          MATCHED_RECORDS: element.MATCHED_RECORDS,
                        });
                      }
                    }
                  }
                if (
                  this.decreptedroleId != 2 &&
                  this.decreptedroleId != 20 &&
                  this.decreptedroleId != 22 &&
                  this.decreptedroleId != 21 &&
                  this.decreptedroleId != 3 &&
                  this.decreptedroleId != 4
                )
                  if (element.CATEGORY == 'Technician') {
                    var iii = this.matchedRecord.findIndex(
                      (x) => x.CATEGORY == 'Technician'
                    );

                    if (element.MATCHED_RECORDS.length > 0) {
                      if (iii != undefined && iii != -1) {
                        var Technician = [
                          ...this.matchedRecord[iii]['MATCHED_RECORDS'],
                          ...element.MATCHED_RECORDS,
                        ];
                        this.matchedRecord[iii]['MATCHED_RECORDS'] = Technician;
                        this.matchedRecord[iii]['CATEGORY'] = 'Technician';
                      } else {
                        this.matchedRecord.push({
                          CATEGORY: 'Technician',
                          MATCHED_RECORDS: element.MATCHED_RECORDS,
                        });
                      }
                    }
                  }
                if (
                  this.decreptedroleId != 2 &&
                  this.decreptedroleId != 20 &&
                  this.decreptedroleId != 3 &&
                  this.decreptedroleId != 5
                )
                  if (element.CATEGORY == 'Job') {
                    var iv = this.matchedRecord.findIndex(
                      (x) => x.CATEGORY == 'Job'
                    );

                    if (element.MATCHED_RECORDS.length > 0) {
                      if (iv != undefined && iv != -1) {
                        var Job = [
                          ...this.matchedRecord[0]['MATCHED_RECORDS'],
                          ...element.MATCHED_RECORDS,
                        ];
                        this.matchedRecord[iv]['MATCHED_RECORDS'] = Job;
                        this.matchedRecord[iv]['CATEGORY'] = 'Job';
                      } else {
                        this.matchedRecord.push({
                          CATEGORY: 'Job',
                          MATCHED_RECORDS: element.MATCHED_RECORDS,
                        });
                      }
                    }
                  }

                if (this.decreptedroleId != 4 && this.decreptedroleId != 5)
                  if (element.CATEGORY == 'Order') {
                    var v = this.matchedRecord.findIndex(
                      (x) => x.CATEGORY == 'Order'
                    );

                    if (element.MATCHED_RECORDS.length > 0) {
                      if (v != undefined && v != -1) {
                        var Order = [
                          ...this.matchedRecord[0]['MATCHED_RECORDS'],
                          ...element.MATCHED_RECORDS,
                        ];
                        this.matchedRecord[v]['MATCHED_RECORDS'] = Order;
                        this.matchedRecord[v]['CATEGORY'] = 'Order';
                      } else {
                        this.matchedRecord.push({
                          CATEGORY: 'Order',
                          MATCHED_RECORDS: element.MATCHED_RECORDS,
                        });
                      }
                    }
                  }
              });
              this.matchedRecord.forEach((element) => {
                this.totaldataLength =
                  this.totaldataLength + element.MATCHED_RECORDS.length;
              });
              this.totalRecord = records['count'];
              this.isSpining = false;
            } else {
              this.matchedRecord = [];
              this.isSpining = false;
              this.totaldataLength = 0;
              this.totalRecord = 0;
            }
          },
          (err) => {
            this.matchedRecord = [];
            this.isSpining = false;
            this.totaldataLength = 0;
            this.totalRecord = 0;
          }
        );
    } else {
      this.matchedRecord = [];
      this.isSpining = false;
      this.totaldataLength = 0;
      this.totalRecord = 0;
    }
  }
  drawerVisibleCustomers: boolean;
  drawerTitleCustomers: string;
  drawerDataCustomers: any = {};
  widths: any = '100%';
  custid = 0;
  view(data: any): void {
    this.custid = data.SOURCE_ID;

    this.drawerTitleCustomers = `View details of ${data.TITLE}`;

    this.drawerDataCustomers = Object.assign({}, data);
    this.drawerVisibleCustomers = true;
  }
  drawerCloseCustomers(): void {
    this.drawerVisibleCustomers = false;
  }
  get closeCallbackCustomers() {
    return this.drawerCloseCustomers.bind(this);
  }

  // order view

  vieworderdata: any;
  isSpinning2: boolean = false;
  orderDetails: any;
  customer: any = [];
  teritory: any = [];
  drawerTitle2 = '';
  drawerVisible2 = false;
  getDatas() {
    this.customer = [];

    this.api.getTeritory(0, 0, '', '', '').subscribe((data2) => {
      if (data2['code'] == '200') {
        if (data2['count'] > 0) {
          data2['data'].forEach((element) => {
            this.teritory.push({ value: element.ID, display: element.NAME });
          });
        }
      }
    });
  }
  TYPE = '';
  teritoryData: any = {};
  vieworder(data: any): void {
    this.drawerTitle = 'Order Details';
    this.orderDetails = data;
    this.orderDetails.ID = data.SOURCE_ID;
    this.isSpinning = true;
    this.api
      .getorderdetails(1, 1, '', '', '', data.SOURCE_ID)
      .subscribe((data) => {
        this.vieworderdata = data;
        this.api
          .getTeritory(
            1,
            1,
            '',
            '',
            ' AND ID=' + this.vieworderdata.orderData[0].TERRITORY_ID
          )
          .subscribe((data) => {
            this.teritoryData = data['data'][0];
          });
        this.drawerVisible = true;
        this.isSpinning = false;
      });
  }

  drawerClose(): void {
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  //job card details

  jobdetaildrawerTitle = '';
  jobdetailsshow = false;
  jobdetailsdata: any;
  invoicefilter = '';
  openjobcarddetails(data: any) {
    this.invoicefilter = ' AND JOB_CARD_ID=' + data.SOURCE_ID;

    this.jobdetaildrawerTitle = 'Job details of ' + data.TITLE;
    this.api
      .getpendinjobsdataa(1, 1, '', '', ' AND ID=' + data.SOURCE_ID)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.jobdetailsdata = data['data'][0];
            this.jobdetailsshow = true;
          } else {
            this.jobdetailsdata = {};
          }
        },
        () => {}
      );
  }
  drawersize = '100%';
  jobdetailsdrawerClose(): void {
    this.jobdetailsshow = false;
  }
  //Drawer Methods
  get jobdetailscloseCallback() {
    return this.jobdetailsdrawerClose.bind(this);
  }

  TechniciansdetaildrawerTitle = '';
  Techniciansdetailsshow = false;
  Techniciansdetailsdata: any;

  ratingfilter = '';

  TechniciansdetailsdrawerClose(): void {
    this.Techniciansdetailsshow = false;
  }
  //Drawer Methods
  get TechniciansdetailscloseCallback() {
    return this.TechniciansdetailsdrawerClose.bind(this);
  }

  TechniciansId: any;

  // shreya
  drawerVisibleVendors: boolean;
  drawerTitleVendors: string;
  drawerDataVendors: any;
  vendorId = 0;

  drawerCloseVendors(): void {
    this.drawerVisibleVendors = false;
  }
  openSendNotiDrawer() {
    this.sendNotiDrawerVisible = true;
    this.sendNotiDrawerTitle = 'Push Notification';
  }
  get closeCallbackVendors() {
    return this.drawerCloseVendors.bind(this);
  }
  viewHelpGuide() {
    this.isProfileCancel();
    this.router.navigate(['/support/help_guide']);
  }

  // Add form

  isDropdownVisible = false;
  clickedIcons: { title: string; icon: string; link: string }[] = [];
  selectedItems: {
    title: string;
    icon: string;
    link: string;
    isParent?: boolean;
  }[] = [];

  toggleDropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  onChildMenuClick(child: any, parent: any) {
    const childIndex = this.clickedIcons.findIndex(
      (icon) => icon.link === child.link
    );

    if (childIndex !== -1) {
      this.clickedIcons.splice(childIndex, 1);

      if (parent) {
        const parentChildrenSelected = parent.children.some((child) =>
          this.clickedIcons.some((icon) => icon.link === child.link)
        );

        if (!parentChildrenSelected) {
          const parentIndex = this.clickedIcons.findIndex(
            (icon) => icon.link === parent.link
          );
          if (parentIndex !== -1) {
            this.clickedIcons.splice(parentIndex, 1);
          }
        }
      }
    } else {
      this.selectedItems.push({ ...child, isParent: false });

      if (parent) {
        if (!this.selectedItems.some((item) => item.link === parent.link)) {
          this.selectedItems.push({ ...parent, isParent: true });
        }
      }

      const icon = { title: child.title, icon: child.icon, link: child.link };
      this.clickedIcons.unshift(icon);
      if (this.clickedIcons.length > 5) {
        this.clickedIcons.pop();
      }
    }

    sessionStorage.setItem('clickedIcons', JSON.stringify(this.clickedIcons));
  }

  isSelected(item: any): boolean {
    return this.clickedIcons.some((icon) => icon.link === item.link);
  }

  isSelectedParent(parent: any): boolean {
    return parent.children.some((child) =>
      this.clickedIcons.some((icon) => icon.link === child.link)
    );
  }

  onIconClick(menu: any) {
    this.router.navigate([menu.link]);
  }

  displayedCount: number = 10; // Initially show 10 notifications

  getnotifications() {
    // Global Search (using searchText)
    this.resetPasswordLoading = true;
    if (this.searchTerm !== '') {
      this.notficationfilter =
        ' AND (' +
        this.columns
          .map((column) => {
            return `${column[0]} like '%${this.searchTerm}%'`;
          })
          .join(' OR ') +
        ')';
    }
    let type =
      this.decreptedroleId == 6 ? 'T' : this.decreptedroleId == 9 ? 'V' : 'B';
    if (this.decreptedroleId != 8) {
      if (typeof this.subscribedChannels1 === 'string') {
        this.subscribedChannels1 = JSON.parse(this.subscribedChannels1 || '[]');
      }

      if (
        Array.isArray(this.subscribedChannels1) &&
        this.subscribedChannels1.length > 0
      ) {
        const topics = this.subscribedChannels1.map(
          (channel: any) => channel.CHANNEL_NAME
        );
        var filter = ` AND (TYPE='${type}' AND MEMBER_ID=${
          this.decrepteduserID
        }) OR (TOPIC_NAME IN ('${topics.join("','")}') AND MEMBER_ID=${
          this.decrepteduserID
        }  AND TYPE='${type}')`;
        // var filter = ` AND (TYPE='${type}' AND MEMBER_ID=${this.decrepteduserID
        //   }) AND (TOPIC_NAME IN ('${topics.join("','")}'))`;
      } else {
        var filter = ` AND TYPE='${type}' AND MEMBER_ID=${this.decrepteduserID}`;
      }

      this.api
        .getnotifications(this.pageIndex, this.pageSize, '', '', filter)
        .subscribe((data) => {
          // this.notifications = data.data;
          this.totalRecords = data.count;

          this.notifications = [
            ...new Map(
              [...this.notifications, ...data['data']].map((item) => [
                item.ID,
                item,
              ])
            ).values(),
          ];
          this.resetPasswordLoading = false;
        });
    } else {
      if (typeof this.subscribedChannels1 === 'string') {
        this.subscribedChannels1 = JSON.parse(this.subscribedChannels1 || '[]');
      }

      if (
        Array.isArray(this.subscribedChannels1) &&
        this.subscribedChannels1.length > 0
      ) {
        const topics = this.subscribedChannels1.map(
          (channel: any) => channel.CHANNEL_NAME
        );

        var filter = ` AND (TYPE='A' AND MEMBER_ID=${
          this.decrepteduserID
        }) AND (TOPIC_NAME IN ('${topics.join("','")}'))`;
      } else {
        var filter = ` AND TYPE='A' AND MEMBER_ID=${this.decrepteduserID}`;
      }

      this.api
        .getnotifications(
          this.pageIndex,
          this.pageSize,
          '',
          '',
          filter + this.notficationfilter
        )
        .subscribe((data) => {
          // this.notifications = data.data;
          this.totalRecords = data.count;
          this.notifications = [
            ...new Map(
              [...this.notifications, ...data['data']].map((item) => [
                item.ID,
                item,
              ])
            ).values(),
          ];
          this.resetPasswordLoading = false;
        });
    }
  }

  onKeyupS(event: KeyboardEvent) {
    const element = window.document.getElementById('notification');
    if (element) element.focus();

    if (this.searchTerm.length >= 3 && event.key === 'Enter') {
      this.onSearch(); // Trigger search when 3+ chars and Enter is pressed
    } else if (this.searchTerm.length === 0 && event.key === 'Backspace') {
      this.notifications = [
        // ...new Map(
        //   [...this.notifications, ...data['data']].map((item) => [
        //     item.ID,
        //     item,
        //   ])
        // ).values(),
      ];
      this.notficationfilter = '';
      this.onSearch(); // Clear search and reload original notifications
    }
  }

  clearSearch(): void {
    this.searchTerm = ''; // Reset search term
    this.getnotifications(); // Fetch original notifications
  }

  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    // this.search(true);
  }
  searchNotification(keys): void {
    const element = window.document.getElementById('notification');
    // if (element != null) element.focus();
    if (this.searchTerm.length >= 3 && keys.key === 'Enter') {
      if (this.searchTerm !== '') {
        this.notficationfilter =
          ' AND (' +
          this.columns
            .map((column) => {
              return `${column[0]} like '%${this.searchTerm}%'`;
            })
            .join(' OR ') +
          ')';
      }
      let type =
        this.decreptedroleId == 6
          ? 'T'
          : this.decreptedroleId == 8
          ? 'A'
          : this.decreptedroleId == 9
          ? 'V'
          : 'B';

      if (typeof this.subscribedChannels1 === 'string') {
        this.subscribedChannels1 = JSON.parse(this.subscribedChannels1 || '[]');
      }

      if (
        Array.isArray(this.subscribedChannels1) &&
        this.subscribedChannels1.length > 0
      ) {
        const topics = this.subscribedChannels1.map(
          (channel: any) => channel.CHANNEL_NAME
        );
        var filter = ` AND (TYPE='${type}' AND MEMBER_ID=${
          this.decrepteduserID
        }) OR (TOPIC_NAME IN ('${topics.join("','")}') AND MEMBER_ID=${
          this.decrepteduserID
        }  AND TYPE='${type}')`;
        // var filter = ` AND (TYPE='${type}' AND MEMBER_ID=${this.decrepteduserID
        //   }) OR (TOPIC_NAME IN ('${topics.join("','")}'))`;
      } else {
        var filter = ` AND TYPE='${type}' AND MEMBER_ID=${this.decrepteduserID}`;
      }
      // this.resetPasswordLoading = true;

      this.api
        .getnotifications(
          this.pageIndex,
          this.pageSize,
          '',
          '',
          filter + this.notficationfilter
        )
        .subscribe((data) => {
          // this.notifications = data.data;
          this.totalRecords = data.count;
          // this.resetPasswordLoading = false;
          const searchTermLower = this.searchTerm.toLowerCase();

          this.notifications = data.data.filter((notification) => {
            // Ensure properties exist before calling `toLowerCase()`
            const titleMatch =
              notification.TITLE?.toLowerCase().includes(searchTermLower);
            const descriptionMatch =
              notification.DESCRIPTION?.toLowerCase().includes(searchTermLower);

            return titleMatch || descriptionMatch;
          });
        });
    } else if (this.searchTerm.length >= 0 && keys.key == 'Backspace') {
      // this.notficationfilter = '';
      // this.onSearch();
      // this.notifications = this.notifications;
    }
  }

  // Handle search input changes

  onSearch(): void {
    // this.filterNotifications();

    this.getnotifications();
  }

  // displayedCount = this.pageSize; // Initially, show only 'pageSize' notifications
  totalRecords: any = 0; // Initially, show only 'pageSize' notifications

  loadMore1() {
    this.resetPasswordLoading = true;
    this.pageIndex += 1;
    // this.pageSize = 10;

    this.onSearch();
  }

  trackByNotification(index: number, item: any) {
    return item?.ID; // Use a unique identifier
  }

  openDashboard() {
    this.router.navigate(['/dashboard']);
  }

  onCrossClick(menu: any, index: number): void {
    this.clickedIcons.splice(index, 1);
    sessionStorage.setItem('clickedIcons', JSON.stringify(this.clickedIcons));
  }

  // ViewVendorReport() {
  //   this.drawerTitle = 'Vendor Detailed Report';
  //   this.drawerDataVendor = new VendorDetailedReport();
  //   this.drawerVendorReportVisible = true;
  // }

  // drawerDataVendor: VendorDetailedReport = new VendorDetailedReport();

  drawerVendorReportVisible: boolean = false;

  drawerCloseVendorReport(): void {
    this.drawerVendorReportVisible = false;
  }

  get closeCallbackVendorReport() {
    return this.drawerCloseVendorReport.bind(this);
  }

  viewknowledge() {
    this.isProfileCancel();
    this.router.navigate(['/support/knowledge-base']);
  }

  downloadDocument(link: string): void {
    if (!link) {
      console.error('Invalid file link provided');
      return;
    }

    const folderName = 'notificationAttachment';
    const fileUrl = `${this.api.retriveimgUrl}${folderName}/${link}`;

    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = link; // Browser will try to download
    a.target = '_blank'; // Optional: open in new tab if supported
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
