import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CookieService } from 'ngx-cookie-service';
import { ApiServiceService } from './api-service.service';
import { appkeys } from '../app.constant';

class CookieServiceStub {
  private store: Record<string, string> = {};
  get(key: string) { return this.store[key] || ''; }
  set(name: string, value: string) { this.store[name] = value; }
  delete(name: string, path?: string) { delete this.store[name]; }
}

describe('ApiServiceService', () => {
  let service: ApiServiceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiServiceService,
        { provide: CookieService, useClass: CookieServiceStub },
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ApiServiceService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // 1. Should set deviceId cookie if missing and include it in headers via getheader
  it('should initialize deviceId cookie and set headers on construction', () => {
    // on construction, service.getheader() is called; verify at least one header present
    const anyHeaders: any = (service as any).httpHeaders;
    expect(anyHeaders).toBeTruthy();
  });

  // 2. logoutcall should POST with decrypted IDs and proper URL
  it('should call logout endpoint with decrypted ids', () => {
    spyOn((service as any).commonFunction, 'decryptdata').and.returnValue('1');
    spyOn(sessionStorage, 'getItem').and.callFake((k: string) => (k === 'userId' || k === 'roleId') ? 'enc' : null);

    service.logoutcall().subscribe();

    const req = httpMock.expectOne(appkeys.url + 'user/logout ');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(JSON.stringify({ USER_ID: '1', ROLE_ID: '1' }));
    req.flush({});
  });

  // 3. login should POST to baseUrl with expected payload and headers
  it('should login with provided credentials and device id', () => {
    const cookie = TestBed.inject(CookieService) as any as CookieServiceStub;
    cookie.set('deviceId', 'dev-123');

    service.login('a@b.com', 'pass', 9, 'admin').subscribe();

    const req = httpMock.expectOne(appkeys.baseUrl + 'user/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(JSON.stringify({
      username: 'a@b.com',
      password: 'pass',
      cloudid: 9,
      DEVICE_ID: 'dev-123',
      type: 'admin',
    }));
    req.flush({});
  });

  // 4. getRecords should POST to dynamic endpoint constructed from appkeys.url
  it('should post getRecords to dynamic endpoint', () => {
    service.getRecords(0, 10, 'ID', 'asc', 'abc', 'some/endpoint').subscribe();

    const req = httpMock.expectOne(appkeys.url + 'some/endpoint');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBe(JSON.stringify({
      pageIndex: 0,
      pageSize: 10,
      sortKey: 'ID',
      sortValue: 'asc',
      filter: 'abc',
    }));
    req.flush([]);
  });

  // 5. onUpload should create a HttpRequest with FormData and reportProgress
  it('should upload image with FormData and report progress', () => {
    // ensure upload headers are prepared
    (service as any).onuploadheader();
    const file = new File([new Blob(['x'])], 'x.png', { type: 'image/png' });

    service.onUpload('folder/', file, 'x.png').subscribe();

    const req = httpMock.expectOne(appkeys.imgUrl + 'folder/');
    expect(req.request.method).toBe('POST');
    expect(req.request.reportProgress).toBeTrue();
    // Body is FormData; we can only assert it exists
    expect(req.request.body instanceof FormData).toBeTrue();
    req.flush({});
  });
});
