import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { ApiService } from 'src/app/Service/api.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexYAxis,
} from 'ng-apexcharts';
import { ApiServiceService } from 'src/app/Service/api-service.service';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { DatePipe } from '@angular/common';
import { NzButtonSize } from 'ng-zorro-antd/button';
export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

export type ChartOptions1 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
};
export type ChartOptions2 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
};

type ApexXAxis = {
  type?: 'category' | 'datetime' | 'numeric';
  categories?: any;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
    };
  };
};

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css'],
})
export class AdmindashboardComponent implements OnInit {
  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today

    return differenceInCalendarDays(current, this.today) > 0;
  };
  size: NzButtonSize = 'small';

  today = new Date();
  chartOptions: Partial<ChartOptions> | any;
  chartOptions1: Partial<ChartOptions1> | any;
  chartOptions2: Partial<ChartOptions2> | any;
  Todayorder = [];
  Onlinepayment = [];
  CashOnDelivery = [];
  dashboard = [];
  loadingRecords = false;
  totalRecords: number = 1;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = 'desc';
  sortKey: string = 'id';
  changedate: any;
  daywisecount: any = [];
  daywiseamount: any = [];
  datapush: any = [];
  datapush2: any = [];
  date: any = new Date();
  dataXaxis: any = [];
  dataYaxis: any = [];
  year: any;
  month: any;
  //  date1=new Date();
  day: any;
  isLoading: any;
  isLoading1: any;
  columncount: string[][] = [
    ['PRODUCT_NAME', 'Product Name'],
    ['TOTAL_QUANTITY_SOLD', 'Sold Count'],
  ];
  columns: string[][] = [
    ['CUSTOMER_NAME', 'Customer Name'],
    ['CART_ID', 'Cart ID'],
    ['ORDER_DATETIME', 'Order DateTime'],
    ['EXPECTED_BEING_PREPARE', 'EXPECTED_BEING_PREPARE'],
    ['MOBILE_NO', 'Mobile No.'],
    ['ORDER_TOTAL_QTY', 'ORDER_TOTAL_QTY No.'],
    ['ORDER_NUMBER', 'Order Number'],
    ['TOTAL_AMOUNT', 'Total Amount'],
    ['ADDON_AMOUNT', 'Addon Amount'],
    ['NET_AMOUNT', 'Net Amount'],
    ['ORDER_STATUS', 'Order Status'],
    ['PINCODE', 'PINCODE'],
    ['CITY', 'CITY'],
    ['STATE_NAME', 'STATE_NAME'],
    ['COUNTRY_NAME', 'COUNTRY_NAME'],
  ];
  ngOnInit(): void {
    // this.daywisedashboard();
    // this.daywisedashboard2();
    // this.TodayOrderWithStatus();
    this.OnChange(this.date);
    this.OnChange2(this.date);

    this.TodayOrderWithStatus();
    this.onlinepayment();
    this.Cashondelivery();
    this.Dashboardcount();
    this.stageStats();
    //     this.chartOptions1 = {
    //       series: [
    //         {
    //           name: "distributed",
    //           data: this.datapush2
    //         }
    //       ],
    //       chart: {
    //         height: 350,
    //         type: "bar",
    //         events: {
    //           click: function (chart, w, e) {
    //             // console.log(chart, w, e)
    //           }
    //         }
    //       },
    //       colors: [
    //         "#008FFB",
    //         "#00E396",
    //         "#FEB019",
    //         "#FF4560",
    //         "#775DD0",
    //         "#546E7A",
    //         "#26a69a",
    //         "#D10CE8"
    //       ],
    //       plotOptions: {
    //         bar: {
    //           columnWidth: "45%",
    //           distributed: true
    //         }
    //       },
    //       dataLabels: {
    //         enabled: false
    //       },
    //       legend: {
    //         show: false
    //       },
    //       grid: {
    //         show: false
    //       },
    //       xaxis: {
    //         categories: this.datapush
    //           // ["1"],
    //           // ["2"],
    //           // ["3"],
    //           // ["4"],
    //           // ["5"],
    //           // ["6"],
    //           // ["7"],
    //           // ["8"],

    // ,
    //         labels: {
    //           style: {
    //             colors: [
    //               "#008FFB",
    //               "#00E396",
    //               "#FEB019",
    //               "#FF4560",
    //               "#775DD0",
    //               "#546E7A",
    //               "#26a69a",
    //               "#D10CE8"
    //             ],
    //             fontSize: "12px"
    //           }
    //         }
    //       }
    //     };
  }

  constructor(
    private router: Router,
    private datepipe: DatePipe,
    private api: ApiServiceService,
    private notify: NzNotificationService
  ) {}

  viewOrders(event: any) {
    this.router.navigate(['/orderdetails']);
  }
  OnlinePayment(event: any) {
    this.router.navigate(['/paymentreport']);
  }
  codPayment(event: any) {
    this.router.navigate(['/cashondelivery']);
  }

  pieGraph1Loading:boolean =  false;
  stats: any[] = [];
  statestatus: any = [];
  stageStats() {

    
   
    this.pieGraph1Loading = true
    this.api.stagewisestats(0, 0, '', '', '').subscribe(
      (data) => {
        if (data['code'] == 200) {
          this.pieGraph1Loading = false
          console.log(data);
          this.stats = data['data'];
          console.log('this.stats', this.stats);
          this.chartOptions.series = [
            this.stats[0]['IN_COUNTRY_COUNT'],
            this.stats[1]['OUT_COUNTRY_COUNT'],
           
          ];
          console.log(this.chartOptions);
          // this.chartOptions.chart = {
          //   width: 440,
          //   type: 'pie',
          // };
          
          console.log(this.chartOptions);

          // }
        } else {
          // this..error('Something Went Wrong', '');
          this.pieGraph1Loading = false
        }
      },
      (err) => {
        console.log(err);
      }
    );
      
    this.chartOptions = {
      series: this.stats,
      chart: {
        width: 480,
        type: 'pie',
      },

      labels: [
        'Inside Country',
        'Outside Country',
      ],

      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 400,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };

  }

  OnChange(result: Date): void {
    // this.i+=1
    // this.changedate=result
    console.log('onChange: ', result);
    if (result != null) {
      this.changedate = this.datepipe.transform(result, 'yyyy-MM-dd');
      this.day = new Date(result.getFullYear(), result.getMonth() + 1, 0);
      this.day = this.datepipe.transform(this.day, 'dd');
      // console.log(this.day)
      this.daywisedashboard();
      // console.log("Data Length: ",this.datapush2.length)
    } else {
      this.daywisedashboard();
    }
    // console.log(this.datapush2)
    if (this.datapush2.length <= 0) {
      this.daywisecount = [];
      this.datapush2 = [];
      this.date = null;
      for (let i = 0; i < this.daywisecount.length; i++) {
        this.datapush2.push((this.daywisecount[i]['COUNT'] = 0));
      }
      this.chartOptions1 = {
        series: [
          {
            name: 'distributed',
            data: this.datapush2,
          },
        ],
        chart: {
          height: 350,
          type: 'bar',
          events: {
            click: function (chart: any, w: any, e: any) {
              // console.log(chart, w, e)
            },
          },
        },

        plotOptions: {
          bar: {
            columnWidth: '45%',
            distributed: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        grid: {
          show: false,
        },
        xaxis: {
          categories: this.datapush,

          labels: {
            style: {
              fontSize: '12px',
            },
          },
        },
      };

      console.log(this.datapush2);
    } else {
    }
  }
  barGraph1Loading = false;
  daywisedashboard() {
    this.datapush = [];
    this.datapush2 = [];
    this.barGraph1Loading = true;
    this.year = this.datepipe.transform(this.changedate, 'yyyy');
    this.month = this.datepipe.transform(this.changedate, 'MM');
    // // this.day=new Date(this.year, this.month + 1,0);

    this.api
      .getdaywisecount(0, 0, '', '', '', this.day, this.month, this.year)
      .subscribe(
        (data1) => {
          if (data1['code'] == 200) {
          if (data1['count'] > 0) {
            this.daywisecount = data1['data'];
            console.log(this.daywisecount);
            if (this.daywisecount.length > 0) {
              for (let i = 0; i < this.daywisecount.length; i++) {
                this.datapush.push(data1['data'][i]['ORDER_DATETIME']);
                this.datapush2.push(data1['data'][i]['COUNT']);
                this.barGraph1Loading = false;
                console.log('this.datapush', this.datapush);
              }
              // console.log(this.datapush)
              // console.log(this.datapush2)
            }
          } else if (data1['count'] == 0) {
            console.log(data1['data'].length);
            for (let j = 0; j < data1['data'].length; j++) {
              this.datapush.push(data1['data'][j]['ORDER_DATETIME']);
              this.barGraph1Loading = false;
              // this.datapush2.push(data1['data'][i]['COUNT'])
            }
            // this.datapush=[];
            console.log(this.datapush);
          } else {
            this.datapush2 = [];
            this.barGraph1Loading = false;
          }
          }else {
            this.notify.error('Something Went Wrong', '');
            this.barGraph1Loading = false;
          }

        },
        (err) => {
          console.log(err);
          this.barGraph1Loading = false;
        }
      );
  }

  barGraph2Loading = false;

  OnChange2(result: Date): void {
    // this.i+=1
    // this.changedate=result
    console.log('onChange: ', result);
    if (result != null) {
      this.changedate = this.datepipe.transform(result, 'yyyy-MM-dd');
      this.day = new Date(result.getFullYear(), result.getMonth() + 1, 0);
      this.day = this.datepipe.transform(this.day, 'dd');
      // console.log(this.day)
      this.daywisedashboard2();
      // console.log("Data Length: ",this.datapush2.length)
    } else {
      this.daywisedashboard2();
    }
    // console.log(this.datapush2)
    if (this.dataYaxis.length <= 0) {
      this.daywiseamount = [];
      this.dataYaxis = [];
      this.date = null;
      for (let i = 0; i < this.daywiseamount.length; i++) {
        this.dataYaxis.push((this.daywiseamount[i]['TOTAL_AMOUNT'] = 0));
      }
      this.chartOptions2 = {
        series: [
          {
            name: 'distributed',
            data: this.dataYaxis,
          },
        ],
        chart: {
          height: 350,
          type: 'bar',
          events: {
            click: function (chart: any, w: any, e: any) {
              // console.log(chart, w, e)
            },
          },
        },

        plotOptions: {
          bar: {
            columnWidth: '45%',
            distributed: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        grid: {
          show: false,
        },
        xaxis: {
          categories: this.dataXaxis,

          labels: {
            style: {
              fontSize: '12px',
            },
          },
        },
      };

      console.log(this.dataYaxis);
    } else {
    }
  }
  daywisedashboard2() {
    this.dataXaxis = [];
    this.dataYaxis = [];
    this.barGraph2Loading = true;
    this.year = this.datepipe.transform(this.changedate, 'yyyy');
    this.month = this.datepipe.transform(this.changedate, 'MM');
    // // this.day=new Date(this.year, this.month + 1,0);

    this.api
      .getdaywiseamount(0, 0, '', '', '', this.day, this.month, this.year)
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
          console.log(data);
          if (data['count'] > 0) {
            this.daywiseamount = data['data'];
            console.log(this.daywiseamount);

            if (this.daywiseamount.length > 0) {
              for (let i = 0; i < this.daywiseamount.length; i++) {
                this.dataXaxis.push(data['data'][i]['ORDER_DATETIME']);
                this.dataYaxis.push(data['data'][i]['TOTAL_AMOUNT']);
                this.barGraph2Loading = false;
                console.log('this.dataXaxis', this.dataXaxis);
              }
              // console.log(this.dataXaxis)
              // console.log(this.dataYaxis)
            }
          } else if (data['count'] == 0) {
            console.log(data['data'].length);
            for (let j = 0; j < data['data'].length; j++) {
              this.dataXaxis.push(data['data'][j]['ORDER_DATETIME']);
              this.barGraph2Loading = false;
              // this.dataYaxis.push(data1['data'][i]['COUNT'])
            }
            // this.dataXaxis=[];
            console.log(this.dataXaxis);
          } else {
            this.dataYaxis = [];
            this.barGraph2Loading = false;
          }
        }else {
          this.notify.error('Something Went Wrong', '');
          this.barGraph2Loading = false;
        }
        },
        (err) => {
          console.log(err);
          this.barGraph2Loading = false;
        }
      );
  }

  date1 = this.datepipe.transform(new Date(), 'yyyy-MM-dd');

  TodayOrderWithStatus(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
      this.sortKey = 'id';
      this.sortValue = 'desc';
    }
    this.loadingRecords = true;
    var sort: string;
    try {
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }

    this.api
      .getAllOrderMaster(
        this.pageIndex,
        this.pageSize,
        this.sortKey,
        sort,
        ' AND DATE(ORDER_DATETIME) =  ' + "'" + this.date1 + "' "
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.totalRecords = data['count'];
            this.Todayorder = data['data'];
            this.loadingRecords = false;
          } else {
            this.loadingRecords = false;
            // this.notify.error('Something Went Wrong', '');
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  OnlineLoadingRecords = false;
  OnlinetotalRecords = 1;
  OnlinePageIndex = 1;
  OnlinePageSize = 10;
  OnlinesortValue: string = 'desc';
  OnlinesortKey: string = 'id';
  onlinepayment(reset: boolean = false) {
    if (reset) {
      this.OnlinePageIndex = 1;
      this.OnlinesortKey = 'id';
      this.OnlinesortValue = 'desc';
    }
    this.OnlineLoadingRecords = true;
    var sort: string;
    try {
      sort = this.OnlinesortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    this.api
      .getAllpaymentreport(
        this.OnlinePageIndex,
        this.OnlinePageSize,
        this.OnlinesortKey,
        sort,
        ' AND DATE(PAYMENT_DATETIME) =  ' + "'" + this.date1 + "'"
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.OnlinetotalRecords = data['count'];
            this.Onlinepayment = data['data'];
            this.OnlineLoadingRecords = false;
          } else {
            this.OnlineLoadingRecords = false;
            // this.notify.error('Something Went Wrong', '');
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  codLoadingRecords = false;
  codtotalRecords = 1;
  codPageIndex = 1;
  codPageSize = 10;
  codsortValue: string = 'desc';
  codsortKey: string = 'id';
  Cashondelivery(reset: boolean = false) {
    if (reset) {
      this.codPageIndex = 1;
      this.codsortKey = 'id';
      this.codsortValue = 'desc';
    }
    this.codLoadingRecords = true;
    var sort: string;
    try {
      sort = this.codsortValue.startsWith('a') ? 'asc' : 'desc';
    } catch (error) {
      sort = '';
    }
    this.api
      .getAllCashOnDeliveryreport(
        this.codPageIndex,
        this.codPageSize,
        this.codsortKey,
        sort,
        ' AND DATE(PAYMENT_DATETIME) =  ' + "'" + this.date1 + "'"
      )
      .subscribe(
        (data) => {
          if (data['code'] == 200) {
            this.codLoadingRecords = false;
            this.codtotalRecords = data['count'];
            this.CashOnDelivery = data['data'];
          } else {
            this.codLoadingRecords = false;
            // this.notify.error('Something Went Wrong', '');
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  loadingRecordstop = false;
  totalRecordstop: number = 1;
  Dashboardcount() {
    this.loadingRecordstop = true;
    this.api.Admindashboardcount(0, 0, '', '', ' ').subscribe(
      (data) => {
        if (data['code'] == 200) {
          // this.totalRecordstop = data['count'];
          this.dashboard = data['data'];
          this.loadingRecordstop = false;
        } else {
          this.loadingRecordstop = false;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  sort(params: NzTableQueryParams) {
    this.loadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    console.log(currentSort);

    console.log('sortOrder :' + sortOrder);
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    if (this.pageSize != pageSize) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    if (this.sortKey != sortField) {
      this.pageIndex = 1;
      this.pageSize = pageSize;
    }

    this.sortKey = sortField;
    this.sortValue = sortOrder;
    this.loadingRecords = false;
    this.TodayOrderWithStatus();
  }
  sort1(params: NzTableQueryParams) {
    this.OnlineLoadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    console.log(currentSort);

    console.log('sortOrder :' + sortOrder);
    this.OnlinePageIndex = pageIndex;
    this.OnlinePageSize = pageSize;

    if (this.pageSize != pageSize) {
      this.OnlinePageIndex = 1;
      this.OnlinePageSize = pageSize;
    }

    if (this.sortKey != sortField) {
      this.OnlinePageIndex = 1;
      this.OnlinePageSize = pageSize;
    }

    this.OnlinesortKey = sortField;
    this.OnlinesortValue = sortOrder;
    this.OnlineLoadingRecords = false;
    this.onlinepayment();
  }

  sort2(params: NzTableQueryParams) {
    this.codLoadingRecords = true;
    const { pageSize, pageIndex, sort } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || 'id';
    const sortOrder = (currentSort && currentSort.value) || 'desc';
    console.log(currentSort);

    console.log('sortOrder :' + sortOrder);
    this.codPageIndex = pageIndex;
    this.codPageSize = pageSize;

    if (this.pageSize != pageSize) {
      this.codPageIndex = 1;
      this.codPageSize = pageSize;
    }

    if (this.sortKey != sortField) {
      this.codPageIndex = 1;
      this.codPageSize = pageSize;
    }

    this.codsortKey = sortField;
    this.codsortValue = sortOrder;
    this.codLoadingRecords = false;
    this.Cashondelivery();
  }
}
