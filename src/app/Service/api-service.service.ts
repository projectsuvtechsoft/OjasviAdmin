import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { catchError, concat, Observable, of } from 'rxjs';
import { appkeys } from '../app.constant';
import { CommonFunctionService } from './CommonFunctionService';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  clientId: number = 1;
  public commonFunction = new CommonFunctionService();

  cloudID: any;
  httpHeaders = new HttpHeaders();
  options = {
    headers: this.httpHeaders,
  };

  httpHeaders1 = new HttpHeaders();
  options1 = {
    headers: this.httpHeaders1,
  };

  gmUrl = appkeys.gmUrl;
  applicationId = 1;

  baseUrl = appkeys.baseUrl;
  url = appkeys.url;
  retriveimgUrl = appkeys.retriveimgUrl;
  imgUrl = appkeys.imgUrl;
  imgUrl1 = appkeys.imgUrl1;
  dateforlog =
    new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
  emailId = sessionStorage.getItem('emailId');
  userId = Number(sessionStorage.getItem('userId'));
  userName = sessionStorage.getItem('userName');
  roleId = sessionStorage.getItem('roleId');

  constructor(private cookie: CookieService, private httpClient: HttpClient) {
    if (
      this.cookie.get('deviceId') === '' ||
      this.cookie.get('deviceId') === null
    ) {
      var deviceId = this.randomstring(16);
      this.cookie.set(
        'deviceId',
        deviceId.toString(),
        365,
        '/',
        '',
        true,
        'None'
      );
    }
    this.getheader();
  }

  // logoutcall(): Observable<any> {
  //   var data = {
  //     USER_ID: this.commonFunction.decryptdata(
  //       sessionStorage.getItem('userId') || ''
  //     ),
  //   };
  //   return this.httpClient.post<any>(
  //     this.url + 'user/logout ',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  logoutcall(): Observable<any> {
    var data = {
      USER_ID: this.commonFunction.decryptdata(
        sessionStorage.getItem('userId') || ''
      ),
      ROLE_ID: this.commonFunction.decryptdata(
        sessionStorage.getItem('roleId') || ''
      ),
    };
    return this.httpClient.post<any>(
      this.url + 'user/logout ',
      JSON.stringify(data),
      this.options
    );
  }
  randomstring(L: any) {
    var s = '';
    var randomchar = function () {
      var n = Math.floor(Math.random() * 62);
      if (n < 10) return n; //1-10
      if (n < 36) return String.fromCharCode(n + 55); //A-Z
      return String.fromCharCode(n + 61); //a-z
    };
    while (s.length < L) s += randomchar();
    return s;
  }
  // For  Testing server
  // getheader() {
  //   this.httpHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     apikey: 'VnEgKy9sBEXscwr4zs7J18aSjW0YA4fY',
  //     applicationkey: 'awlcQRwoZxAJQm7b',
  //     deviceid: this.cookie.get('deviceId'),
  //     supportkey: this.cookie.get('supportKey'),
  //     Token: this.cookie.get('token'),
  //     skip_zrok_interstitial: 'true',
  //     'ngrok-skip-browser-warning': 'true',
  //   });
  //   this.options = {
  //     headers: this.httpHeaders,
  //   };
  // }
    getheader() {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      apikey: 'BEZhBltbyzL11SPV9YFdH4YgYUKZ6Fla',
      applicationkey: '26lLNSmaKlcFziHH',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
      skip_zrok_interstitial: 'true',
      'ngrok-skip-browser-warning': 'true',
    });
    this.options = {
      headers: this.httpHeaders,
    };
  }

  login(email: string, password: string, cloudid: any, type: any) {
    this.getheader();

    this.options = {
      headers: this.httpHeaders,
    };

    var data = {
      username: email,
      password: password,
      cloudid: cloudid,
      DEVICE_ID: this.cookie.get('deviceId'),
      type: type,
    };

    return this.httpClient.post(
      this.baseUrl + 'user/login',
      JSON.stringify(data),
      this.options
    );
  }

  createUser(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/user/create',
      JSON.stringify(user),
      this.options
    );
  }

  loggerInit() {
    this.getheader();

    this.options1 = {
      headers: this.httpHeaders1,
    };

    var data = {
      CLIENT_ID: this.clientId,
    };

    return this.httpClient.post(
      this.gmUrl + 'device/init',
      JSON.stringify(data),
      this.options1
    );
  }

  getForms(roleId: number) {
    this.getheader();

    this.options = {
      headers: this.httpHeaders,
    };

    var data = {
      ROLE_ID: roleId,
    };

    return this.httpClient.post<any>(
      this.url + 'user/getForms',
      JSON.stringify(data),
      this.options
    );
  }

  getAllForms(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/form/get',
      JSON.stringify(data),
      this.options
    );
  }

  createForm(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/form/create',
      JSON.stringify(form),
      this.options
    );
  }

  updateForm(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.baseUrl + 'api/form/update',
      JSON.stringify(form),
      this.options
    );
  }

  getAllRoles(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/role/get',
      JSON.stringify(data),
      this.options
    );
  }
  getCheckAccessOfForm(roleId: number, link: string) {
    var data = {
      ROLE_ID: roleId,
      LINK: link,
    };
    return this.httpClient.post<any>(
      this.url + 'roleDetail/checkAccess',
      JSON.stringify(data),
      this.options
    );
  }
  createRole(application: any): Observable<any> {
    application.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/role/create',
      JSON.stringify(application),
      this.options
    );
  }

  updateRole(application: any): Observable<any> {
    application.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.baseUrl + 'api/role/update',
      JSON.stringify(application),
      this.options
    );
  }

  updateUser(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.baseUrl + 'api/user/update',
      JSON.stringify(user),
      this.options
    );
  }

  getRoleDetails(roleId: number) {
    var data = {
      ROLE_ID: roleId,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/roleDetail/getData',
      JSON.stringify(data),
      this.options
    );
  }

  getAllUsers(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/user/get',
      JSON.stringify(data),
      this.options
    );
  }

  addRoleDetails(roleId: number, data1: string[]): Observable<any> {
    var data = {
      ROLE_ID: roleId,
      data: data1,
    };

    return this.httpClient.post<any>(
      this.baseUrl + 'api/roleDetail/addBulk',
      data,
      this.options
    );
  }

  sendOTP(TYPE: any, TYPE_VALUE): Observable<any> {
    var data = {
      TYPE: TYPE,
      TYPE_VALUE: TYPE_VALUE,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/sendOtpToDevice',
      JSON.stringify(data),
      this.options
    );
  }

  confirmOTP(passwordData: any): Observable<any> {
    var data = {
      TYPE: passwordData.TYPE,
      TYPE_VALUE: passwordData.TYPE_VALUE,
      OTP: passwordData.OTP,
      RID: passwordData.RID,
      VID: passwordData.VID,
    };

    return this.httpClient.post<any>(
      this.baseUrl + 'api/verifyOtp',
      JSON.stringify(data),
      this.options
    );
  }

  changePassword(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/user/changePassword',
      JSON.stringify(user),
      this.options
    );
  }

  forgetPasswordAdmin(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + 'api/user/forgetPasswordAdmin',
      JSON.stringify(data),
      this.options
    );
  }

  deleteAllCookies() {
    // Retrieve all cookies
    const cookies: string[] = document.cookie.split(';');

    // Iterate over each cookie
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const cookieName =
        eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

      // Explicitly delete the cookie with the root path '/'
      this.cookie.delete(cookieName, '/');
    }
  }

  getDesignationData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/designation/get',
      JSON.stringify(data),
      this.options
    );
  }

  onUpload(folderName, selectedFile, filename): Observable<any> {
    this.onuploadheader();
    let params = new HttpParams();

    const options1 = {
      headers: this.httpHeaders1,
      params: params,
      reportProgress: true,
    };

    const fd = new FormData();
    fd.append('Image', selectedFile, filename);
    const req = new HttpRequest('POST', this.imgUrl + folderName, fd, options1);
    return this.httpClient.request(req);
  }

  // // For Testing server
  // onuploadheader() {
  //   this.httpHeaders1 = new HttpHeaders({
  //     Accept: 'application/json',
  //     apikey: 'VnEgKy9sBEXscwr4zs7J18aSjW0YA4fY',
  //     applicationkey: 'awlcQRwoZxAJQm7b',
  //     supportkey: this.cookie.get('supportKey'),
  //     Token: this.cookie.get('token'),
  //   });

  //   this.options1 = {
  //     headers: this.httpHeaders,
  //   };
  // }

  //Live/Local
    onuploadheader() {
    this.httpHeaders1 = new HttpHeaders({
      Accept: 'application/json',
      apikey: 'BEZhBltbyzL11SPV9YFdH4YgYUKZ6Fla',
      applicationkey: '26lLNSmaKlcFziHH',
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });

    this.options1 = {
      headers: this.httpHeaders,
    };
  }
  // getAllCityMaster(
  //   pageIndex: number,
  //   pageSize: number,
  //   sortKey: string,
  //   sortValue: string,
  //   filter: string
  // ): Observable<any> {
  //   this.getheader();
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter,
  //   };

  //   return this.httpClient.post<any>(
  //     this.url + 'city/get',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  CreateCityMaster(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + 'city/create',
      JSON.stringify(user),
      this.options
    );
  }

  UpdateCityMaster(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;

    return this.httpClient.put<any>(
      this.url + 'city/update',
      JSON.stringify(user),
      this.options
    );
  }

  // createOrganization(organization: OrganizationMaster): Observable<number> {
  //   organization.CLIENT_ID = this.clientId;
  //   return this.httpClient.post<number>(
  //     this.url + 'organisation/createOrg',
  //     JSON.stringify(organization),
  //     this.options
  //   );
  // }

  getAllBranch(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'branch/get',
      JSON.stringify(data),
      this.options
    );
  }
  createBranch(department: any): Observable<number> {
    department.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(
      this.url + 'branch/create',
      JSON.stringify(department),
      this.options
    );
  }

  updateBranch(department: any): Observable<number> {
    department.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(
      this.url + 'branch/update',
      JSON.stringify(department),
      this.options
    );
  }

  getAllPincode(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'pincode/get',
      JSON.stringify(data),
      this.options
    );
  }

  createPincode(pincode: any): Observable<number> {
    pincode.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(
      this.url + 'pincodeShippingCharges/create',
      JSON.stringify(pincode),
      this.options
    );
  }

  updatePincode(pincode: any): Observable<number> {
    pincode.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(
      this.url + 'pincodeShippingCharges/update',
      JSON.stringify(pincode),
      this.options
    );
  }

  getTeritory(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/territory/get',
      JSON.stringify(data),
      this.options
    );
  }

  // getTeritory1(
  //   pageIndex: number,
  //   pageSize: number,
  //   sortKey: string,
  //   sortValue: string,
  //   filter: string
  // ): Observable<any> {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter,
  //   };
  //   return this.httpClient.post<any>(
  //     this.baseUrl + 'api/territory/get',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  updateTerritory(data: any) {
    return this.httpClient.put(
      this.baseUrl + 'api/territory/update',
      JSON.stringify(data),
      this.options
    );
  }

  createTerritory(data: any) {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post(
      this.baseUrl + 'api/territory/create',
      JSON.stringify(data),
      this.options
    );
  }

  getServiceItem(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/service/get',
      JSON.stringify(data),
      this.options
    );
  }

  updateServiceItem(data: any) {
    return this.httpClient.put(
      this.baseUrl + 'api/service/update',
      JSON.stringify(data),
      this.options
    );
  }

  createServiceItem(data: any) {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post(
      this.baseUrl + 'api/service/create',
      JSON.stringify(data),
      this.options
    );
  }

  createUnit(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/unit/create',
      JSON.stringify(form),
      this.options
    );
  }

  updateUnit(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.baseUrl + 'api/unit/update',
      JSON.stringify(user),
      this.options
    );
  }
  // State get, create, update
  getState(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'state/get',
      JSON.stringify(data),
      this.options
    );
  }

  createState(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + 'state/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateState(data: any): Observable<any> {
    return this.httpClient.put<any>(
      this.url + 'state/update',
      JSON.stringify(data),
      this.options
    );
  }

  // City get, create, update
  getCity(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'city/get',
      JSON.stringify(data),
      this.options
    );
  }

  createCity(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + 'city/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateCity(data: any): Observable<any> {
    return this.httpClient.put<any>(
      this.url + 'city/update',
      JSON.stringify(data),
      this.options
    );
  }
  createCountryData(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'country/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateCountryData(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'country/update',
      JSON.stringify(user),
      this.options
    );
  }

  getCustomerCategeroyData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/customerCategory/get',
      JSON.stringify(data),
      this.options
    );
  }
  CreateCustomerCategeroyData(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'customerCategory/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateCustomerCategeroyData(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'customerCategory/update',
      JSON.stringify(user),
      this.options
    );
  }

  // updateCustomerAddress(Address: Address): Observable<number> {
  //   Address.CLIENT_ID = this.clientId;
  //   return this.httpClient.put<number>(
  //     this.url + 'customerAddress/update',
  //     JSON.stringify(Address),
  //     this.options
  //   );
  // }

  getBackofcTerritoryMappedData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/backofficeTerritoryMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  mapBackofficeTerritoryMapping(
    BACKOFFICE_ID: number,
    USER_ID: any,
    BACKOFFICE_NAME: any,
    ROLE_ID: any,
    CLIENT_ID: number,
    datas: any[]
  ): Observable<any> {
    var data = {
      BACKOFFICE_ID: BACKOFFICE_ID,
      USER_ID: USER_ID,
      BACKOFFICE_NAME: BACKOFFICE_NAME,
      ROLE_ID: ROLE_ID,
      CLIENT_ID: CLIENT_ID,
      data: datas,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/backofficeTerritoryMapping/addBulk',
      data,
      this.options
    );
  }

  getServiceSkillMappedData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ) {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post(
      this.baseUrl + 'api/serviceSkillMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  mapServiceSkillMapping(SERVICE_ID: number, CLIENT_ID: number, datas: any[]) {
    var data = { SERVICE_ID: SERVICE_ID, CLIENT_ID: CLIENT_ID, data: datas };
    return this.httpClient.post(
      this.baseUrl + 'api/serviceSkillMapping/addBulk',
      data,
      this.options
    );
  }

  // getKnowledgeBaseCategoryData(
  //   pageIndex: number,
  //   pageSize: number,
  //   sortKey: string,
  //   sortValue: string,
  //   filter: string
  // ): Observable<any> {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter,
  //   };
  //   return this.httpClient.post<any>(
  //     this.baseUrl + 'api/knowledgeBaseCategory/get ',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }
  // createKnowledgeBaseCategoryData(data: any): Observable<any> {
  //   data.CLIENT_ID = this.clientId;
  //   return this.httpClient.post<any>(
  //     this.url + 'knowledgeBaseCategory/create',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  // updateKnowledgeBaseCategoryData(user: any): Observable<any> {
  //   user.CLIENT_ID = this.clientId;
  //   return this.httpClient.put<any>(
  //     this.url + 'knowledgeBaseCategory/update',
  //     JSON.stringify(user),
  //     this.options
  //   );
  // }

  // getKnowledgeBasesubCategoryData(
  //   pageIndex: number,
  //   pageSize: number,
  //   sortKey: string,
  //   sortValue: string,
  //   filter: string
  // ): Observable<any> {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter,
  //   };
  //   return this.httpClient.post<any>(
  //     this.baseUrl + 'api/knowledgebaseSubCategory/get ',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }
  // createKnowledgeBasesubCategoryData(data: any): Observable<any> {
  //   data.CLIENT_ID = this.clientId;
  //   return this.httpClient.post<any>(
  //     this.url + 'knowledgebaseSubCategory/create',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  // updateKnowledgeBasesubCategoryData(user: any): Observable<any> {
  //   user.CLIENT_ID = this.clientId;
  //   return this.httpClient.put<any>(
  //     this.url + 'knowledgebaseSubCategory/update',
  //     JSON.stringify(user),
  //     this.options
  //   );
  // }

  getRecords(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    apiEndpoint: string
  ): Observable<any[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any[]>(
      this.url + apiEndpoint,
      JSON.stringify(data),
      this.options
    );
  }

  // getKnowledgeBaseData(
  //   pageIndex: number,
  //   pageSize: number,
  //   sortKey: string,
  //   sortValue: string,
  //   filter: string
  // ): Observable<any> {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter,
  //   };
  //   return this.httpClient.post<any>(
  //     this.baseUrl + 'api/knowledgeBase/get ',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }
  // createKnowledgeBaseData(data: any): Observable<any> {
  //   data.CLIENT_ID = this.clientId;
  //   return this.httpClient.post<any>(
  //     this.url + 'knowledgeBase/create',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  // updateKnowledgeBaseData(user: any): Observable<any> {
  //   user.CLIENT_ID = this.clientId;
  //   return this.httpClient.put<any>(
  //     this.url + 'knowledgeBase/update',
  //     JSON.stringify(user),
  //     this.options
  //   );
  // }

  getTechnicianPincodeMappedData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/technicianPincodeMapping/get',
      JSON.stringify(data),
      this.options
    );
  }
  addskillsTeachniacianMapping(id: number, datas: any[]): Observable<any> {
    var data = {
      TECHNICIAN_ID: id,
      CLIENT_ID: this.clientId,
      data: datas,
    };

    return this.httpClient.post<any>(
      this.baseUrl + 'api/technicianSkillMapping/addBulk',
      data,
      this.options
    );
  }
  getTechnicianSkillData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/technicianSkillMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  // addTechnicianPincodeMapping(
  //   TECHNICIAN_ID: number,
  //   CLIENT_ID: number,
  //   datas: any[]
  // ): Observable<any> {
  //   var data = {
  //     TECHNICIAN_ID: TECHNICIAN_ID,
  //     CLIENT_ID: CLIENT_ID,
  //     data: datas,
  //   };
  //   return this.httpClient.post<any>(
  //     this.baseUrl + 'api/technicianPincodeMapping/addBulk',
  //     data,
  //     this.options
  //   );
  // }

  //shreya
  getOrdersData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/order/getOrderDetails',
      JSON.stringify(data),
      this.options
    );
  }
  createOrdersDatabasic(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'api/order/create',
      JSON.stringify(data),
      this.options
    );
  }

  createOrdersData(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'order/createOrder',
      JSON.stringify(data),
      this.options
    );
  }
  updateOrdersData(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'api/order/update',
      JSON.stringify(user),
      this.options
    );
  }
  // getstatetax(user: any): Observable<any> {
  //   // user.CLIENT_ID = this.clientId;
  //   return this.httpClient.post<any>(
  //     this.url + "taxDetails/getTaxDetails",
  //     JSON.stringify(user),
  //     this.options
  //   );
  // }

  getstatetax(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    stateid: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      STATE_ID: stateid,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/taxDetails/getTaxDetails',
      JSON.stringify(data),
      this.options
    );
  }
  getorderdetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    ORDER_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      ORDER_ID: ORDER_ID,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/order/getPaymentOrdeDetails',
      JSON.stringify(data),
      this.options
    );
  }

  getActionLog(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/technicianActionLogs/getDateWiseLogs',
      JSON.stringify(data),
      this.options
    );
  }
  getInvoiceLogs(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/invoice/getInvoiceLogs',
      JSON.stringify(data),
      this.options
    );
  }

  getInvoice(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/invoice/get',
      JSON.stringify(data),
      this.options
    );
  }
  //Inventory Master
  getInventory(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'inventory/get ',
      JSON.stringify(data),
      this.options
    );
  }

  getInventorySubCategory(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'inventorySubCategory/get ',
      JSON.stringify(data),
      this.options
    );
  }
  createInventorySubCategory(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'inventorySubCategory/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateInventorySubCategory(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'inventorySubCategory/update',
      JSON.stringify(user),
      this.options
    );
  }
  getInventoryCategory(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/inventoryCategory/get',
      JSON.stringify(data),
      this.options
    );
  }
  getWarehousesLocation(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'warehouseLocations/get ',
      JSON.stringify(data),
      this.options
    );
  }
  createWarehousesLocation(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'warehouseLocations/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateWarehousesLocation(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'warehouseLocations/update',
      JSON.stringify(user),
      this.options
    );
  }

  getWarehouses(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'warehouse/get ',
      JSON.stringify(data),
      this.options
    );
  }
  createInventoryAdjustment(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'inventoryAdjustment/create',
      JSON.stringify(data),
      this.options
    );
  }
  getInventoryTransactions(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'inventoryTransactions/get',
      JSON.stringify(data),
      this.options
    );
  }
  // getTechnicianDataFilter(
  //   pageIndex: number,
  //   pageSize: number,
  //   sortKey: string,
  //   sortValue: string,
  //   filter: string,
  //   TYPE: any,
  //   SKILL_ID: any,
  //   EXPERIANCE: any,
  //   PINCODE_ID: any
  // ): Observable<any> {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter,
  //     TYPE: TYPE,
  //     SKILL_ID: SKILL_ID,
  //     EXPERIANCE: EXPERIANCE,
  //     PINCODE_ID: PINCODE_ID,
  //   };
  //   return this.httpClient.post<any>(
  //     this.baseUrl + 'api/technicianLocationTrack/getTechnicianLocations',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  getTechnicaionActionLog(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/technicianActionLogs/get',
      JSON.stringify(data),
      this.options
    );
  }

  getTechnicaionLoacionTrack(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/technicianLocationTrack/get',
      JSON.stringify(data),
      this.options
    );
  }
  //Order Review
  getCustomerReviewData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    ORDER_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      ORDER_ID: ORDER_ID,
    };

    return this.httpClient.post<any>(
      this.url + 'customerServiceFeedback/getCustomerServiceFeedback',
      JSON.stringify(data),
      this.options
    );
  }

  getTechnicianReviewData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    ORDER_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      ORDER_ID: ORDER_ID,
    };

    return this.httpClient.post<any>(
      this.url + 'customertechnicianfeedback/getcustomerTechnicianFeedback',
      JSON.stringify(data),
      this.options
    );
  }

  // Past Order
  getAllPastOrders(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/order/get',
      JSON.stringify(data),
      this.options
    );
  }

  // Accept Order
  acceptorder(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.patch<any>(
      this.baseUrl + 'api/order/orderUpdateStatus',
      JSON.stringify(form),
      this.options
    );
  }

  // getjobcardTechnicianMapping(
  //   pageIndex: number,
  //   pageSize: number,
  //   sortKey: string,
  //   sortValue: string,
  //   filter: string
  // ): Observable<any> {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter,
  //   };
  //   return this.httpClient.post<any>(
  //     this.baseUrl + 'api/jobCardTechnicianMapping/get',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  getorderDetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/orderDetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  jobCardChat(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/jobcardchat/get',
      JSON.stringify(data),
      this.options
    );
  }

  jobCardChatDetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/jobcardchatdetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  OrderAddressMap(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/orderMasterAddressMap/get',
      JSON.stringify(data),
      this.options
    );
  }

  Ordermaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/order/get',
      JSON.stringify(data),
      this.options
    );
  }
  getterritoryServiceData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    TERRITORY_ID: number
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      TERRITORY_ID: TERRITORY_ID,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/serviceCatalog/getMappedServices',
      JSON.stringify(data),
      this.options
    );
  }
  addTerritoryServiceMapping(
    TERRITORY_ID: number,
    CLIENT_ID: number,
    datas: any[]
  ): Observable<any> {
    var data = {
      TERITORY_ID: TERRITORY_ID,
      CLIENT_ID: CLIENT_ID,
      data: datas,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/territoryServicenOnAvailabilityMapping/addBulk',
      data,
      this.options
    );
  }

  createInventoryCategory(form: any): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + 'api/inventoryCategory/create',
      JSON.stringify(form),
      this.options
    );
  }

  updateInventoryCategory(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.baseUrl + 'api/inventoryCategory/update',
      JSON.stringify(user),
      this.options
    );
  }
  // Support category calls

  createSupportSubcategory(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'supportSubCategory/create',
      JSON.stringify(data),
      this.options
    );
  }
  updateSupportSubcategory(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'supportSubCategory/update',
      JSON.stringify(user),
      this.options
    );
  }

  getSupportSubcategory(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/supportSubCategory/get',
      JSON.stringify(data),
      this.options
    );
  }
  CreateCustomersupport(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'supportCategory/create',
      JSON.stringify(data),
      this.options
    );
  }

  UpdateCustomersupport(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'supportCategory/update',
      JSON.stringify(user),
      this.options
    );
  }

  getSupportCategory(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/supportCategory/get ',
      JSON.stringify(data),
      this.options
    );
  }
  getCustomerSupport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/supportCategory/get ',
      JSON.stringify(data),
      this.options
    );
  }

  createPurchaseOrder(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'inventoryPurchase/createPurchase',
      JSON.stringify(data),
      this.options
    );
  }

  updatePurchaseOrder(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'inventoryPurchase/updatePurchase',
      JSON.stringify(user),
      this.options
    );
  }
  addsLanguagesTeachniacianMapping(id: number, datas: any[]): Observable<any> {
    var data = {
      TECHNICIAN_ID: id,

      CLIENT_ID: this.clientId,

      data: datas,
    };

    return this.httpClient.post<any>(
      this.baseUrl + 'api/technicianLanguageMapping/addBulk',

      data,

      this.options
    );
  }

  getTechnicianLanguagesData(
    pageIndex: number,

    pageSize: number,

    sortKey: string,

    sortValue: string,

    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,

      pageSize: pageSize,

      sortKey: sortKey,

      sortValue: sortValue,

      filter: filter,
    };

    return this.httpClient.post<any>(
      this.baseUrl + 'api/technicianLanguageMapping/get',

      JSON.stringify(data),

      this.options
    );
  }
  getInventorymovement(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'inventoryMovement/get ',
      JSON.stringify(data),
      this.options
    );
  }
  createInventoryMovement(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'inventoryMovement/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateInventorymovement(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'inventoryMovement/update',
      JSON.stringify(user),
      this.options
    );
  }
  getAllOrganizationsNew(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'organisation/getData',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  updateCustomerAddressDef(Address): Observable<number> {
    return this.httpClient.put<number>(
      this.url + 'customer/updateAddressDefault',
      JSON.stringify(Address),
      this.options
    );
  }

  getDistrictData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/district/get',
      JSON.stringify(data),
      this.options
    );
  }

  createDistrict(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/district/create',
      JSON.stringify(form),
      this.options
    );
  }

  updateDistrict(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.baseUrl + 'api/district/update',
      JSON.stringify(user),
      this.options
    );
  }

  createServiceMain(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/service/create',
      JSON.stringify(form),
      this.options
    );
  }

  updateServiceMain(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.baseUrl + 'api/service/update',
      JSON.stringify(user),
      this.options
    );
  }

  getInventoryCategoryData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/inventoryCategory/get',
      JSON.stringify(data),
      this.options
    );
  }

  createInventoryCategoryData(form: any): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + 'api/inventoryCategory/create',
      JSON.stringify(form),
      this.options
    );
  }

  updateInventoryCategoryData(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.baseUrl + 'api/inventoryCategory/update',
      JSON.stringify(user),
      this.options
    );
  }

  // shubhammmm

  getdistrict(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'district/get',
      JSON.stringify(data),
      this.options
    );
  }

  // getTechnicianunMappedpincodesData(
  //   pageIndex: number,
  //   pageSize: number,
  //   sortKey: string,
  //   sortValue: string,
  //   filter: string,
  //   TECHNICIAN_ID: any
  // ): Observable<any> {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter,
  //     TECHNICIAN_ID: TECHNICIAN_ID,
  //   };
  //   return this.httpClient.post<any>(
  //     this.baseUrl + 'api/technician/unMappedpincodes',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }
  getTechnicianunMappedpincodesDataterritory(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    TECHNICIAN_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      TERRITORY_ID: TECHNICIAN_ID,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/territory/unMappedpincodes',
      JSON.stringify(data),
      this.options
    );
  }

  addTechnicianPincodeMapping(
    TECHNICIAN_ID: number,
    TECHNICIAN_NAME: any,
    datas: any[],
    STATUS: any
  ): Observable<any> {
    var data = {
      TECHNICIAN_ID: TECHNICIAN_ID,
      TECHNICIAN_NAME: TECHNICIAN_NAME,
      data: datas,
      STATUS: STATUS,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/technician/mapPincodes',
      data,
      this.options
    );
  }
  markasinactivedata(TECHNICIAN_ID: number, datas: any[]): Observable<any> {
    var data = {
      TECHNICIAN_ID: TECHNICIAN_ID,
      data: datas,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/technician/unMapPincodes',
      data,
      this.options
    );
  }

  getSkillData11(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    TECHNICIAN_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      TECHNICIAN_ID: TECHNICIAN_ID,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/technician/unMappedSkills',
      JSON.stringify(data),
      this.options
    );
  }

  getTechnicianmapdata(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/technicianSkillMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  markasinactivedataskill(
    TECHNICIAN_ID: number,
    datas: any[]
  ): Observable<any> {
    var data = {
      TECHNICIAN_ID: TECHNICIAN_ID,
      data: datas,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/technician/unMapSkills',
      data,
      this.options
    );
  }

  addTechnicianPincodeMappingskills(
    TECHNICIAN_ID: number,
    datas: any[],
    STATUS: any,
    SKILL_LEVEL: any,
    IS_ACTIVE: any
  ): Observable<any> {
    var data = {
      TECHNICIAN_ID: TECHNICIAN_ID,
      data: datas,
      STATUS: STATUS,
      SKILL_LEVEL: SKILL_LEVEL,
      IS_ACTIVE: IS_ACTIVE,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/technician/mapSkills',
      data,
      this.options
    );
  }

  getTechnicianPincodeMappedDatateirriry(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/territory/mapPincodes',
      JSON.stringify(data),
      this.options
    );
  }

  addTechnicianPincodeMappingteroorty(
    TECHNICIAN_ID: number,
    datas: any[],
    STATUS: any
  ): Observable<any> {
    var data = {
      TERRITORY_ID: TECHNICIAN_ID,
      data: datas,
      STATUS: STATUS,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/territory/mapPincodes',
      data,
      this.options
    );
  }

  markasinactivedatatettory(
    TECHNICIAN_ID: number,
    datas: any[]
  ): Observable<any> {
    var data = {
      TERRITORY_ID: TECHNICIAN_ID,
      data: datas,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/territory/unMapPincodes',
      data,
      this.options
    );
  }

  getterritoryPincodeData11(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/territoryPincodeMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  getSkillData11service(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    TECHNICIAN_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      SERVICE_ID: TECHNICIAN_ID,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/service/unMappedSkills',
      JSON.stringify(data),
      this.options
    );
  }

  getUnmapDocumentsservice(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    SERVICE_ID: any,
    CATEGORY_ID: number,
    SUBCATEGORY_ID: number
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      SERVICE_ID: SERVICE_ID,
      CATEGORY_ID: CATEGORY_ID,
      SUBCATEGORY_ID: SUBCATEGORY_ID,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/serviceDocument/unMappedServiceDocument',
      JSON.stringify(data),
      this.options
    );
  }

  getTechnicianmapdataservice(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/serviceSkillMapping/get',
      JSON.stringify(data),
      this.options
    );
  }
  getMappedHelpDocs(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    // api/serviceDocument/mappedServiceDocument
    return this.httpClient.post<any>(
      this.baseUrl + 'api/serviceDocumemtMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  addTechnicianPincodeMappingskillsservice(
    TECHNICIAN_ID: number,
    datas: any[],
    STATUS: any
  ): Observable<any> {
    var data = {
      SERVICE_ID: TECHNICIAN_ID,
      data: datas,
      STATUS: STATUS,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/service/mapSkills',
      data,
      this.options
    );
  }

  addDOcs(
    TECHNICIAN_ID: number,
    datas: any[],
    STATUS: any,
    CATEGORY_ID: number,
    SUBCATEGORY_ID: number
  ): Observable<any> {
    var data = {
      SERVICE_ID: TECHNICIAN_ID,
      SERVICE_DATA: datas,
      STATUS: STATUS,
      CLIENT_ID: 1,
      CATEGORY_ID: CATEGORY_ID,
      SUBCATEGORY_ID: SUBCATEGORY_ID,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/serviceDocument/mapServiceDocument',
      data,
      this.options
    );
  }

  markasinactivedataskillservice(
    TECHNICIAN_ID: number,
    datas: any[]
  ): Observable<any> {
    var data = {
      SERVICE_ID: TECHNICIAN_ID,
      data: datas,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/service/unMapSkills',
      data,
      this.options
    );
  }

  markasinactivedataDocs(TECHNICIAN_ID: number, datas: any[]): Observable<any> {
    var data = {
      SERVICE_ID: TECHNICIAN_ID,
      SERVICE_DATA: datas,
      CLIENT_ID: 1,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/serviceDocument/mapServiceDocument',
      data,
      this.options
    );
  }

  specificDocMapUnmap(
    TECHNICIAN_ID: number,
    datas: any[],
    STATUS: any
  ): Observable<any> {
    var data = {
      SERVICE_ID: TECHNICIAN_ID,
      DATA: datas,
      STATUS: STATUS,
      CLIENT_ID: 1,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/serviceDocument/unMapService',
      data,
      this.options
    );
  }

  getpendinjobsdataa(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/jobCard/get',
      JSON.stringify(data),
      this.options
    );
  }

  getJobCardsForSchedular(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/jobCard/getJobsforDispatcher',
      JSON.stringify(data),
      this.options
    );
  }

  // getTechnicianLanguagesData(
  //   pageIndex: number,

  //   pageSize: number,

  //   sortKey: string,

  //   sortValue: string,

  //   filter: string
  // ): Observable<any> {
  //   var data = {
  //     pageIndex: pageIndex,

  //     pageSize: pageSize,

  //     sortKey: sortKey,

  //     sortValue: sortValue,

  //     filter: filter,
  //   };

  //   return this.httpClient.post<any>(
  //     this.baseUrl + 'api/technicianLanguageMapping/get',

  //     JSON.stringify(data),

  //     this.options
  //   );
  // }
  getTechnicianLanguageData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/technicianLanguageMapping/get',
      JSON.stringify(data),
      this.options
    );
  }
  addServiceTeachniacianMapping(id: number, datas: any[]): Observable<any> {
    var data = {
      TECHNICIAN_ID: id,
      CLIENT_ID: this.clientId,
      data: datas,
    };

    return this.httpClient.post<any>(
      this.baseUrl + 'api/technicianServiceCostMapping/addBulk',
      data,
      this.options
    );
  }
  getTechnicianServiceData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/technicianServiceCostMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  // getemailServiceConfigData(
  //   pageIndex: number,
  //   pageSize: number,
  //   sortKey: string,
  //   sortValue: string,
  //   filter: string
  // ): Observable<any> {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter,
  //   };

  //   return this.httpClient.post<any>(
  //     this.baseUrl + 'api/emailServiceConfig/get',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  // CreateemailServiceConfigData(data: any): Observable<any> {
  //   data.CLIENT_ID = this.clientId;
  //   return this.httpClient.post<any>(
  //     this.url + 'emailServiceConfig/create',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  // updateemailServiceConfigData(user: any): Observable<any> {
  //   user.CLIENT_ID = this.clientId;
  //   return this.httpClient.put<any>(
  //     this.url + 'emailServiceConfig/update',
  //     JSON.stringify(user),
  //     this.options
  //   );
  // }

  GetCustomersupport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/supportCategory/get ',
      JSON.stringify(data),
      this.options
    );
  }

  // updateOrganization(organization: OrganizationMaster): Observable<number> {
  //   organization.CLIENT_ID = this.clientId;
  //   return this.httpClient.post<number>(
  //     this.url + 'organisation/updateOrg',
  //     JSON.stringify(organization),
  //     this.options
  //   );
  // }

  getDistrict(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'district/get',
      JSON.stringify(data),
      this.options
    );
  }

  // 14-12-2024 shreya

  getOrgTime(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/orgnizationServiceCalender/get',
      JSON.stringify(data),
      this.options
    );
  }

  getServiceTerritoryget(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    TERRITORY_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      TERRITORY_ID: TERRITORY_ID,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/service/serviceList',
      JSON.stringify(data),
      this.options
    );
  }

  getServiceCustomerget(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    CUSTOMER_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      CUSTOMER_ID: CUSTOMER_ID,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/service/b2bserviceList',
      JSON.stringify(data),
      this.options
    );
  }

  // getServiceTerritoryDetailsget(
  //   pageIndex: number,
  //   pageSize: number,
  //   sortKey: string,
  //   sortValue: string,
  //   filter: string, TERRITORY_ID: any
  // ): Observable<any> {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter,
  //     TERRITORY_ID: TERRITORY_ID
  //   };
  //   return this.httpClient.post<any>(
  //     this.baseUrl + "api/territoryServicenOnAvailabilityMapping/serviceDetails",
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  getServiceTerritoryNonget(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/territoryServicenOnAvailabilityMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  getServiceTerritoryDetailscreate(form: any): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + 'api/territoryServicenOnAvailabilityMapping/create',
      JSON.stringify(form),
      this.options
    );
  }

  getServiceTerritoryDetailsupdate(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.baseUrl + 'api/territoryServicenOnAvailabilityMapping/update',
      JSON.stringify(user),
      this.options
    );
  }

  getcategoryhierarchy(): Observable<any> {
    var data = {};
    return this.httpClient.get<any>(
      this.baseUrl + 'api/service/getCategories',
      this.options
    );
  }

  getCustomerReviewData11(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'customerServiceFeedback/getCustomerServiceFeedback',
      JSON.stringify(data),
      this.options
    );
  }

  // /api/techniciancustomerfeedback/get
  // /api/customertechnicianfeedback/get

  getemailServiceConfigData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.baseUrl + 'api/emailServiceConfig/get',
      JSON.stringify(data),
      this.options
    );
  }

  CreateemailServiceConfigData(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'emailServiceConfig/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateemailServiceConfigData(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'emailServiceConfig/update',
      JSON.stringify(user),
      this.options
    );
  }

  getWhatsappServiceConfigData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.baseUrl + 'api/whatsappserviceconfig/get',
      JSON.stringify(data),
      this.options
    );
  }

  CreateWhatsappServiceConfigData(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'whatsappserviceconfig/create',
      JSON.stringify(data),
      this.options
    );
  }

  updatewhatsappServiceConfigData(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'whatsappserviceconfig/update',
      JSON.stringify(user),
      this.options
    );
  }

  createPaymentGatewayData(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'paymentGateway/create',
      JSON.stringify(data),
      this.options
    );
  }
  updatePaymentGatewayData(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'paymentGateway/update',
      JSON.stringify(user),
      this.options
    );
  }

  getPaymentGatewayData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/paymentGateway/get',
      JSON.stringify(data),
      this.options
    );
  }

  getSmsServiceConfigData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.baseUrl + 'api/smsServiceConfig/get',
      JSON.stringify(data),
      this.options
    );
  }

  CreateSmsServiceConfigData(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'smsServiceConfig/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateSmsServiceConfigData(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'smsServiceConfig/update',
      JSON.stringify(user),
      this.options
    );
  }

  getWarehouseData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.baseUrl + 'api/warehouse/get',
      JSON.stringify(data),
      this.options
    );
  }

  CreateWarehouseData(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'warehouse/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateWarehouseData(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'warehouse/update',
      JSON.stringify(user),
      this.options
    );
  }

  //Sanjana

  createTemplate(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/whatsappTemplate/create',
      JSON.stringify(form),
      this.options
    );
  }

  getAllTemplates(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/whatsappTemplate/get',
      JSON.stringify(data),
      this.options
    );
  }

  // onImageUpload(userId: any, folderName: any, selectedFile: any, filename: any): Observable<any> {
  //   this.httpHeaders1 = new HttpHeaders({
  //     Accept: 'application/json',
  //     'apikey': 'BEZhBltbyzL11SPV9YFdH4YgYUKZ6Fla',
  //     'applicationkey': '26lLNSmaKlcFziHH',
  //     Token: this.cookie.get('token'),
  //     supportkey: this.cookie.get('supportKey'),
  //     WP_CLIENT_ID: userId
  //   });
  //   this.options1 = {
  //     headers: this.httpHeaders1,
  //   };

  //   const fd = new FormData();

  //   fd.append('Image', selectedFile, filename);
  //   return this.httpClient.post<any>(appkeys.imgUrl1 + folderName, fd, this.options1
  //   );
  // }

  // onUpload1(userId: any, folderName: any, selectedFile: any, filename: any) {
  //   this.httpHeaders1 = new HttpHeaders({
  //     Accept: 'application/json',
  //     'apikey': 'BEZhBltbyzL11SPV9YFdH4YgYUKZ6Fla',
  //     'applicationkey': '26lLNSmaKlcFziHH',
  //     Token: this.cookie.get('token'),
  //     supportkey: this.cookie.get('supportKey'),
  //     WP_CLIENT_ID: userId
  //   });

  //   const queryParams = new HttpParams().set('WP_CLIENT_ID', userId); // Add WP_CLIENT_ID as a query parameter

  //   this.options1 = {
  //     headers: this.httpHeaders1,
  //   };

  //   const fd = new FormData();
  //   fd.append('Image', selectedFile, filename);

  //   return this.httpClient.post<any>(appkeys.imgUrl1 + folderName, fd, this.options1);
  // }

  // onUploadFiles(
  //   userId,
  //   file,
  // ): Observable<any> {
  //   this.httpHeaders1 = new HttpHeaders({
  //     Accept: 'application/json',
  //     'apikey': 'BEZhBltbyzL11SPV9YFdH4YgYUKZ6Fla',
  //     'applicationkey': '26lLNSmaKlcFziHH',
  //     Token: this.cookie.get('token'),
  //     supportkey: this.cookie.get('supportKey'),
  //     WP_CLIENT_ID: userId
  //   });
  //   this.options1 = {
  //     headers: this.httpHeaders1,
  //   };
  //   const fd = new FormData();

  //   fd.append('Image', file);
  //   return this.httpClient.post<any>(
  //     this.baseUrl + 'upload/WhatsAppTemplateImages',
  //     fd,
  //     this.options1
  //   );
  // }

  getTechnicaionLoacionTrackmultiple(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl +
        'api/technicianLocationTrack/getTechnicianLocationsByFilter',
      JSON.stringify(data),
      this.options
    );
  }

  getnotifications(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'notification/get',
      JSON.stringify(data),
      this.options
    );
  }

  getPaymentTransaction(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<[]>(
      this.url + 'invoicepaymentdetails/getPaymentTransactions',
      JSON.stringify(data),
      this.options
    );
  }

  getCategories(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.get<any>(
      this.baseUrl + 'api/order/getCategories',

      this.options
    );
  }
  // getServices(
  //   pageIndex: number,
  //   pageSize: number,
  //   sortKey: string,
  //   sortValue: string,
  //   filter: string,
  //   SUB_CATEGORY_ID: number,
  //   SEARCHKEY: string,
  //   PARENT_ID: number,
  //   TERRITORY_ID: number,
  //   CUSTOMER_TYPE: number
  // ): Observable<any> {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     SUB_CATEGORY_ID: SUB_CATEGORY_ID,
  //     SEARCHKEY: SEARCHKEY,
  //     PARENT_ID: PARENT_ID,
  //     TERRITORY_ID: TERRITORY_ID,
  //     CUSTOMER_TYPE: CUSTOMER_TYPE
  //   };
  //   return this.httpClient.post<any>(
  //     this.baseUrl + 'api/order/getServices',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  techniciancustomerfeedback(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    CUSTOMER_MANAGER_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      CUSTOMER_MANAGER_ID: CUSTOMER_MANAGER_ID,
    };

    return this.httpClient.post<any>(
      this.url + 'technicianCustomerFeedback/getTechnicianCustomerFeedback',
      JSON.stringify(data),
      this.options
    );
  }

  getTechnicianReviewData1(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    CUSTOMER_MANAGER_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      CUSTOMER_MANAGER_ID: CUSTOMER_MANAGER_ID,
    };

    return this.httpClient.post<any>(
      this.url + 'customertechnicianfeedback/getcustomerTechnicianFeedback',
      JSON.stringify(data),
      this.options
    );
  }

  createJobCard(data: any): Observable<number> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(
      this.url + 'jobCard/createJobCard',
      JSON.stringify(data),
      this.options
    );
  }

  // gettechciansheduledata(
  //   pageIndex: number,
  //   pageSize: number,
  //   sortKey: string,
  //   sortValue: string,
  //   filter: string,
  //   SERVICE_DATA: any,
  //   SortOrder: any
  // ): Observable<any> {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter,
  //     SERVICE_DATA: SERVICE_DATA,
  //     SortOrder: SortOrder,
  //   };
  //   return this.httpClient.post<any>(
  //     this.baseUrl + 'api/technicianJobSchedule/getTechnicians',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  createassignshedule(dataaaa): Observable<any> {
    return this.httpClient.post<number>(
      this.url + 'technicianJobSchedule/scheduleJob',
      JSON.stringify(dataaaa),
      this.options
    );
  }

  getDistinctData(
    TAB_ID: number,
    keywords: string
    // filter: string
  ): Observable<any> {
    var data = {
      TAB_ID: TAB_ID,
      keywords: keywords,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/searchData/getDistinctData',
      JSON.stringify(data),
      this.options
    );
  }
  gettechnicianjobshedule(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    IS_C_MANGER: any,
    CUSTOMER_MANAGER_ID: any,
    TERRITORY_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      IS_C_MANGER: IS_C_MANGER,
      CUSTOMER_MANAGER_ID: CUSTOMER_MANAGER_ID,
      TERRITORY_ID: TERRITORY_ID,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/technicianJobSchedule/get',
      JSON.stringify(data),
      this.options
    );
  }
  gettechnicianjobshedulecount(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    DATE: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      DATE: DATE,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/technicianJobSchedule/getJobCounts',
      JSON.stringify(data),
      this.options
    );
  }

  getSmsTemplates(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/smsTemplate/get',
      JSON.stringify(data),
      this.options
    );
  }

  createSmsTemplate(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/smsTemplate/create',
      JSON.stringify(form),
      this.options
    );
  }

  updateSmsTemplate(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'smsTemplate/update',
      JSON.stringify(user),
      this.options
    );
  }

  BulkServiceUpdate(TERRITORY_ID: any, data: any): Observable<any> {
    var datas = {
      TERRITORY_ID: TERRITORY_ID,
      data: data,
      CLIENT_ID: 1,
    };
    return this.httpClient.post<any>(
      this.baseUrl +
        'api/territoryServicenOnAvailabilityMapping/addBulkService',
      JSON.stringify(datas),
      this.options
    );
  }

  BulkServiceUpdateB2b(CUSTOMER_ID: any, data: any): Observable<any> {
    var datas = {
      CUSTOMER_ID: CUSTOMER_ID,
      data: data,
      CLIENT_ID: 1,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/b2bAvailabilityMapping/addBulkService',
      JSON.stringify(datas),
      this.options
    );
  }
  // createEmailTemplate(form: any): Observable<any> {
  //   form.CLIENT_ID = this.clientId;
  //   return this.httpClient.post<any>(
  //     this.baseUrl + 'api/emailTemplate/create',
  //     JSON.stringify(form),
  //     this.options
  //   );
  // }

  getBulkdataForServiceChange(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    TERRITORY_ID: number
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      TERRITORY_ID: TERRITORY_ID,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/service/getMappedServices',
      JSON.stringify(data),
      this.options
    );
  }

  updateassignshedule(dataaaa): Observable<any> {
    return this.httpClient.post<number>(
      this.url + 'technicianJobSchedule/updateScheduleJob',
      JSON.stringify(dataaaa),
      this.options
    );
  }

  createEmailTemplate(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/emailTemplate/create',
      JSON.stringify(form),
      this.options
    );
  }

  getKBFeedbackTransaction(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<[]>(
      this.url + 'knowledgeBaseFeedbackTransactions/get',
      JSON.stringify(data),
      this.options
    );
  }
  updateEmailTemplate(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'emailTemplate/update',
      JSON.stringify(user),
      this.options
    );
  }
  getEmailTemplates(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/emailTemplate/get',
      JSON.stringify(data),
      this.options
    );
  }

  getHelpDoc(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/serviceDocument/get',
      JSON.stringify(data),
      this.options
    );
  }

  createHelpDoc(organization: any): Observable<number> {
    organization.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(
      this.url + 'serviceDocument/create',
      JSON.stringify(organization),
      this.options
    );
  }

  updateHelpDoc(organization: any): Observable<number> {
    organization.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(
      this.url + 'serviceDocument/update',
      JSON.stringify(organization),
      this.options
    );
  }

  // getMultiServiceHierarchy(): Observable<any> {
  //   var data = {};
  //   return this.httpClient.post<any>(
  //     this.baseUrl + 'api/service/getServiceHirechy',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  getMultiServiceHierarchy(TERRITORY_ID: any): Observable<any> {
    var data = {
      TERRITORY_ID: TERRITORY_ID,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/service/getServiceHirechy',
      JSON.stringify(data),
      this.options
    );
  }

  getMultiServiceHierarchyForB2b(CUSTOMER_ID: any): Observable<any> {
    var data = {
      CUSTOMER_ID: CUSTOMER_ID,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/service/getb2bServiceHirechy',
      JSON.stringify(data),
      this.options
    );
  }

  BulkServiceADd(TERRITORY_ID: any, service_ids: any): Observable<any> {
    var datas = {
      TERRITORY_ID: TERRITORY_ID,
      service_ids: service_ids,
      CLIENT_ID: 1,
    };
    return this.httpClient.post<any>(
      this.baseUrl +
        'api/territoryServicenOnAvailabilityMapping/mapNonServiceTeritory',
      JSON.stringify(datas),
      this.options
    );
  }

  b2bAvailabilityMapping(CUSTOMER_ID: any, service_ids: any): Observable<any> {
    var data = {
      CUSTOMER_ID: CUSTOMER_ID,
      service_ids: service_ids,
      CLIENT_ID: 1,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/b2bAvailabilityMapping/mapServicesCustomer',
      JSON.stringify(data),
      this.options
    );
  }

  getServiceTerritoryNongetB2B(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/b2bAvailabilityMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  getServiceTerritoryDetailscreateb2b(form: any): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + 'api/b2bAvailabilityMapping/create',
      JSON.stringify(form),
      this.options
    );
  }

  getServiceTerritoryDetailsupdateb2b(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.baseUrl + 'api/b2bAvailabilityMapping/update',
      JSON.stringify(user),
      this.options
    );
  }

  getcurrentlocatiooftech(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    SCHEDULED_DATE_TIME: any,
    START_TIME: any,
    END_TIME: any,
    TECHNICIAN_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      SCHEDULED_DATE_TIME: SCHEDULED_DATE_TIME,
      START_TIME: START_TIME,
      END_TIME: END_TIME,
      TECHNICIAN_ID: TECHNICIAN_ID,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/jobCard/getAssignedJobs',
      JSON.stringify(data),
      this.options
    );
  }
  // getjobsbetween(
  //   pageIndex: number,
  //   pageSize: number,
  //   sortKey: string,
  //   sortValue: string,
  //   filter: string,
  //   SCHEDULED_DATE_TIME: any,
  //   START_TIME: any,
  //   END_TIME: any,
  //   TECHNICIAN_ID: any
  // ): Observable<any> {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter,
  //     SCHEDULED_DATE_TIME: SCHEDULED_DATE_TIME,
  //     START_TIME: START_TIME,
  //     END_TIME: END_TIME,
  //     TECHNICIAN_ID: TECHNICIAN_ID
  //   };
  //   return this.httpClient.post<any>(
  //     this.baseUrl + "api/jobcard/getBetweenJobs",
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  getjobsbetween(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    SCHEDULED_DATE_TIME: any,
    START_TIME: any,
    END_TIME: any,
    TECHNICIAN_ID: any,
    LATTITUTE: any,
    LONGITUDE: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      SCHEDULED_DATE_TIME: SCHEDULED_DATE_TIME,
      START_TIME: START_TIME,
      END_TIME: END_TIME,
      TECHNICIAN_ID: TECHNICIAN_ID,
      LATTITUTE: LATTITUTE,
      LONGITUDE: LONGITUDE,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/jobcard/getBetweenJobs',
      JSON.stringify(data),
      this.options
    );
  }

  gettechnicianconfigruationdata(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/technicianConfigurations/get',
      JSON.stringify(data),
      this.options
    );
  }

  createconfigration(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/technicianConfigurations/create',
      JSON.stringify(user),
      this.options
    );
  }

  updateconfigration(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.baseUrl + 'api/technicianConfigurations/update',
      JSON.stringify(user),
      this.options
    );
  }

  jobcompletion(customer: any): Observable<number> {
    // customer.CLIENT_ID = this.clientId;
    var data = {
      HAPPY_CODE: customer,
    };
    return this.httpClient.post<number>(
      this.baseUrl + 'app/technician/confirmByLink',
      JSON.stringify(data),
      this.options
    );
  }

  getServices(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    SUB_CATEGORY_ID: number,
    SEARCHKEY: string,
    PARENT_ID: number,
    TERRITORY_ID: number,
    CUSTOMER_TYPE: any,
    CUSTOMER_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      SUB_CATEGORY_ID: SUB_CATEGORY_ID,
      SEARCHKEY: SEARCHKEY,
      PARENT_ID: PARENT_ID,
      TERRITORY_ID: TERRITORY_ID,
      CUSTOMER_TYPE: CUSTOMER_TYPE,
    };
    if (CUSTOMER_TYPE == 'B') data['CUSTOMER_ID'] = CUSTOMER_ID;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/order/getServices',
      JSON.stringify(data),
      this.options
    );
  }

  getCustTechRatings(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/customertechnicianfeedback/get',
      JSON.stringify(data),
      this.options
    );
  }

  createCustTechRatings(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.url + 'customertechnicianfeedback/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateCustTechRatings(user: any): Observable<any> {
    return this.httpClient.put<any>(
      this.url + 'customertechnicianfeedback/update',
      JSON.stringify(user),
      this.options
    );
  }

  getServiceDetailsGetForHTMLContent(ID: number): Observable<any> {
    var data = {
      ID: ID,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/service/getData',
      JSON.stringify(data),
      this.options
    );
  }

  getCategoriesForOrder(TERRITORY_ID, CUSTOMER_ID): Observable<any> {
    var data = {
      TERRITORY_ID: TERRITORY_ID,
      CUSTOMER_ID: CUSTOMER_ID,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/order/getCategories',
      JSON.stringify(data),
      this.options
    );
  }

  // createFilterData(data: any): Observable<any> {
  //   return this.httpClient.post<any>(
  //     this.url + 'saveFilter/create',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }
  createFilterData(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'saveFilter/create',
      JSON.stringify(data),
      this.options
    );
  }

  // deleteFilterById(id: string): Observable<any> {
  //   // const url = `${this.url}/delete/${id}`;
  //   return this.httpClient.post(this.url + `saveFilter/delete/${id}`, {}, this.options); // Sending a POST request with no body
  // }

  deleteFilterById(id: number): Observable<any> {
    // API endpoint with the id as a path parameter
    const url = `${this.baseUrl}api/saveFilter/delete/${id}`;

    // Make the POST API call
    return this.httpClient.post<any>(
      url, // API URL
      {}, // Empty body (if no additional payload is required)
      this.options // HTTP options (e.g., headers)
    );
  }

  getFilterData1(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.getheader();
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'saveFilter/get',
      JSON.stringify(data),
      this.options
    );
  }

  getFilterData(
    TAB_ID: number,
    USER_ID: number,
    CLIENT_ID: number,
    filter: string
  ): Observable<any> {
    const data = {
      TAB_ID: TAB_ID,
      USER_ID: USER_ID,
      CLIENT_ID: CLIENT_ID,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.baseUrl + 'api/saveFilter/get',
      JSON.stringify(data),
      this.options
    );
  }

  getActionLogforcalender(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/technicainDayLog/getDateWiseLogs',
      JSON.stringify(data),
      this.options
    );
  }

  getCalenderData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    MONTH: any,
    YEAR: any,
    TECHNICIAN_ID: number
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      MONTH: MONTH,
      YEAR: YEAR,
      TECHNICIAN_ID: TECHNICIAN_ID,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/technicianActivityCalender/getCalenderData',
      JSON.stringify(data),
      this.options
    );
  }

  createCalenderData(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'technicianActivityCalender/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateCalenderData(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'technicianActivityCalender/update',
      JSON.stringify(user),
      this.options
    );
  }

  getservicelogs(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    searchValue: any,
    searchFields: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      searchValue: searchValue,
      searchFields: searchFields,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/serviceLogs/getServiceLogs',
      JSON.stringify(data),
      this.options
    );
  }

  getServiceTerritoryDetailsget(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
    //  TERRITORY_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      // TERRITORY_ID: TERRITORY_ID
    };
    return this.httpClient.post<any>(
      this.baseUrl +
        'api/territoryServicenOnAvailabilityMapping/serviceDetails',
      JSON.stringify(data),
      this.options
    );
  }

  getdashboardcount(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    fromDate: any,
    toDate: any,
    territoryId: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      fromDate: fromDate,
      toDate: toDate,
      territoryId: territoryId,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/reports/getCount',
      JSON.stringify(data),
      this.options
    );
  }

  activetechnician(
    TECHNICIAN_ID: any,
    TECHNICIAN_NAME: any,
    STATUS: any
  ): Observable<any> {
    var data = {
      TECHNICIAN_ID: TECHNICIAN_ID,
      TECHNICIAN_NAME: TECHNICIAN_NAME,
      STATUS: STATUS,
      CLIENT_ID: 1,
      IS_UPDATED_ADMIN: Number(1),
    };
    return this.httpClient.post<any>(
      this.url + 'technicainDayLog/addLog',
      JSON.stringify(data),
      this.options
    );
  }

  getVendorTerritoryMappedData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/vendorTerritoryMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  mapVendorTerritoryMapping(
    VENDOR_ID: number,
    USER_ID: any,
    VENDOR_NAME: any,
    CLIENT_ID: number,
    datas: any[]
  ): Observable<any> {
    var data = {
      VENDOR_ID: VENDOR_ID,
      USER_ID: USER_ID,
      VENDOR_NAME: VENDOR_NAME,
      CLIENT_ID: CLIENT_ID,
      data: datas,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/vendorTerritoryMapping/mapTerritorytoVendor',
      data,
      this.options
    );
  }

  // ChangeJobStatusForTech(
  //   TECHNICIAN_ID: number,
  //   STATUS: any,
  //   USER_ID: any,
  //   JOB_CARD_NO: any,
  //   NAME: any,
  //   ORDER_ID: any,
  //   SERVICE_ID: any,
  //   ID: any,
  //   JOB_DATA: any[]
  // ): Observable<any> {
  //   var data = {
  //     TECHNICIAN_ID: TECHNICIAN_ID,
  //     STATUS: STATUS,
  //     USER_ID: USER_ID,
  //     JOB_CARD_NO: JOB_CARD_NO,
  //     NAME: NAME,
  //     ORDER_ID: ORDER_ID,
  //     SERVICE_ID: SERVICE_ID,
  //     ID: ID,
  //     JOB_DATA: JOB_DATA,
  //   };
  //   return this.httpClient.post<any>(
  //     this.baseUrl + 'api/technician/updateJobStatus',
  //     data,
  //     this.options
  //   );
  // }

  getTechnicianAssignedJobs(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    TECHNICIAN_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      TECHNICIAN_ID: TECHNICIAN_ID,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/jobCard/getJobsForTechnician',
      JSON.stringify(data),
      this.options
    );
  }

  TechsendOTPToConfirm(
    MOBILE_NUMBER: any,
    COUNTRY_CODE: any,
    TECHNICIAN_ID: any,
    TECHNICIAN_NAME: any,
    CUSTOMER_ID: any,
    ORDER_ID: any,
    ORDER_NO: any,
    JOB_CARD_NO: any,
    SERVICE_ID: any
  ): Observable<any> {
    var data = {
      MOBILE_NUMBER: MOBILE_NUMBER,
      COUNTRY_CODE: COUNTRY_CODE,
      TECHNICIAN_ID: TECHNICIAN_ID,
      TECHNICIAN_NAME: TECHNICIAN_NAME,
      CUSTOMER_ID: CUSTOMER_ID,
      ORDER_ID: ORDER_ID,
      ORDER_NO: ORDER_NO,
      JOB_CARD_NO: JOB_CARD_NO,
      SERVICE_ID: SERVICE_ID,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'app/technician/sendOTPToConfirm',
      data,
      this.options
    );
  }

  TechverifyOTPToConfirm(
    MOBILE_NUMBER: any,
    TECHNICIAN_ID: any,
    JOB_CARD_NO: any,
    OTP: any,
    REMARK: any
  ): Observable<any> {
    var data = {
      MOBILE_NUMBER: MOBILE_NUMBER,
      TECHNICIAN_ID: TECHNICIAN_ID,
      JOB_CARD_NO: JOB_CARD_NO,
      OTP: OTP,
      REMARK: REMARK,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'app/technician/verifyOTPToConfirm',
      data,
      this.options
    );
  }

  updateFilterData(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'saveFilter/update',
      JSON.stringify(data),
      this.options
    );
  }

  getjobphotos(
    pageIndex: any,
    pageSize: any,
    sortKey: any,
    sortValue: any,
    filter: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/jobPhotosDetails/get',
      data,
      this.options
    );
  }

  getCancelOrderReasonData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/cancleOrderReason/get',
      JSON.stringify(data),
      this.options
    );
  }

  createCancelOrderReason(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/cancleOrderReason/create',
      JSON.stringify(form),
      this.options
    );
  }

  updateCancelOrderReason(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.baseUrl + 'api/cancleOrderReason/update',
      JSON.stringify(user),
      this.options
    );
  }

  getTechnicianData11(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    TERRITORY_IDS: any,
    IS_T_MANAGER: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      IS_T_MANAGER: IS_T_MANAGER,
      TERRITORY_IDS: TERRITORY_IDS,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/technician/getData',
      JSON.stringify(data),
      this.options
    );
  }

  getBackOfficeData11(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    TERRITORY_IDS: any,
    IS_T_MANAGER: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      IS_T_MANAGER: IS_T_MANAGER,
      TERRITORY_IDS: TERRITORY_IDS,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/backofficeTeam/get',
      JSON.stringify(data),
      this.options
    );
  }

  gettechhavingbelow4starrating(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    fromDate: any,
    toDate: any,
    territoryId: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      fromDate: fromDate,
      toDate: toDate,
      territoryId: territoryId,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/reports/technicianBelow4Ratings',
      JSON.stringify(data),
      this.options
    );
  }

  getcusthavingbelow4starrating(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    fromDate: any,
    toDate: any,
    territoryId: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      fromDate: fromDate,
      toDate: toDate,
      territoryId: territoryId,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/reports/customerBelow4Ratings',
      JSON.stringify(data),
      this.options
    );
  }

  getcusthaving5star(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    fromDate: any,
    toDate: any,
    territoryId: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      fromDate: fromDate,
      toDate: toDate,
      territoryId: territoryId,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/reports/customerHighRatings',
      JSON.stringify(data),
      this.options
    );
  }
  gettechhaving5star(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    fromDate: any,
    toDate: any,
    territoryId: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      fromDate: fromDate,
      toDate: toDate,
      territoryId: territoryId,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/reports/technicianHighRatings',
      JSON.stringify(data),
      this.options
    );
  }

  gettotalorderpiechardata(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    fromDate: any,
    toDate: any,
    territoryId: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      fromDate: fromDate,
      toDate: toDate,
      territoryId: territoryId,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/reports/orderPieChart',
      JSON.stringify(data),
      this.options
    );
  }

  getDistinctData1(
    TAB_ID: any,
    keywords: string,
    isMongo: boolean,
    filter: any

    // filter: string
  ): Observable<any> {
    var data = {
      TAB_ID: TAB_ID,
      keywords: keywords,
      isMongo: isMongo,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/searchData/getDistinctData',
      JSON.stringify(data),
      this.options
    );
  }

  // HSN Master
  getAllHSNSAC(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/hsn/get',
      JSON.stringify(data),
      this.options
    );
  }

  CreateHSNSAC(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/hsn/create',
      JSON.stringify(user),
      this.options
    );
  }

  updateHSNSAC(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.baseUrl + 'api/hsn/update',
      JSON.stringify(user),
      this.options
    );
  }

  createBannerMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    // this.getHeader();

    return this.httpClient.post<any>(
      this.url + 'banner/create',
      JSON.stringify(role),
      this.options
    );
  }

  updateBannerMaster(role: any): Observable<any> {
    // this.getHeader();
    role.STATUS = role.STATUS == true ? 1 : 0;

    return this.httpClient.put<any>(
      this.url + 'banner/update',
      JSON.stringify(role),
      this.options
    );
  }

  getAllBannerMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    // this.getHeader();
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'banner/get',
      JSON.stringify(data),
      this.options
    );
  }

  updateOrdersDetails(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/order/updateDetails',
      JSON.stringify(user),
      this.options
    );
  }

  getchat(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/jobchat/get',
      JSON.stringify(data),
      this.options
    );
  }

  createchat(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    // this.getHeader();

    return this.httpClient.post<any>(
      this.url + 'jobchat/create',
      JSON.stringify(role),
      this.options
    );
  }

  updateskillstatus(user: any): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + 'api/technicianSkillRequest/updateSkillStatus',
      JSON.stringify(user),
      this.options
    );
  }

  getcategoryhierarchyInventory(): Observable<any> {
    var data = {};
    return this.httpClient.post<any>(
      this.baseUrl + 'api/inventoryCategory/getcatogoryHirechy',
      JSON.stringify(data),
      this.options
    );
  }
  getwarehouseTerritoryMappedData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/warehouseTerritoryMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  mapwarehouseTerritoryMapping(
    WAREHOUSE_ID: number,
    WAREHOUSE_MANAGER_ID: any,
    WAREHOUSE_MANAGER_NAME: any,
    CLIENT_ID: number,
    datas: any[]
  ): Observable<any> {
    var data = {
      WAREHOUSE_ID: WAREHOUSE_ID,
      WAREHOUSE_MANAGER_ID: WAREHOUSE_MANAGER_ID,
      WAREHOUSE_MANAGER_NAME: WAREHOUSE_MANAGER_NAME,
      CLIENT_ID: CLIENT_ID,
      data: datas,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/warehouseTerritoryMapping/addBulk',
      data,
      this.options
    );
  }

  getVarientData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.baseUrl + 'api/varient/get',
      JSON.stringify(data),
      this.options
    );
  }

  CreateVarientData(data: any): Observable<any> {
    // data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'varient/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateVarientData(user: any): Observable<any> {
    // user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'varient/update',
      JSON.stringify(user),
      this.options
    );
  }

  onImageUpload(
    userId: any,
    folderName: any,
    selectedFile: any,
    filename: any
  ): Observable<any> {
    this.httpHeaders1 = new HttpHeaders({
      Accept: 'application/json',
      apikey: 'BEZhBltbyzL11SPV9YFdH4YgYUKZ6Fla',
      applicationkey: '26lLNSmaKlcFziHH',
      Token: this.cookie.get('token'),
      supportkey: this.cookie.get('supportKey'),
      WP_CLIENT_ID: userId,
    });
    this.options1 = {
      headers: this.httpHeaders1,
    };

    const fd = new FormData();

    fd.append('Image', selectedFile, filename);
    return this.httpClient.post<any>(
      appkeys.imgUrl + folderName,
      fd,
      this.options1
    );
  }

  onUpload1(userId: any, folderName: any, selectedFile: any, filename: any) {
    this.httpHeaders1 = new HttpHeaders({
      Accept: 'application/json',
      apikey: 'BEZhBltbyzL11SPV9YFdH4YgYUKZ6Fla',
      applicationkey: '26lLNSmaKlcFziHH',
      Token: this.cookie.get('token'),
      supportkey: this.cookie.get('supportKey'),
      WP_CLIENT_ID: userId,
    });

    const queryParams = new HttpParams().set('WP_CLIENT_ID', userId); // Add WP_CLIENT_ID as a query parameter

    this.options1 = {
      headers: this.httpHeaders1,
    };

    const fd = new FormData();
    fd.append('Image', selectedFile, filename);

    return this.httpClient.post<any>(
      appkeys.imgUrl + folderName,
      fd,
      this.options1
    );
  }

  onUploadFiles(userId, file): Observable<any> {
    this.httpHeaders1 = new HttpHeaders({
      Accept: 'application/json',
      apikey: 'BEZhBltbyzL11SPV9YFdH4YgYUKZ6Fla',
      applicationkey: '26lLNSmaKlcFziHH',
      Token: this.cookie.get('token'),
      supportkey: this.cookie.get('supportKey'),
      WP_CLIENT_ID: userId,
    });
    this.options1 = {
      headers: this.httpHeaders1,
    };
    const fd = new FormData();

    fd.append('Image', file);
    return this.httpClient.post<any>(
      this.imgUrl + 'WhatsAppTemplateImages',
      fd,
      this.options1
    );
  }

  globalSearch(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    searchKey: string,
    category: string,
    teritoryIds: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      category: category,
      searchKey: searchKey,
      TERRITORY_ID: teritoryIds,
      TYPE: 'W',
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/global/search',
      JSON.stringify(data),
      this.options
    );
  }

  custToServiceRating(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.getheader();
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'customerServiceFeedback/getCustomerServiceFeedback',
      JSON.stringify(data),
      this.options
    );
  }

  getOrderSummaryreport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/reports/orderSummaryReport',
      JSON.stringify(data),
      this.options
    );
  }

  getCustServicefeedbackreport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/reports/customerServiceFeedbackReport',
      JSON.stringify(data),
      this.options
    );
  }

  getCustTechnicianfeedbackreport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/reports/customerTechnicianFeedbackReport',
      JSON.stringify(data),
      this.options
    );
  }
  getrefundRepor(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.getheader();
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'reports/refundReport',
      JSON.stringify(data),
      this.options
    );
  }

  getVendorPerformance(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.getheader();
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'reports/vendorPerformanceReport',
      JSON.stringify(data),
      this.options
    );
  }

  TechnicianwiseRepor(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.getheader();
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'reports/technicianwiseJobCardReport',
      JSON.stringify(data),
      this.options
    );
  }
  getOrderDetailedReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.getheader();
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'reports/orderDetailedReport',
      JSON.stringify(data),
      this.options
    );
  }

  getTechnicianCustomerFeedbackReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.getheader();
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'reports/technicianCustomerFeedbackReport',
      JSON.stringify(data),
      this.options
    );
  }

  getorderCancellationReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.getheader();
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'reports/orderCancellationReport',
      JSON.stringify(data),
      this.options
    );
  }
  getCustomerRegistrationReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/reports/customerRegistrationReport',
      JSON.stringify(data),
      this.options
    );
  }
  getjobAssignmentReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/reports/jobAssignmentReport',
      JSON.stringify(data),
      this.options
    );
  }

  getTechnicianPerformanceReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.getheader();
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'reports/technicianPerformanceReport',
      JSON.stringify(data),
      this.options
    );
  }
  getServiceUtilizationReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.getheader();
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'reports/serviceUtilizationReport',
      JSON.stringify(data),
      this.options
    );
  }

  getWhatsappTransactionHistoryReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.getheader();
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'reports/whatsappTransactionHistory',
      JSON.stringify(data),
      this.options
    );
  }

  getemailTransactionHistoryReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/reports/emailTransactionHistory',
      JSON.stringify(data),
      this.options
    );
  }

  getsmstransactionHistoryReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/reports/smsTransactionHistory',
      JSON.stringify(data),
      this.options
    );
  }

  getInventoryHirarchyInward(): Observable<any> {
    return this.httpClient.get<any>(
      this.baseUrl + 'api/inventory/getInventoryHirarchy',
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getb2bCustomerServceSummaryReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/reports/b2bcustomerServicesSummery',
      JSON.stringify(data),
      this.options
    );
  }

  getOrderwiseJobCardDetailedReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.getheader();
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'reports/orderwiseJobCardDetailedReport',
      JSON.stringify(data),
      this.options
    );
  }
  getTechnicianTimeSheetReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/reports/technicianTimeSheet',
      JSON.stringify(data),
      this.options
    );
  }
  globalTimeSlotsMappingGet(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'globalTimeSlotMapping/get',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getTemplateCategoryData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/tempaltecategory/get',
      JSON.stringify(data),
      this.options
    );
  }
  createTemplateCategory(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/tempaltecategory/create',
      JSON.stringify(form),
      this.options
    );
  }

  updateTemplateCategory(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.baseUrl + 'api/tempaltecategory/update',
      JSON.stringify(user),
      this.options
    );
  }

  /////////////////////////Coupon Api /////////////////
  // getFacilityMapping(couponId: number, filter: any) {
  //   var data = {
  //     COUPON_ID: couponId,
  //     filter: filter
  //   };
  //
  //   return this.httpClient.post<string[]>(this.url + "couponFacilityMapping/getData", JSON.stringify(data), this.options);
  // }

  addFacilityMapping(couponId: number, data1: string[]): Observable<number> {
    var data = {
      COUPON_ID: couponId,
      data: data1,
    };
    return this.httpClient.post<number>(
      this.url + 'couponFacilityMapping/addBulk',
      data,
      this.options
    );
  }

  addLog(type, text, userId): Observable<number> {
    this.httpHeaders1 = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      apikey: 'SLQphsR7FlH8K3jRFnv23Mayp8jlnp9R',
      applicationkey: 'mbyEDKA6P97HwQJJ',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
    });
    this.options1 = {
      headers: this.httpHeaders1,
    };
    var data = {
      LOG_TYPE: type,
      LOG_TEXT: this.dateforlog + ' ' + text,
      USER_ID: userId,
      CLIENT_ID: this.clientId,
    };
    return this.httpClient.post<number>(
      this.gmUrl + 'device/addLog',
      JSON.stringify(data),
      this.options1
    );
  }

  gettickdeskDepartmentAdminMapping(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'tickdeskDepartmentAdminMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  gettickdeskSupportUserMapping(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'tickdeskSupportUserMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  getAllTimeSlot(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'globalTimeSlotConfig/get	',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }
  createTimeSlot(department: any): Observable<any> {
    department.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(
      this.url + 'globalTimeSlotConfig/create',
      JSON.stringify(department),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  updateTimeSlot(department: any): Observable<any> {
    department.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(
      this.url + 'globalTimeSlotConfig/update',
      JSON.stringify(department),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getplaceholder(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'placeholder/get',
      JSON.stringify(data),
      this.options
    );
  }

  createplaceholder(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + 'placeholder/create',
      JSON.stringify(data),
      this.options
    );
  }

  updateplaceholder(data: any): Observable<any> {
    return this.httpClient.put<any>(
      this.url + 'placeholder/update',
      JSON.stringify(data),
      this.options
    );
  }

  getTemplateCategory(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.getheader();
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'tempaltecategory/get',
      JSON.stringify(data),
      this.options
    );
  }

  getallTable(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.getheader();
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'placeholder/getTableData  ',
      JSON.stringify(data),
      this.options
    );
  }
  getTemplateCategorytable(
    TAB_ID: number,
    keywords: string
    // filter: string
  ): Observable<any> {
    var data = {
      TAB_ID: TAB_ID,
      keywords: keywords,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/tempaltecategory/get',
      JSON.stringify(data),
      this.options
    );
  }

  getTicketGroupParent(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any[]>(
      this.url + 'ticketGroup/getParent',
      JSON.stringify(data),
      this.options
    );
  }

  addBulkServicesForCoupon(
    COUPON_ID: number,
    SERVICE_DATA: any[]
  ): Observable<any> {
    var data = {
      COUPON_ID: COUPON_ID,
      SERVICE_DATA: SERVICE_DATA,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/coupon/services/add',
      data,
      this.options
    );
  }

  // getUnmappedcouponservices(
  //   COUPON_ID: number,
  //   CATEGORY_ID: number,
  //   SUB_CATEGORY_ID: number
  // ): Observable<any> {
  //   var data = {
  //     COUPON_ID: COUPON_ID,
  //     CATEGORY_ID: CATEGORY_ID,
  //     SUB_CATEGORY_ID: SUB_CATEGORY_ID,
  //   };
  //   return this.httpClient.post<any>(
  //     this.baseUrl + 'api/coupon/services/get',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  getmappedcouponservice(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/couponCodeServiceMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  UnmappBulkCoupons(COUPON_ID: number, SERVICE_DATA: any[]): Observable<any> {
    var data = {
      COUPON_ID: COUPON_ID,
      SERVICE_DATA: SERVICE_DATA,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/coupon/services/add',
      data,
      this.options
    );
  }

  UnmappSingleCoupons(data: any): Observable<any> {
    return this.httpClient.put<any>(
      this.baseUrl + 'api/couponCodeServiceMapping/update',
      data,
      this.options
    );
  }

  // stock movement request
  stockMovementRequest(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.getheader();
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'inventoryMovement/get',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getAllInnerStockMovementItemDetailsTable(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'stockMovementRequestDetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  addStockMoveDetails(
    ID: number,
    data1: any[],
    Status: any,
    vehicleNo: string,
    itemCount: number,
    CONFIRMED_DATETIME: any,
    AUTHORISED_DATETIME: any,
    REQUESTED_BY: any,
    USER_ID: any
  ): Observable<any> {
    var data = {
      ID: ID,
      STATUS: Status,
      AUTHORISED_BY: this.userId,
      VEHICLE_NO: vehicleNo,
      StockMovementRequestDetails: data1,
      TOTAL_ITEMS: itemCount,
      CONFIRMED_DATETIME: CONFIRMED_DATETIME,
      AUTHORISED_DATETIME: AUTHORISED_DATETIME,
      REQUESTED_BY: REQUESTED_BY,
      USER_ID: USER_ID,
    };

    return this.httpClient.post<any>(
      this.url + 'stockMovementRequest/checkMovementRequest',
      data,
      this.options
    );
  }
  UpdateStockReqest(user: any): Observable<any> {
    return this.httpClient.put<any>(
      this.url + 'stockMovementRequest/update',
      JSON.stringify(user),
      this.options
    );
  }

  UpdateStockReqest11(user: any): Observable<any> {
    return this.httpClient.post<any>(
      this.url + 'stockMovementRequest/rejectRequest',
      JSON.stringify(user),
      this.options
    );
  }

  createDepartment(department: any): Observable<any> {
    department.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + 'department/create/',
      JSON.stringify(department),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  updateDepartment(department: any): Observable<any> {
    department.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'department/update/',
      JSON.stringify(department),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getAllDepartments(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'department/get',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getAllFaqHeads(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();
    return this.httpClient.post<any[]>(
      this.url + 'faqHead/get',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getAllFaqs(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();
    return this.httpClient.post<any[]>(
      this.url + 'faq/get',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getKnowledgeBaseCategoryData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/knowledgeBaseCategory/get ',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }
  createKnowledgeBaseCategoryData(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'knowledgeBaseCategory/create',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  updateKnowledgeBaseCategoryData(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'knowledgeBaseCategory/update',
      JSON.stringify(user),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getKnowledgeBasesubCategoryData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/knowledgebaseSubCategory/get ',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }
  createKnowledgeBasesubCategoryData(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'knowledgebaseSubCategory/create',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  updateKnowledgeBasesubCategoryData(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'knowledgebaseSubCategory/update',
      JSON.stringify(user),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getKnowledgeBaseData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/knowledgeBase/get ',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }
  createKnowledgeBaseData(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'knowledgeBase/create',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  updateKnowledgeBaseData(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'knowledgeBase/update',
      JSON.stringify(user),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  addMappingFaqs(ticketId: number, data1: string[]): Observable<any> {
    var data = {
      TICKET_GROUP_ID: ticketId,
      data: data1,
    };
    this.getheader();

    return this.httpClient.post<number>(
      this.url + 'ticketFaqMapping/addBulk',
      data,
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  MarkAsUnmarkDept(
    BACKOFFICE_ID: number,
    BACKOFFICE_NAME: any,
    USER_ID: any,
    datas: any[]
  ): Observable<any> {
    var data = {
      BACKOFFICE_ID: BACKOFFICE_ID,
      BACKOFFICE_NAME: BACKOFFICE_NAME,
      USER_ID: USER_ID,
      data: datas,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/backofficeTeam/unMapDepartment',
      data,
      this.options
    );
  }

  markunmappedDepartment(
    BACKOFFICE_ID: number,
    BACKOFFICE_NAME: any,
    USER_ID: any,
    datas: any[]
  ): Observable<any> {
    var data = {
      BACKOFFICE_ID: BACKOFFICE_ID,
      BACKOFFICE_NAME: BACKOFFICE_NAME,
      USER_ID: USER_ID,
      data: datas,
    };
    return this.httpClient.post<any>(
      // this.baseUrl + 'api/service/unMapSkills',
      this.baseUrl + 'api/backofficeTeam/unMapDepartment',
      data,
      this.options
    );
  }

  markunmapDepartment(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    BACKOFFICE_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      BACKOFFICE_ID: BACKOFFICE_ID,
    };
    return this.httpClient.post<any>(
      // this.baseUrl + 'api/service/unMappedSkills',
      this.baseUrl + 'api/backofficeTeam/unMappedDepartment',
      JSON.stringify(data),
      this.options
    );
  }

  addMappingDeptservice(
    BACKOFFICE_ID: number,
    BACKOFFICE_NAME: any,
    USER_ID: any,
    datas: any[],
    STATUS: any
  ): Observable<any> {
    var data = {
      BACKOFFICE_ID: BACKOFFICE_ID,
      BACKOFFICE_NAME: BACKOFFICE_NAME,
      USER_ID: USER_ID,
      data: datas,
      STATUS: STATUS,
    };
    return this.httpClient.post<any>(
      // this.baseUrl + 'api/service/mapSkills',
      this.baseUrl + 'api/backofficeTeam/mapDepartment',

      data,
      this.options
    );
  }

  mappedDepartments(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/backofficeDepartmentMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  CreateStockRequpdate(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'inventoryMovement/updateMovement',
      JSON.stringify(user),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  createMovement(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'inventoryMovement/createMovement',
      JSON.stringify(user),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  updatetechniciancertificatestatus(user: any): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + 'api/techniciancertificaterequest/updateCertificateStatus',
      JSON.stringify(user),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getHelpDocumentCategoryData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/helpDocumentCategory/get ',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }
  createHelpDocumentCategoryData(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'helpDocumentCategory/create',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  updateHelpDocumentCategoryData(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'helpDocumentCategory/update',
      JSON.stringify(user),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  // 12-02-25 changes
  getInventoryInward(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    let options = {
      ...this.options,
      observe: 'response' as const,
    };

    return this.httpClient.post<any>(
      this.url + 'inventoryInward/get ',
      JSON.stringify(data),
      options
    );
  }

  createInventoryInward(inwardData: any): Observable<any> {
    inwardData.CLIENT_ID = this.clientId;

    let data = {
      INVENTORY_INWARD_DATA: inwardData,
    };

    let options = {
      ...this.options,
      observe: 'response' as const,
    };

    return this.httpClient.post<any>(
      this.url + 'inventoryInward/inwardInventory',
      JSON.stringify(data),
      options
    );
  }

  updateInventoryInward(inwardData: any): Observable<any> {
    inwardData.forEach((element: any) => {
      element.CLIENT_ID = this.clientId;
    });

    let data = {
      INVENTORY_INWARD_DATA: inwardData,
    };

    let options = {
      ...this.options,
      observe: 'response' as const,
    };

    return this.httpClient.post<any>(
      this.url + 'inventoryInward/inwardInventory',
      JSON.stringify(data),
      options
    );
  }

  // 14-02-25 changes
  getInventoryInwardDetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    let options = {
      ...this.options,
      observe: 'response' as const,
    };

    return this.httpClient.post<any>(
      this.url + 'inventoryInwardDetails/get ',
      JSON.stringify(data),
      options
    );
  }

  onInventorymasterImageUpload(imageData: any, id: any): Observable<any> {
    let data = {
      DATA: imageData,
    };

    let options = {
      ...this.options,
      observe: 'response' as const,
    };

    return this.httpClient.post<any>(
      this.url + 'inventory/' + id + '/mapImagesToInventory',
      JSON.stringify(data),
      options
    );
  }

  getInventoryImageMapping(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    let options = {
      ...this.options,
      observe: 'response' as const,
    };

    return this.httpClient.post<any>(
      this.baseUrl + 'api/inventoryImageMapping/get',
      JSON.stringify(data),
      options
    );
  }

  onInventorymasterImageDelete(
    imageData: any,
    masterID: any,
    id: any
  ): Observable<any> {
    let data = {
      IMAGE_URL: imageData,
    };

    let options = {
      ...this.options,
      observe: 'response' as const,
    };

    return this.httpClient.post<any>(
      this.url + 'inventory/' + masterID + '/' + id + '/deleteInventoryImage',
      JSON.stringify(data),
      options
    );
  }

  getHelpDocumentSubcategoryData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/helpDocumentSubCategory/get ',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }
  createHelpDocumentSubategoryData(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'helpDocumentSubCategory/create',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  updateHelpDocumentSubategoryData(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'helpDocumentSubCategory/update',
      JSON.stringify(user),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getAllTickets(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    const data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'ticket/get',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' } // Correct placement of this.options
    );
  }

  getAllemployeeMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    const data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'user/get',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' } // Correct placement of this.options
    );
  }

  getAllTicketGroups(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'ticketGroup/get',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' } // Correct placement of this.options
    );
  }

  getAllTicketGroupsprevious(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      ID: ID,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'ticketGroup/getTicketGroups',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' } // Correct placement of this.options
    );
  }

  updateTicketGroup(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'ticket/update',
      JSON.stringify(user),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  createTicketDetail(ticket: any): Observable<any> {
    ticket['ORG_ID'] = Number(1);
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'ticketDetails/create/',
      JSON.stringify(ticket),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  createTicket(ticket: any): Observable<any> {
    ticket['ORG_ID'] = Number(1);
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'ticket/create/',
      JSON.stringify(ticket),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  stockMovementRequestnew(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.getheader();
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'inventoryMovement/detailedList',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getAllInnerStockMovementItemDetailsTableeee(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    movementRequestMasterId: number
  ): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      apikey: 'BEZhBltbyzL11SPV9YFdH4YgYUKZ6Fla',
      applicationkey: '26lLNSmaKlcFziHH',
      deviceid: this.cookie.get('deviceId') || '',
      supportkey: this.cookie.get('supportKey') || '',
      Token: this.cookie.get('token') || '',
      skip_zrok_interstitial: 'true',
      'ngrok-skip-browser-warning': 'true',
    });

    const options = { headers: httpHeaders };

    // Constructing HttpParams (If needed, uncomment and use it)
    let params = new HttpParams();

    return this.httpClient.get<any>(
      `${this.url}inventoryMovement/${movementRequestMasterId}/movementDetails`,
      { headers: httpHeaders, params, observe: 'response' } // Ensure headers are passed correctly
    );
  }
  getAllInnerStockMovementItemDetailsTableeee22(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    movementRequestMasterId: number
  ): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      apikey: 'BEZhBltbyzL11SPV9YFdH4YgYUKZ6Fla',
      applicationkey: '26lLNSmaKlcFziHH',
      deviceid: this.cookie.get('deviceId') || '',
      supportkey: this.cookie.get('supportKey') || '',
      Token: this.cookie.get('token') || '',
      skip_zrok_interstitial: 'true',
      'ngrok-skip-browser-warning': 'true',
    });

    const options = { headers: httpHeaders };

    // Constructing HttpParams (If needed, uncomment and use it)
    let params = new HttpParams();

    return this.httpClient.get<any>(
      `${this.url}inventoryMovement/${movementRequestMasterId}/movementList`,
      { headers: httpHeaders, params, observe: 'response' } // Ensure headers are passed correctly
    );
  }

  // 15-02-25 changes
  inventoryAdjestment(adjestmentData: any): Observable<any> {
    adjestmentData.CLIENT_ID = this.clientId;

    let options = {
      ...this.options,
      observe: 'response' as const,
    };

    return this.httpClient.post<any>(
      this.url + 'inventoryAdjustment/adjustmentInventory',
      JSON.stringify(adjestmentData),
      options
    );
  }

  // Coupon Detailed Report Service
  getAllcouponuseddetailedreport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    likestring: string,
    filter: string,
    fromdate: any,
    todate: any,
    couponid: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      LIKE_STRING: likestring,
      FROM_DATE: fromdate,
      TO_DATE: todate,
      COUPON_ID: couponid,
    };
    this.httpHeaders = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      apikey: 'BEZhBltbyzL11SPV9YFdH4YgYUKZ6Fla',
      applicationkey: '26lLNSmaKlcFziHH',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'reports/coupon/detailed/get',
      JSON.stringify(data),
      this.options
    );
  }

  getAllcouponsummaryreport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    likestring: string,
    fromdate: any,
    todate: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      LIKE_STRING: likestring,
      FROM_DATE: fromdate,
      TO_DATE: todate,
    };
    this.httpHeaders = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      apikey: 'BEZhBltbyzL11SPV9YFdH4YgYUKZ6Fla',
      applicationkey: '26lLNSmaKlcFziHH',
      deviceid: this.cookie.get('deviceId'),
      supportkey: this.cookie.get('supportKey'),
      Token: this.cookie.get('token'),
    });
    this.options = {
      headers: this.httpHeaders,
    };
    return this.httpClient.post<any>(
      this.url + 'reports/coupon/summary/get',
      JSON.stringify(data),
      this.options
    );
  }

  getJobTraining(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/jobTraining/get',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  creatJobTraining(organization: any): Observable<any> {
    organization.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(
      this.url + 'jobTraining/create',
      JSON.stringify(organization),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  updateJobTraining(organization: any): Observable<any> {
    organization.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(
      this.url + 'jobTraining/update',
      JSON.stringify(organization),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getAllOrganizations(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'organisation/get',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getCustomerCouponSummaryReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/reports/couponSummaryReport',
      JSON.stringify(data),
      this.options
    );
  }

  getCustomerCouponDetailedReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    STUDENT_ID: string,
    COURSE_ID: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      STUDENT_ID: STUDENT_ID,
      COURSE_ID: COURSE_ID,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/reports/couponDetailedReport',
      JSON.stringify(data),
      this.options
      // { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getAllInventoryBrand(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/brand/get',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getAllBrands(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.url + 'brand/get',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }
  createBrand(department: any): Observable<any> {
    department.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(
      this.url + 'brand/create',
      JSON.stringify(department),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  updateBrand(department: any): Observable<any> {
    department.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(
      this.url + 'brand/update',
      JSON.stringify(department),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getbackOfficeDepartmentMapping(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'backofficeDepartmentMapping/get',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getGroupWiseAutoCloseTicketCount(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    START_DATE: any,
    END_DATE: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
    };
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'ticket/getGroupWiseAutoCloseTicketCount',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getCreatorWiseAutoClose(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'ticket/getCreatorWiseAutoCloseTicketCount',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  // getunmappedInventoryservice(
  //   COUPON_ID: number,
  //   CATEGORY_ID: number,
  //   SUB_CATEGORY_ID: number
  // ): Observable<any> {
  //   var data = {
  //     COUPON_ID: COUPON_ID,
  //     CATEGORY_ID: CATEGORY_ID,
  //     SUB_CATEGORY_ID: SUB_CATEGORY_ID,
  //   };
  //   return this.httpClient.post<any>(
  //     this.baseUrl + 'api/coupon/inventory/get',
  //     JSON.stringify(data),

  //     { headers: this.httpHeaders, observe: 'response' }
  //   );
  // }

  unmapBulkInventory(
    COUPON_ID: number,
    INVENTORY_DATA: any[]
  ): Observable<any> {
    var data = {
      COUPON_ID: COUPON_ID,
      INVENTORY_DATA: INVENTORY_DATA,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/coupon/inventory/add',
      data,
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  unmapSingleInventory(data: any): Observable<any> {
    return this.httpClient.put<any>(
      this.baseUrl + 'api/couponCodeInventoryMapping/update',
      data,
      this.options
    );
  }
  addBulkInventoriesMap(
    COUPON_ID: number,
    INVENTORY_DATA: any[]
  ): Observable<any> {
    var data = {
      COUPON_ID: COUPON_ID,
      INVENTORY_DATA: INVENTORY_DATA,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/coupon/inventory/add',
      data,
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getmappedinventoryservice(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/couponCodeInventoryMapping/get',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }
  getTicketTransfer(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    USER_IDFilter: string,
    TAKEN_BY_USER_IDFilter: string,
    DEPARTMENT_IDFilter: string,
    TRANSFER_USER_IDFilter: string
  ): Observable<any> {
    const data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      USER_IDFilter: USER_IDFilter,
      TAKEN_BY_USER_IDFilter,
      DEPARTMENT_IDFilter: DEPARTMENT_IDFilter,
      TRANSFER_USER_IDFilter: TRANSFER_USER_IDFilter,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'ticketTransferReport/get',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }
  getDashboard(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/dashboard/get',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }
  createDashboard(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/dashboard/create',
      JSON.stringify(form),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  updateDashboard(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.baseUrl + 'api/dashboard/update',
      JSON.stringify(user),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }
  getTicketGroupWiseTicketDetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      ID: ID,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url +
        'ticketGroupwiseDetailedReport/getTicketGroupwiseDetailedReport',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' } // Correct placement of this.options
    );
  }

  getTicketGroupWiseTimeTakenToCloseReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      ID: ID,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url +
        'ticketResolutionTimeGroupwise/getTicketResolutionTimeGroupwise',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' } // Correct placement of this.options
    );
  }

  getGroupWiseAutoClose(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    START_DATE: any,
    END_DATE: any,
    USER_ID: any,
    DEPARTMENT_ID: Array<any>,
    TICKET_GENERATOR_BRANCH_ID: Array<any>
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      START_DATE: START_DATE,
      END_DATE: END_DATE,
      USER_ID: USER_ID,
      DEPARTMENT_ID: DEPARTMENT_ID,
      TICKET_GENERATOR_BRANCH_ID: TICKET_GENERATOR_BRANCH_ID,
    };

    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'ticket/getGroupWiseAutoCloseTicketReport',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }
  getTicketGroupWiseSummaryReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    ID: any,
    ORG_ID
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      ID: ID,
      ORG_ID: ORG_ID,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'ticketGroupwiseSummaryReport/getTicketGroupwiseSummaryReport',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' } // Correct placement of this.options
    );
  }

  createInventory(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;

    let options = {
      ...this.options,
      observe: 'response' as const,
    };

    return this.httpClient.post<any>(
      this.url + 'inventory/create',
      JSON.stringify(data),
      options
    );
  }

  updateInventory(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;

    let options = {
      ...this.options,
      observe: 'response' as const,
    };

    return this.httpClient.put<any>(
      this.url + 'inventory/update',
      JSON.stringify(user),
      options
    );
  }

  addupdatebulkdata(data: any): Observable<any> {
    let options = {
      ...this.options,
      observe: 'response' as const,
    };

    return this.httpClient.post<any>(
      this.url + 'inventory/addOrUpdateInventory',
      JSON.stringify(data),
      options
    );
  }

  getTicketAutoClose(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'ticket/getAutoCloseTicketReport',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  // shubham Reschedule job 20-02-2025
  getjobreschedulereq(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'jobRescheduleTransactions/get',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getjobreqcount(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'jobRescheduleTransactions/getCounts',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getjobCardInventories(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/inventoryRequestDetails/get',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  Inventorypurchase(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.getheader();
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'inventoryAccountTransaction/get',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getAppLanguageData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();
    return this.httpClient.post<any>(
      this.baseUrl + 'api/appLanguage/get',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getAppLanguageDataFilterwise(
    movementRequestMasterId: number
  ): Observable<any> {
    this.getheader();

    return this.httpClient.get<any[]>(
      `${this.url}appLanguage/${movementRequestMasterId}/getAppLanguageMaster`,
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  createAppLanguageData(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'appLanguage/addAppLanguage',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  //appLanguage/create

  updateAppLanguageData(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'appLanguage/update',
      JSON.stringify(user),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  SaveTranslationLanguageData(user: any): Observable<any> {
    //user.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'appLanguage/saveAsFinal',
      JSON.stringify(user),
      this.options
    );
  }

  createTranslationLanguageData(data: any): Observable<any> {
    //data.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'appLanguage/saveAsDraft',
      JSON.stringify(data),
      this.options
    );
  }

  acceptorderforshop(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/shopOrder/orderUpdateStatus',
      JSON.stringify(form),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  approverejebtorder(user: any): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + 'api/jobRescheduleTransactions/updateStatus',
      JSON.stringify(user),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getActionLogforshoppp(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/shopOrderActionLog/getDateWiseLogs',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getshoporderrattingdata(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.baseUrl + 'api/customerProductFeedback/getCustomerProductFeedback',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }
  getshoporderalldata(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    orderid: number
  ): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      apikey: 'BEZhBltbyzL11SPV9YFdH4YgYUKZ6Fla',
      applicationkey: '26lLNSmaKlcFziHH',
      deviceid: this.cookie.get('deviceId') || '',
      supportkey: this.cookie.get('supportKey') || '',
      Token: this.cookie.get('token') || '',
      skip_zrok_interstitial: 'true',
      'ngrok-skip-browser-warning': 'true',
    });

    const options = { headers: httpHeaders };

    // Constructing HttpParams (If needed, uncomment and use it)
    let params = new HttpParams();

    return this.httpClient.get<any>(
      `${this.url}shopOrder/${orderid}/orderDetails`,
      { headers: httpHeaders, params, observe: 'response' } // Ensure headers are passed correctly
    );
  }

  getshopOrdersData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/shopOrder/get',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  paymentgatewaytransactionReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      ID: ID,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'paymentGatewayTransactions/get',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' } // Correct placement of this.options
    );
  }

  jobCardChatDetailsnew(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: { JOB_CARD_ID: filter },
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/orderChat/get',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getInventoryAdjestmentHistory(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    let options = {
      ...this.options,
      observe: 'response' as const,
    };

    return this.httpClient.post<any>(
      this.url + 'inventoryAdjustment/get ',
      JSON.stringify(data),
      options
    );
  }

  getInventoryWarehouseStockManagement(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    let options = {
      ...this.options,
      observe: 'response' as const,
    };

    return this.httpClient.post<any>(
      this.url + 'inventory/getDetailedInventoryStock',
      JSON.stringify(data),
      options
    );
  }

  getInventorySerialNoBatch(
    type,
    warehouseid,
    sort,
    filterQuery
  ): Observable<any> {
    var data = {
      INVENTORY_TRACKING_TYPE: type,
      WAREHOUSE_ID: warehouseid,
      sortKey: sort,
      filter: filterQuery,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/inventory/getInventoryUniqueNo',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }
  getInventoryStock(filterQuery): Observable<any> {
    var data = {
      // INVENTORY_TRACKING_TYPE:type,
      // WAREHOUSE_ID:warehouseid,
      // sortKey: sort,
      filter: filterQuery,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/inventory/getInventoryStock',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getChannelData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/channel/get',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  createChannel(organization: any): Observable<any> {
    organization.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(
      this.url + 'channel/create',
      JSON.stringify(organization),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  updateChannel(organization: any): Observable<any> {
    organization.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(
      this.url + 'channel/update',
      JSON.stringify(organization),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  TechnicianStockRequpdate(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'technicianMovement/updateMovement',
      JSON.stringify(user),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  createTechnicianMovement(user: any): Observable<any> {
    user.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.url + 'technicianMovement/createMovement',
      JSON.stringify(user),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }
  TechnicianstockMovementRequest(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.getheader();
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'technicianMovement/get',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  TechnicianstockMovementRequestnew(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    this.getheader();
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + 'technicianMovement/detailedList',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }
  getAllInnerTechnicianStockMovementItemDetailsTableeee(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    movementRequestMasterId: number
  ): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      apikey: 'BEZhBltbyzL11SPV9YFdH4YgYUKZ6Fla',
      applicationkey: '26lLNSmaKlcFziHH',
      deviceid: this.cookie.get('deviceId') || '',
      supportkey: this.cookie.get('supportKey') || '',
      Token: this.cookie.get('token') || '',
      skip_zrok_interstitial: 'true',
      'ngrok-skip-browser-warning': 'true',
    });

    const options = { headers: httpHeaders };

    // Constructing HttpParams (If needed, uncomment and use it)
    let params = new HttpParams();

    return this.httpClient.get<any>(
      `${this.url}technicianMovement/${movementRequestMasterId}/movementDetails`,
      { headers: httpHeaders, params, observe: 'response' } // Ensure headers are passed correctly
    );
  }
  //
  // getTechnicianDataforStockMovement(
  //   pageIndex: number,
  //   pageSize: number,
  //   sortKey: string,
  //   sortValue: string,
  //   filter: string
  // ): Observable<any> {
  //   var data = {
  //     pageIndex: pageIndex,
  //     pageSize: pageSize,
  //     sortKey: sortKey,
  //     sortValue: sortValue,
  //     filter: filter,
  //     IS_W_MANAGER: 1
  //   };
  //   return this.httpClient.post<any>(
  //     this.baseUrl + 'api/Technician/get',
  //     JSON.stringify(data),
  //     this.options
  //   );
  // }

  getTechnicianDataforStockMovement(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    wmanager: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      IS_W_MANAGER: wmanager,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/Technician/get',
      JSON.stringify(data),
      this.options
    );
  }
  resetLogin(userId: number, sessionKey: string): Observable<any> {
    // API endpoint with the userId as a path parameter
    var data = {
      USER_ID: userId,
      SESSION_KEY: sessionKey,
    };

    return this.httpClient.post<any>(
      this.baseUrl + `api/technician/clearId`,
      JSON.stringify(data),
      this.options
    );
  }

  getCouriers(
    PICKUP_PINCODE: any,
    DELIVERY_PINCODE: any,
    WEIGHT: any,
    LENGTH: any,
    BREADTH: any,
    HEIGHT: any
  ): Observable<any> {
    var data = {
      PICKUP_PINCODE: PICKUP_PINCODE,
      DELIVERY_PINCODE: DELIVERY_PINCODE,
      WEIGHT: WEIGHT,
      LENGTH: LENGTH,
      BREADTH: BREADTH,
      HEIGHT: HEIGHT,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/shopOrder/courierServiceability',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getStockMgtReportReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/inventoryReports/getStockMgtReport',
      JSON.stringify(data),
      this.options
    );
  }
  getTechniciansStockMgtReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/inventoryReports/getTechniciansStockMgtReport',
      JSON.stringify(data),
      this.options
    );
  }

  getTechniciansPartRequestReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/inventoryReports/getTechniciansPartRequest',
      JSON.stringify(data),
      this.options
    );
  }
  getTechniciansPartRequestDetailsReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    JOB_CARD_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      JOB_CARD_ID: JOB_CARD_ID,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/inventoryReports/getTechniciansPartRequestDetails',
      JSON.stringify(data),
      this.options
    );
  }
  getinventoryAdjustmentReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/inventoryAdjustment/get',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getItemlogs(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    searchValue: any,
    searchFields: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      searchValue: searchValue,
      searchFields: searchFields,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/InventoryTrack/get',
      JSON.stringify(data),
      this.options
    );
  }
  getStockMgtReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    let options = {
      ...this.options,
      observe: 'response' as const,
    };

    return this.httpClient.post<any>(
      this.url + 'inventoryReports/getStockMgtReport',
      JSON.stringify(data),
      options
    );
  }

  getInventoryLog(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/inventoryActivityLogs/get',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }
  getAllInnerTechnicianStockMovementItemDetailsTableeee2(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    movementRequestMasterId: number
  ): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      apikey: 'BEZhBltbyzL11SPV9YFdH4YgYUKZ6Fla',
      applicationkey: '26lLNSmaKlcFziHH',
      deviceid: this.cookie.get('deviceId') || '',
      supportkey: this.cookie.get('supportKey') || '',
      Token: this.cookie.get('token') || '',
      skip_zrok_interstitial: 'true',
      'ngrok-skip-browser-warning': 'true',
    });

    const options = { headers: httpHeaders };

    let params = new HttpParams();
    if (filter) {
      params = params.set('filter', filter);
    }
    if (sortValue) {
      params = params.set('sortKey', sortKey).set('sortValue', sortValue);
    }
    if (pageIndex && pageSize) {
      params = params.set('pageIndex', pageIndex).set('pageSize', pageSize);
    }
    return this.httpClient.get<any>(
      `${this.url}technicianMovement/${movementRequestMasterId}/movementDetails`,
      { headers: httpHeaders, params, observe: 'response' } // Ensure headers are passed correctly
    );
  }
  getAllInnerStockMovementItemDetailsTableeee2(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    movementRequestMasterId: number
  ): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      apikey: 'BEZhBltbyzL11SPV9YFdH4YgYUKZ6Fla',
      applicationkey: '26lLNSmaKlcFziHH',
      deviceid: this.cookie.get('deviceId') || '',
      supportkey: this.cookie.get('supportKey') || '',
      Token: this.cookie.get('token') || '',
      skip_zrok_interstitial: 'true',
      'ngrok-skip-browser-warning': 'true',
    });

    const options = { headers: httpHeaders };

    let params = new HttpParams();
    if (filter) {
      params = params.set('filter', filter);
    }
    if (sortValue) {
      params = params.set('sortKey', sortKey).set('sortValue', sortValue);
    }
    if (pageIndex && pageSize) {
      params = params.set('pageIndex', pageIndex).set('pageSize', pageSize);
    }
    return this.httpClient.get<any>(
      `${this.url}inventoryMovement/${movementRequestMasterId}/movementDetails`,
      { headers: httpHeaders, params, observe: 'response' } // Ensure headers are passed correctly
    );
  }

  updateStockforOrder(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + 'api/inventory/updateStockforOrder',
      JSON.stringify(data),
      this.options
    );
  }

  getInventoryHirarchyInwardFilterWise2(
    type,
    warehouseid,
    iswmanager,
    technicianid,
    isFirst,
    MOVMENT_TYPE: any
  ): Observable<any> {
    var data = {
      INVENTORY_TRACKING_TYPE: type,
      WAREHOUSE_ID: warehouseid,
      IS_W_MANAGER: iswmanager,
      TECHNICIAN_ID: technicianid,
      // filter: `AND WAREHOUSE_ID=${warehouseid} AND TECHNICIAN_ID=${technicianid}`
      IS_FIRST: isFirst,
      MOVMENT_TYPE: MOVMENT_TYPE,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/inventory/getCustomItemHirarchy',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getInventoryHirarchyInwardFilterWise(
    type,
    warehouseid,
    isFirst
  ): Observable<any> {
    var data = {
      INVENTORY_TRACKING_TYPE: type,
      WAREHOUSE_ID: warehouseid,
      IS_FIRST: isFirst,
      MOVMENT_TYPE: 'A',
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/inventory/getCustomItemHirarchy',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getStocksbyCategory(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    let options = {
      ...this.options,
      observe: 'response' as const,
    };

    return this.httpClient.post<any>(
      this.url + 'inventoryReports/getStocksbyCategory',
      JSON.stringify(data),
      options
    );
  }

  getStocksbyUnitReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/inventoryReports/getStocksbyUnit',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getEmailBodyValues(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
    // TERRITORY_ID: number
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      // TERRITORY_ID: TERRITORY_ID,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/placeholder/get',
      JSON.stringify(data),
      this.options
    );
  }

  notiDetailsAddBulk(
    // empID: number,

    title: string,

    desc: string,

    sharingType: number,

    nData: any,

    orgId: number,

    TYPE: any,

    ATTACHMENT: string,

    MEDIA_TYPE: string,

    SENDER_ID: any,

    NOTIFICATION_TYPE: string,

    TOPIC_NAME: string
  ): Observable<any> {
    var data = {
      TITLE: title,

      DESCRIPTION: desc,

      data: nData,

      SHARING_TYPE: sharingType,

      // CUSTOMER_ID: empID,

      ATTACHMENT: ATTACHMENT,

      CLIENT_ID: this.clientId,

      ORG_ID: 1,

      IS_PANEL: 1,

      TYPE: TYPE,

      MEDIA_TYPE: MEDIA_TYPE,

      SENDER_ID: SENDER_ID,

      NOTIFICATION_TYPE: NOTIFICATION_TYPE,

      TOPIC_NAME: TOPIC_NAME,
    };

    return this.httpClient.post<[]>(
      this.url + 'notification/sendNotification',

      JSON.stringify(data),

      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  createChannels(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/channelSubscribedUsers/subscribeToChanel',
      JSON.stringify(form),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }
  updateChannels(form: any): Observable<any> {
    form.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/channelSubscribedUsers/updateSubscribedChannel',
      JSON.stringify(form),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }
  createterritoryTimeSlot(department: any): Observable<any> {
    return this.httpClient.post<any>(
      this.url + 'globalTimeSlotMapping/create',
      JSON.stringify(department),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  updateterritoryTimeSlot(department: any): Observable<any> {
    department.CLIENT_ID = this.clientId;
    return this.httpClient.put<any>(
      this.url + 'globalTimeSlotMapping/update',
      JSON.stringify(department),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getTechnicianCashCollectionReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/reports/gettechnicianCashCollection',
      JSON.stringify(data),
      this.options
    );
  }

  gettechniciandaylogsreport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    searchValue: any,
    searchFields: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      searchValue: searchValue,
      searchFields: searchFields,
    };
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'technicainDayLog/get',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  gettechnicianactivitycalreport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: any,
    searchValue: any,
    searchFields: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      searchValue: searchValue,
      searchFields: searchFields,
    };
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'technicianActivityCalender/get',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getDistinctOrderNumbers(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/reports/getDistinctOrderNumbers',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  gettechnicianactivitylogsreport(
    TECHNICIAN_ID: any,
    FROM_DATE: any,
    TO_DATE: any,
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    SEARCHVALUE: any,
    ORDER_NO: any,
    JOB_CARD_ID: any,
    SERVICE_ID: any,
    CUSTOMER_ID: any,
    CUSTOMER_TYPE: any,
    TERRITORY_ID: any
  ): Observable<any> {
    var data = {
      TECHNICIAN_ID: TECHNICIAN_ID,
      FROM_DATE: FROM_DATE,
      TO_DATE: TO_DATE,
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      SEARCHVALUE: SEARCHVALUE,
      ORDER_NO: ORDER_NO,
      JOB_CARD_ID: JOB_CARD_ID,
      SERVICE_ID: SERVICE_ID,
      CUSTOMER_ID: CUSTOMER_ID,
      CUSTOMER_TYPE: CUSTOMER_TYPE,
      TERRITORY_ID: TERRITORY_ID,
    };
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'technicainDayLog/getTechnicianTimeSheet',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }
  subscribeToMultipleTopics(topics: string[]): Observable<any> {
    const fcmToken = this.cookie.get('CLOUD_ID');
    if (!fcmToken) {
      console.error('No FCM token available!');
      return of(null);
    }
    this.getheader();
    return this.httpClient.post<any>(
      this.url + 'notification/subscribeMultiple',
      { token: fcmToken, topics },
      this.options
    );
  }

  unsubscribeToMultipleTopics(topics: string[]): Observable<any> {
    const fcmToken = this.cookie.get('CLOUD_ID');
    if (!fcmToken) {
      console.error('No FCM token available!');
      return of(null);
    }

    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'notification/unsubscribeMultiple',
      { token: fcmToken, topics },
      this.options
    );
  }

  //Sanjana
  getMapTechnicianData11(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    CUSTOMER_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      CUSTOMER_ID: CUSTOMER_ID,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/customer/unMappedTechnicians',
      JSON.stringify(data),
      this.options
    );
  }

  getCustomerTechnicianmapdata(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/customerTechnicianMapping/get',
      JSON.stringify(data),
      this.options
    );
  }

  addCustomerTechnicianMapping(
    CUSTOMER_ID: number,
    datas: any[],
    STATUS: any,
    IS_ACTIVE: any
  ): Observable<any> {
    var data = {
      CUSTOMER_ID: CUSTOMER_ID,
      data: datas,
      STATUS: STATUS,
      IS_ACTIVE: IS_ACTIVE,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/customer/mapTechnicians',
      data,
      this.options
    );
  }

  markasinactivedataTechnician(
    CUSTOMER_ID: number,
    datas: any[]
  ): Observable<any> {
    var data = {
      CUSTOMER_ID: CUSTOMER_ID,
      data: datas,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/customer/unMapTechnicians',
      data,
      this.options
    );
  }

  gettechciansheduledata(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    SERVICE_DATA: any,
    SortOrder: any,
    TECHNICIAN_TYPE: any,
    CUSTOMER_ID: any,
    CUSTOMER_TYPE: any,
    VENDOR_ID: any,
    IS_SCHEDULED_BY: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      SERVICE_DATA: SERVICE_DATA,
      SortOrder: SortOrder,
      TECHNICIAN_TYPE: TECHNICIAN_TYPE,
      VENDOR_ID: VENDOR_ID,
      IS_SCHEDULED_BY: IS_SCHEDULED_BY,
    };
    if (CUSTOMER_TYPE == 'B') data['CUSTOMER_ID'] = CUSTOMER_ID;
    return this.httpClient.post<any>(
      this.baseUrl + 'api/technicianJobSchedule/getTechnicians',
      JSON.stringify(data),
      this.options
    );
  }

  getVendorDetailedReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/reports/vendorDetailedPerformanceReport',
      JSON.stringify(data),
      this.options
    );
  }

  generatetInvoice(data: any): Observable<number> {
    data.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(
      this.url + 'technician/getInvoice',
      JSON.stringify(data),
      this.options
    );
  }
  ChangeJobStatusForTech(
    TECHNICIAN_ID: number,
    STATUS: any,
    USER_ID: any,
    JOB_CARD_NO: any,
    NAME: any,
    ORDER_ID: any,
    SERVICE_ID: any,
    ID: any,
    JOB_DATA: any[]
  ): Observable<any> {
    var data = {
      TECHNICIAN_ID: TECHNICIAN_ID,
      STATUS: STATUS,
      USER_ID: USER_ID,
      JOB_CARD_NO: JOB_CARD_NO,
      NAME: NAME,
      ORDER_ID: ORDER_ID,
      SERVICE_ID: SERVICE_ID,
      ID: ID,
      JOB_DATA: JOB_DATA,
      IS_UPDATED_BY_ADMIN: 1,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/technician/updateJobStatus',
      JSON.stringify(data),
      this.options
    );
  }
  ChangeJobPaymentStatusForTech(data): Observable<any> {
    let options = {
      ...this.options,
      observe: 'response' as const,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/jobCard/updatePaymentStatus',
      JSON.stringify(data),
      options
    );
  }
  addPhotos(data): Observable<any> {
    return this.httpClient.post<any>(
      this.baseUrl + 'api/jobPhotosDetails/addPhotos',
      JSON.stringify(data),
      this.options
    );
  }

  checkEmailTech(
    EMAIL_ID: number,
    MOBILE_NUMBER: number,
    TECHNICIAN_ID: any,
    TYPE: any
  ): Observable<any> {
    var data = {
      EMAIL_ID: EMAIL_ID,
      MOBILE_NUMBER: MOBILE_NUMBER,
      TECHNICIAN_ID: TECHNICIAN_ID,
      TYPE: TYPE,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/technician/checkEmail',
      JSON.stringify(data),
      this.options
    );
  }

  sendotpp(EMAIL_ID: string): Observable<any> {
    const data = {
      EMAIL_ID: EMAIL_ID,
    };

    this.getheader();
    return this.httpClient.post<any>(
      this.baseUrl + 'user/forgotPassword',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  verifyotpp(EMAIL_ID: string, OTP: string): Observable<any> {
    const data = {
      EMAIL_ID: EMAIL_ID,
      OTP: OTP,
    };
    this.getheader();
    return this.httpClient.post<any>(
      this.baseUrl + 'user/verifyEmailOtp',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  changepassword(
    NEW_PASSWORD: string,
    USER_ID: number,
    USER_NAME: string
  ): Observable<any> {
    const data = {
      NEW_PASSWORD: NEW_PASSWORD,
      ID: USER_ID,
      EMAIL_ID: USER_NAME,
    };
    this.getheader();
    return this.httpClient.put<any>(
      this.baseUrl + 'user/updatePassword',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getTechnicianunMappedpincodesData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    TECHNICIAN_ID: any,
    TERRITORY_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      TECHNICIAN_ID: TECHNICIAN_ID,
      TERRITORY_ID: TERRITORY_ID,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/technician/unMappedpincodes',
      JSON.stringify(data),
      this.options
    );
  }
  getTechnicianSLAReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/reports/getTechnicianSLAReport',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getunmappedInventoryservice(
    COUPON_ID: number,
    CATEGORY_ID: number,
    SUB_CATEGORY_ID: number,
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      COUPON_ID: COUPON_ID,
      CATEGORY_ID: CATEGORY_ID,
      SUB_CATEGORY_ID: SUB_CATEGORY_ID,
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/coupon/inventory/get',
      JSON.stringify(data),

      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getUnmappedcouponservices(
    COUPON_ID: number,
    CATEGORY_ID: number,
    SUB_CATEGORY_ID: number,
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      COUPON_ID: COUPON_ID,
      CATEGORY_ID: CATEGORY_ID,
      SUB_CATEGORY_ID: SUB_CATEGORY_ID,
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/coupon/services/get',
      JSON.stringify(data),
      this.options
    );
  }
  getCustomerAddressLogs(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/reports/getCustomerAddressLogs',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getuserloginlogsReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/reports/userloginLogs',
      JSON.stringify(data),
      { headers: this.httpHeaders, observe: 'response' }
    );
  }

  getAboutMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    this.getheader();
    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'Aboutus/get/',
      JSON.stringify(data),
      this.options
    );
  }

  createAboutMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'Aboutus/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateAboutMaster(role: any): Observable<any> {
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.put<any>(
      this.url + 'Aboutus/update/',
      JSON.stringify(role),
      this.options
    );
  }

  //Ad Banner Master

  getAllAdBanner(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'adBanner/get',
      JSON.stringify(data),
      this.options
    );
  }

  createAdBanner(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'adBanner/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateAdBanner(role: any): Observable<any> {
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.put<any>(
      this.url + 'adBanner/update/',
      JSON.stringify(role),
      this.options
    );
  }

  //Unit Master

  getAllUnitMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'unit/get',
      JSON.stringify(data),
      this.options
    );
  }

  createUnitMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'unit/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateUnitMaster(role: any): Observable<any> {
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.put<any>(
      this.url + 'unit/update/',
      JSON.stringify(role),
      this.options
    );
  }

  //Pincode Master

  getPincodeMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'pincodeShippingCharges/get/',
      JSON.stringify(data),
      this.options
    );
  }

  //Address Master

  getAddressMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'address/get/',
      JSON.stringify(data),
      this.options
    );
  }

  createAddressMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'address/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateAddressMaster(role: any): Observable<any> {
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.put<any>(
      this.url + 'address/update/',
      JSON.stringify(role),
      this.options
    );
  }

  //customer master

  getCustomerMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'customer/get',
      JSON.stringify(data),
      this.options
    );
  }

  createCustomerMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'customer/create',
      JSON.stringify(role),
      this.options
    );
  }

  updateCustomerMaster(role: any): Observable<any> {
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.put<any>(
      this.url + 'customer/update',
      JSON.stringify(role),
      this.options
    );
  }

  // Product Mapping

  getAllProductMapped(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'products/get/',
      JSON.stringify(data),
      this.options
    );
  }

  createProductMap(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'products/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateProductMap(role: any): Observable<any> {
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'products/updateProductData',
      JSON.stringify(role),
      this.options
    );
  }

  getAllCartaddon(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'cartAddonDetails/get/',
      JSON.stringify(data),
      this.options
    );
  }

  getAlladdress(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'address/get/',
      JSON.stringify(data),
      this.options
    );
  }

  //Get State Master

  getAllStateMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'state/get/',
      JSON.stringify(data),
      this.options
    );
  }

  updateStateMaster(role: any): Observable<any> {
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.put<any>(
      this.url + 'state/update/',
      JSON.stringify(role),
      this.options
    );
  } //cartAddon/master/update

  createStateMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'state/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateFAQ(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'productFaqMapping/update/',
      JSON.stringify(role),
      this.options
    );
  } //cartAddon/master/update

  createFAQ(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'productFaqMapping/create/',
      JSON.stringify(role),
      this.options
    );
  }
  getAllFAQs(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    return this.httpClient.post<any>(
      this.url + 'productFaqMapping/get/',
      JSON.stringify(data),
      this.options
    );
  }

  getstagewisestats(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };/api/country/get
    return this.httpClient.post<any>(
      this.url + 'packagingCharges/get/',
      JSON.stringify(data),
      this.options
    );
  }

  //Packaging Charges

  getAllPackagingMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };/api/country/get
    return this.httpClient.post<any>(
      this.url + 'packagingCharges/get/',
      JSON.stringify(data),
      this.options
    );
  }

  updatePackagingMaster(role: any): Observable<any> {
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.put<any>(
      this.url + 'packagingCharges/update/',
      JSON.stringify(role),
      this.options
    );
  } //cartAddon/master/update

  createPackagingMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'packagingCharges/create/',
      JSON.stringify(role),
      this.options
    );
  }

  // country Master

  getAllCountryMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };/api/country/get
    return this.httpClient.post<any>(
      this.url + 'country/get/',
      JSON.stringify(data),
      this.options
    );
  }

  updateCountryMaster(role: any): Observable<any> {
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.put<any>(
      this.url + 'country/update/',
      JSON.stringify(role),
      this.options
    );
  } //cartAddon/master/update

  createCountryMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'country/create/',
      JSON.stringify(role),
      this.options
    );
  }

  //cartaddon master
  getAllCartAddOnMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'cartAddon/get/',
      JSON.stringify(data),
      this.options
    );
  }

  updateCartAddOnMaster(role: any): Observable<any> {
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.put<any>(
      this.url + 'cartAddon/update/',
      JSON.stringify(role),
      this.options
    );
  } //cartAddon/master/update

  createCartAddOnMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'cartAddon/create/',
      JSON.stringify(role),
      this.options
    );
  }

  //Payment Transaction

  getAllPaymentTransaction(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'paymentTransaction/get/',
      JSON.stringify(data),
      this.options
    );
  }

  //CartItem
  getAllCartItem(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'cartItem/get/',
      JSON.stringify(data),
      this.options
    );
  }

  //CartMaster

  getAllCartMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'cart/get/',
      JSON.stringify(data),
      this.options
    );
  }

  // Product Master

  getAllProductVarient(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'productVarientMapping/get/',
      JSON.stringify(data),
      this.options
    );
  }

  createProductVarient(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'productVarientMapping/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateProductVarient(role: any): Observable<any> {
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.put<any>(
      this.url + 'productVarientMapping/update',
      JSON.stringify(role),
      this.options
    );
  }
  getAllCategoryMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'category/get/',
      JSON.stringify(data),
      this.options
    );
  }

  createCategoryMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'category/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateCategoryMaster(role: any): Observable<any> {
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.put<any>(
      this.url + 'category/update/',
      JSON.stringify(role),
      this.options
    );
  }

  createProductMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'products/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateProductMaster(role: any): Observable<any> {
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'products/updateProductData',
      JSON.stringify(role),
      this.options
    );
  }

  getAllImages(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'productImages/get',
      JSON.stringify(data),
      this.options
    );
  }
  getAllwebsiteBanner(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'websiteBanner/get',
      JSON.stringify(data),
      this.options
    );
  }

  createwebsiteBanner(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'websiteBanner/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updatewebsiteBanner(role: any): Observable<any> {
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.put<any>(
      this.url + 'websiteBanner/update/',
      JSON.stringify(role),
      this.options
    );
  }

  getAllBlogMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'blogs/get/',
      JSON.stringify(data),
      this.options
    );
  }

  createBlogMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'blogs/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updateBlogMaster(role: any): Observable<any> {
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.put<any>(
      this.url + 'blogs/update/',
      JSON.stringify(role),
      this.options
    );
  }

  getAllcontact(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'contactInfo/get',
      JSON.stringify(data),
      this.options
    );
  }

  createcontact(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'contactInfo/create/',
      JSON.stringify(role),
      this.options
    );
  }

  updatecontact(role: any): Observable<any> {
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.put<any>(
      this.url + 'contactInfo/update/',
      JSON.stringify(role),
      this.options
    );
  }

  getAllOrders(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/order/getData',
      JSON.stringify(data),
      this.options
    );
  }

  getAllOrderDetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    return this.httpClient.post<any>(
      this.baseUrl + 'api/order/getDetails',
      JSON.stringify(data),
      this.options
    );
  }

  updateOrderMaster(role: any): Observable<any> {
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.put<any>(
      this.url + 'order/update',
      JSON.stringify(role),
      this.options
    );
  }

  getlog(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'orderLog/get/',
      JSON.stringify(data),
      this.options
    );
  }

  getAllCustomerOrderDetailsReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'report/getCustomerOrderDetails/',
      JSON.stringify(data),
      this.options
    );
  }
  getAllProductMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'products/get/',
      JSON.stringify(data),
      this.options
    );
  }

  getAllProductSalereport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'report/getProductSaleDetails',
      JSON.stringify(data),
      this.options
    );
  }

  getAllpaymentreport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'report/getCustomerPaymentDetails/',
      JSON.stringify(data),
      this.options
    );
    // return this.httpClient.post<any>(
    //   this.url + 'order/get/',
    //   JSON.stringify(data),
    //   this.options
    // );
  }

  getAllproductdetailSummaryreport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'report/getProductOrderSummary/',
      JSON.stringify(data),
      this.options
    );
  }

  getOTPreport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'report/otpReport/',
      JSON.stringify(data),
      this.options
    );
  }

  getAllNewSubscriberReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'newsSubscribers/get/',
      JSON.stringify(data),
      this.options
    );
  }

  // User Contact Report

  getAllUserContactReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();
    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'userContact/get/',
      JSON.stringify(data),
      this.options
    );
  }

  getAllIngredientMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'ingredients/get',
      JSON.stringify(data),
      this.options
    );
  }

  createIngredientMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'ingredients/create',
      JSON.stringify(role),
      this.options
    );
  }

  updateIngredientMaster(role: any): Observable<any> {
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.put<any>(
      this.url + 'ingredients/update',
      JSON.stringify(role),
      this.options
    );
  }
  getProductMappedIngredientsList(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    PRODUCT_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      PRODUCT_ID: PRODUCT_ID,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'productIngredientMapping/getData',
      JSON.stringify(data),
      this.options
    );
  }

  MapProjectIngredients(role: any): Observable<any> {
    // role.CLIENT_ID = this.clientId;
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'productIngredientMapping/addBulk',
      JSON.stringify(role),
      this.options
    );
  }
  getAllOrderMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'order/get/',
      JSON.stringify(data),
      this.options
    );
  }

  deleteBulkRecords(ids: number[]): Observable<any> {
    return this.httpClient.post('/api/products/delete', { ids: ids });
  }
  productBulkUpdate(role: any): Observable<any> {
    // role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'products/updateBooleanValues',
      JSON.stringify(role),
      this.options
    );
  }
  productDelete(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.delete<any>(this.url + 'products/bulkDelete', {
      headers: this.httpHeaders,
      body: role,
    });
  }
  unitBulkUpdate(role: any): Observable<any> {
    // role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'unit/updateBooleanValues',
      JSON.stringify(role),
      this.options
    );
  }

  unitDelete(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.delete<any>(this.url + 'unit/bulkDelete', {
      headers: this.httpHeaders,
      body: role,
    });
  }

  usercontactDelete(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.delete<any>(this.url + 'userContact/bulkDelete', {
      headers: this.httpHeaders,
      body: role,
    });
  }

  newsreportDelete(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.delete<any>(
      this.url + 'newsSubscribers/bulkDelete',
      {
        headers: this.httpHeaders,
        body: role,
      }
    );
  }
  categoryBulkUpdate(role: any): Observable<any> {
    // role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'category/updateBooleanValues',
      JSON.stringify(role),
      this.options
    );
  }
  categoryDelete(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.delete<any>(this.url + 'category/bulkDelete', {
      headers: this.httpHeaders,
      body: role,
    });
  }

  countryBulkUpdate(role: any): Observable<any> {
    // role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'country/updateBooleanValues',
      JSON.stringify(role),
      this.options
    );
  }
  ingredientBulkUpdate(role: any): Observable<any> {
    // role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'ingredients/updateBooleanValues',
      JSON.stringify(role),
      this.options
    );
  }
  ingredientDelete(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.delete<any>(this.url + 'ingredients/bulkDelete', {
      headers: this.httpHeaders,
      body: role,
    });
  }
  stateBulkUpdate(role: any): Observable<any> {
    // role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'state/updateBooleanValues',
      JSON.stringify(role),
      this.options
    );
  }
  pincodeBulkUpdate(role: any): Observable<any> {
    // role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'pincodeShippingCharges/updateBooleanValues',
      JSON.stringify(role),
      this.options
    );
  }
  customerBulkUpdate(role: any): Observable<any> {
    // role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'customer/updateBooleanValues',
      JSON.stringify(role),
      this.options
    );
  }
  packaginBulkUpdate(role: any): Observable<any> {
    // role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'packagingCharges/updateBooleanValues',
      JSON.stringify(role),
      this.options
    );
  }
  websiteBannerBulkUpdate(role: any): Observable<any> {
    // role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'websiteBanner/updateBooleanValues',
      JSON.stringify(role),
      this.options
    );
  }
  aboutBulkUpdate(role: any): Observable<any> {
    // role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'Aboutus/updateBooleanValues',
      JSON.stringify(role),
      this.options
    );
  }
  stateDeleteBulk(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.delete<any>(this.url + 'state/bulkDelete', {
      headers: this.httpHeaders,
      body: role,
    });
  }

  countryDeleteBulk(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.delete<any>(this.url + 'country/bulkDelete', {
      headers: this.httpHeaders,
      body: role,
    });
  }
  websiteDeleteBulk(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.delete<any>(this.url + 'websiteBanner/bulkDelete', {
      headers: this.httpHeaders,
      body: role,
    });
  }
  aboutDeleteBulk(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.delete<any>(this.url + 'Aboutus/bulkDelete', {
      headers: this.httpHeaders,
      body: role,
    });
  }
  zipcodeDeleteBulk(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.delete<any>(
      this.url + 'pincodeShippingCharges/bulkDelete',
      {
        headers: this.httpHeaders,
        body: role,
      }
    );
  }
  chargesDeleteBulk(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.delete<any>(
      this.url + 'packagingCharges/bulkDelete',
      {
        headers: this.httpHeaders,
        body: role,
      }
    );
  }
   productMappingDelete(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.post<any>(this.url + 'productVarientMapping/delete',JSON.stringify(role), {
      headers: this.httpHeaders,
    });
  }
   FaqMappingDelete(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.post<any>(this.url + 'productFaqMapping/delete',JSON.stringify(role), {
      headers: this.httpHeaders,
    });
  }
  getAllCharges(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };/api/country/get
    return this.httpClient.post<any>(
      this.url + 'configurationDetails/get',
      JSON.stringify(data),
      this.options
    );
  }

  updateCharges(role: any): Observable<any> {
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.put<any>(
      this.url + 'configurationDetails/update/',
      JSON.stringify(role),
      this.options
    );
  } //cartAddon/master/update

  createCharges(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'configurationDetails/create/',
      JSON.stringify(role),
      this.options
    );
  }
  getReviews(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };/api/country/get
    return this.httpClient.post<any>(
      this.url + 'customerWebsiteReviews/get',
      JSON.stringify(data),
      this.options
    );
  }

  updateReviewstatus(role: any): Observable<any> {
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.put<any>(
      this.url + 'customerWebsiteReviews/update',
      JSON.stringify(role),
      this.options
    );
  } 
  getAllCityMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'city/get/',
      JSON.stringify(data),
      this.options
    );
  }

  updateCityMaster(role: any): Observable<any> {
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.put<any>(
      this.url + 'city/update/',
      JSON.stringify(role),
      this.options
    );
  } //cartAddon/master/update

  createCityMaster(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'city/create/',
      JSON.stringify(role),
      this.options
    );
  }

   cityDeleteBulk(role: any): Observable<any> {
    this.getheader();

    return this.httpClient.delete<any>(this.url + 'city/bulkDelete', {
      headers: this.httpHeaders,
      body: role,
    });
  }


   cityBulkUpdate(role: any): Observable<any> {
    // role.CLIENT_ID = this.clientId;
    this.getheader();

    return this.httpClient.put<any>(
      this.url + 'city/updateBooleanValues',
      JSON.stringify(role),
      this.options
    );
  }
   getAllpickupLocation(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      CLIENT_ID:this.clientId
    };
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    // data.CLIENT_ID=this.clientId
    return this.httpClient.post<any>(
      this.url + 'pickupLocation/get/',
      JSON.stringify(data),
      this.options
    );
  }

  updatepickupLocation(role: any): Observable<any> {
    role.CLIENT_ID=this.clientId
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.put<any>(
      this.url + 'pickupLocation/update/',
      JSON.stringify(role),
      this.options
    );
  } //cartAddon/master/update

  createpickupLocation(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    this.getheader();

    // this.httpHeaders = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'apikey': 'yxPlx4hTu5xzEXRiqB3dgKbFDDYNDl82',
    //   'applicationkey': 'B71DIrzfXKPF97Ci',
    //   'deviceid':this.cookie.get('deviceId'),
    //   'supportkey':this.cookie.get('supportKey'),
    //   'Token': this.cookie.get('token'),
    //     });
    //     this.options = {
    //   headers: this.httpHeaders
    // };
    return this.httpClient.post<any>(
      this.url + 'pickupLocation/create/',
      JSON.stringify(role),
      this.options
    );
  }
}
