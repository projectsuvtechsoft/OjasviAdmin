import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApexOptions } from 'ng-apexcharts';
import { Subject, timer, of } from 'rxjs';
import { takeUntil, switchMap, catchError, finalize } from 'rxjs/operators';
import { ApiServiceService } from 'src/app/Service/api-service.service';


interface KPICard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  bgColor: string;
  change?: string;
  changeType?: 'increase' | 'decrease';
}

interface DashboardResponse {
  code: number;
  message: string;
  count: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    pendingOrders: number;
    avgAmountPerOrder: number;
    repeatCustomerPercentage: number;
    avgRating: number;
    activeProducts: number;
  };
}

interface DateRangePayload {
  startDate: string;
  endDate: string;
}

interface DashboardTwoResponse {
  code: number;
  message: string;
  count: {
    dailySalesTrend: Array<{
      order_day: string;
      total_sales: number;
    }>;
    orderStatusBreakdown: Array<{
      status: string;
      total_orders: number;
    }>;
    categoryRevenue: Array<{
      category: string;
      total_revenue: number;
    }>;
    topSellingProducts: Array<{
      quantity: number;
      PRODUCT_NAME: string;
    }>;
  };
}

interface Product {
  id?: number;
  image: string;
  name: string;
  category: string;
  unitsSold: number;
  revenue: number;
  size?: string;
}


interface ProductReview {
  productName: string;
  avgRating: number;
  reviewCount: number;
  latestReviewDate: string;
}

interface Customer {
  name: string;
  email: string;
  mobile?: string | null;
  orders: number;
  totalSpent: number;
}

interface CategoryCount {
  category: string;
  productCount: number;
  percentOfTotal: string;
}

interface DashboardThreeResponse {
  code: number;
  message: string;
  data: {
    topSellingProducts: Array<{
      NAME: string;
      PRODUCT_NAME: string;
      PHOTO_URL: string;
      VARIENT_IMAGE_URL: string;
      CATEGORY_NAME: string;
      TOTAL_QUANTITY: number;
      TOTAL_NET_AMOUNT: number;
      SIZE?: string;
    }>;
    productReviewsAndRatings: Array<any>;
    topSpendingCustomers: Array<{
      NAME: string;
      EMAIL_ID: string;
      MOBILE_NO: string | null;
      ORDERS: number;
      TOTAL_SPENT: number;
    }>;
    categoryWiseProductCount: Array<{
      CATEGORY_NAME: string;
      PRODUCT_COUNT: number;
      PERCENT_OF_TOTAL_PRODUCTS: number;
    }>;
  };
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Loading states
  isLoadingKPIs = true;
  isLoadingCharts = true;
  isLoadingTables = true;
  isRefreshing = false;
  
  // Error states
  kpiError = false;
  chartError = false;
  tableError = false;
  
  // Data loaded flags
  kpiDataLoaded = false;
  chartDataLoaded = false;
  tableDataLoaded = false;
  selectedDateRange = '30d';
  dateRanges = [
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 90 Days', value: '90d' }
  ];

  kpiCards: KPICard[] = [];

  salesOverTimeChart: Partial<ApexOptions> = {};
  ordersByStatusChart: Partial<ApexOptions> = {};
  salesByCategoryChart: Partial<ApexOptions> = {};
  topProductsChart: Partial<ApexOptions> = {};

  topSellingProducts: Product[] = [];


  productReviews: ProductReview[] = [];

  topCustomers: Customer[] = [];

  // Store full product names for tooltip access
  private topProductsFullNames: string[] = [];

  categoryCount: CategoryCount[] = [];

  constructor(private apiService: ApiServiceService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData(): void {
    this.resetLoadingStates();
    
    // Simulate API calls with different loading times
    this.loadKPIData();
    this.loadChartData();
    this.loadTableData();
  }

  private resetLoadingStates(): void {
    this.isLoadingKPIs = true;
    this.isLoadingCharts = true;
    this.isLoadingTables = true;
    this.kpiError = false;
    this.chartError = false;
    this.tableError = false;
  }

  private loadKPIData(): void {
    // Get date range payload based on selected filter
    const datePayload :any = this.convertDateRangeToPayload(this.selectedDateRange);
    
    // Clear existing KPI data before loading new data
    this.kpiCards = [];
    
    // Call real API for KPI data with date range
    this.apiService.getCardDashboard(1, 10, '', '', datePayload).pipe(
      switchMap((response: DashboardResponse) => {
        if (response.code === 200) {
          this.updateKPICards(response.count);
          return of(response);
        } else {
          throw new Error('API returned error code: ' + response.code);
        }
      }),
      catchError(error => {
        console.error('Error loading KPI data:', error);
        this.kpiError = true;
        // Ensure KPI data is cleared on error
        this.kpiCards = [];
        return of(null);
      }),
      finalize(() => {
        this.isLoadingKPIs = false;
        this.kpiDataLoaded = true;
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  private updateKPICards(data: any): void {
    // Clear existing KPI cards before updating
    this.kpiCards = [];
    
    // Only update if data is not null or undefined
    if (!data) {
      return;
    }
    
    this.kpiCards = [
      {
        title: 'Total Revenue',
        value: `$ ${data.totalRevenue.toFixed(2)}`,
        icon: 'dollar',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        // change: '+12.5%',
        // changeType: 'increase'
      },
      {
        title: 'Total Orders',
        value: data.totalOrders.toString(),
        icon: 'shopping-cart',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        // change: '+8.3%',
        // changeType: 'increase'
      },
      {
        title: 'Total Customers',
        value: data.totalCustomers.toString(),
        icon: 'user',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        // change: '+15.2%',
        // changeType: 'increase'
      },
      {
        title: 'Pending Orders',
        value: data.pendingOrders.toString(),
        icon: 'clock-circle',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        // change: '-5.1%',
        // changeType: 'decrease'
      },
      {
        title: 'Avg Order Value',
        value: `$ ${data.avgAmountPerOrder.toFixed(2)}`,
        icon: 'calculator',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        // change: '+3.2%',
        // changeType: 'increase'
      },
      {
        title: 'Returning Customers',
        value: `${data.repeatCustomerPercentage}%`,
        icon: 'reload',
        color: 'text-teal-600',
        bgColor: 'bg-teal-50',
        // change: '+2.1%',
        // changeType: 'increase'
      },
      {
        title: 'Avg Rating',
        value: data.avgRating > 0 ? data.avgRating.toFixed(1) : 'N/A',
        icon: 'star',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        // change: data.avgRating > 0 ? '+0.2' : 'N/A',
        // changeType: data.avgRating > 0 ? 'increase' : undefined
      },
      {
        title: 'Active Products',
        value: data.activeProducts.toString(),
        icon: 'appstore',
        color: 'text-pink-600',
        bgColor: 'bg-pink-50',
        // change: '+4',
        // changeType: 'increase'
      }
    ];
  }

  private loadChartData(): void {
    // Get date range payload based on selected filter
    const datePayload: any = this.convertDateRangeToPayload(this.selectedDateRange);
    
    // Clear existing chart data before loading new data
    this.salesOverTimeChart = {};
    this.ordersByStatusChart = {};
    this.salesByCategoryChart = {};
    this.topProductsChart = {};
    
    // Call real API for chart data
    this.apiService.getDashboardTwo(1, 10, '', '', datePayload).pipe(
      switchMap((response: DashboardTwoResponse) => {
        if (response.code === 200) {
          this.initializeChartsWithData(response.count);
          return of(response);
        } else {
          throw new Error('API returned error code: ' + response.code);
        }
      }),
      catchError(error => {
        console.error('Error loading chart data:', error);
        this.chartError = true;
        // Ensure chart data is cleared on error
        this.salesOverTimeChart = {};
        this.ordersByStatusChart = {};
        this.salesByCategoryChart = {};
        this.topProductsChart = {};
        return of(null);
      }),
      finalize(() => {
        this.isLoadingCharts = false;
        this.chartDataLoaded = true;
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  private loadTableData(): void {
    // Get date range payload based on selected filter
    const datePayload: any = this.convertDateRangeToPayload(this.selectedDateRange);
    
    // Clear existing table data before loading new data
    this.topSellingProducts = [];
    this.productReviews = [];
    this.topCustomers = [];
    this.categoryCount = [];
    
    // Call real API for table data
    this.apiService.getDashboardThree(1, 10, '', '', datePayload).pipe(
      switchMap((response: DashboardThreeResponse) => {
        if (response.code === 200) {
          this.updateTableData(response.data);
          return of(response);
        } else {
          throw new Error('API returned error code: ' + response.code);
        }
      }),
      catchError(error => {
        console.error('Error loading table data:', error);
        this.tableError = true;
        // Ensure table data is cleared on error
        this.topSellingProducts = [];
        this.productReviews = [];
        this.topCustomers = [];
        this.categoryCount = [];
        return of(null);
      }),
      finalize(() => {
        this.isLoadingTables = false;
        this.tableDataLoaded = true;
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }
  vareintImageUrl: string = this.apiService.retriveimgUrl + 'VarientImages/';
  private updateTableData(data: any): void {
    // Clear existing table data before updating
    this.topSellingProducts = [];
    this.productReviews = [];
    this.topCustomers = [];
    this.categoryCount = [];
    
    // Only update if data is not null or undefined
    if (!data) {
      return;
    }
    
    // console.log('Raw API Data:', data);
    // console.log('Top Selling Products from API:', data.topSellingProducts);
    
    // Update top selling products
    this.topSellingProducts = data.topSellingProducts.map((product: any) => ({
      image: product.VARIENT_IMAGE_URL ? `${this.vareintImageUrl}${product.VARIENT_IMAGE_URL}` : 'assets/img/default-product.png',
      name: product.PRODUCT_NAME,
      category: product.CATEGORY_NAME,
      unitsSold: product.TOTAL_QUANTITY,
      revenue: product.TOTAL_NET_AMOUNT,
      size: product.SIZE || 'N/A'
    }));
    
    // console.log('Mapped Top Selling Products:', this.topSellingProducts);

    // Update top customers
    this.topCustomers = data.topSpendingCustomers.map((customer: any) => ({
      name: customer.NAME,
      email: customer.EMAIL_ID,
      mobile: customer.MOBILE_NO,
      orders: customer.ORDERS,
      totalSpent: customer.TOTAL_SPENT
    }));

    // Update category count data
    this.categoryCount = data.categoryWiseProductCount.map((category: any) => ({
      category: category.CATEGORY_NAME,
      productCount: category.PRODUCT_COUNT,
      percentOfTotal: `${category.PERCENT_OF_TOTAL_PRODUCTS.toFixed(1)}%`
    }));

    // Update product reviews (if available in future API responses)
    if (data.productReviewsAndRatings && data.productReviewsAndRatings.length > 0) {
      this.productReviews = data.productReviewsAndRatings.map((review: any) => ({
        productName: review.PRODUCT_NAME || review.NAME,
        avgRating: review.AVG_RATING || 0,
        reviewCount: review.REVIEW_COUNT || 0,
        latestReviewDate: review.LATEST_REVIEW_DATE || 'N/A'
      }));
    }
  }

  refreshDashboard(): void {
    this.isRefreshing = true;
    this.loadDashboardData();
    
    // Hide refresh indicator after all data is loaded
    timer(1500).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.isRefreshing = false;
    });
  }

  retryKPILoad(): void {
    this.kpiError = false;
    this.loadKPIData();
  }

  retryChartLoad(): void {
    this.chartError = false;
    this.loadChartData();
  }

  retryTableLoad(): void {
    this.tableError = false;
    this.loadTableData();
  }

  private convertDateRangeToPayload(dateRange: string): DateRangePayload {
    const today = new Date();
    const endDate = new Date(today);
    let startDate = new Date(today);

    switch (dateRange) {
      case '7d':
        startDate.setDate(today.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(today.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(today.getDate() - 90);
        break;
      default:
        startDate.setDate(today.getDate() - 30); // Default to 30 days
        break;
    }

    return {
      startDate: this.formatDateToString(startDate),
      endDate: this.formatDateToString(endDate)
    };
  }

  private formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  initializeChartsWithData(data: any): void {
    // Clear existing chart data before initializing
    this.salesOverTimeChart = {};
    this.ordersByStatusChart = {};
    this.salesByCategoryChart = {};
    this.topProductsChart = {};
    
    // Only initialize if data is not null or undefined
    if (!data) {
      return;
    }
    
    const responsiveOptions = [
      {
        breakpoint: 640,
        options: {
          chart: { height: 200 },
          legend: { fontSize: '9px', position: 'bottom' },
          xaxis: { labels: { style: { fontSize: '9px' } } },
          yaxis: { labels: { style: { fontSize: '9px' } } }
        }
      },
      {
        breakpoint: 1024,
        options: {
          chart: { height: 240 },
          legend: { fontSize: '10px', position: 'bottom' },
          xaxis: { labels: { style: { fontSize: '10px' } } },
          yaxis: { labels: { style: { fontSize: '10px' } } }
        }
      }
    ];

    // Process daily sales trend data - API data is already chronological
    const salesData = data.dailySalesTrend.map((item: any) => item.total_sales);
    const salesCategories = data.dailySalesTrend.map((item: any) => {
      // Manual date formatting to ensure accuracy
      const dateParts = item.order_day.split('-');
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]);
      const day = parseInt(dateParts[2]);
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      const formatted = `${monthNames[month - 1]} ${day}`;
      
      // Debug each date conversion
      // console.log(`Date conversion: ${item.order_day} -> Month:${month}, Day:${day} -> ${formatted}`);
      
      return formatted;
    });
    
    // console.log('Sales Data Debug (No Sorting):');
    // console.log('Original API Data:', data.dailySalesTrend);
    // console.log('Processed Sales Data:', salesData);
    // console.log('Processed Categories:', salesCategories);
    
    // // Manual verification of exact mapping
    // console.log('Manual Mapping Check:');
    // data.dailySalesTrend.forEach((item: any, index: number) => {
    //   console.log(`Position ${index + 1}: ${item.order_day} = ${item.total_sales} -> Chart shows as "${salesCategories[index]}" with value ${salesData[index]}`);
    // });
    
    // Expected vs Actual
    // console.log('EXPECTED: Nov 6(113), Nov 7(788), Nov 8(583.6), Nov 10(1136.4), Nov 11(1145.4)');
    // console.log('ACTUAL ARRAYS:');
    // console.log('Categories:', salesCategories);
    // console.log('Values:', salesData);

    this.salesOverTimeChart = {
      series: [{ name: 'Sales', data: salesData }],
      chart: { 
        height: 260, 
        type: 'area', 
        toolbar: { show: true, tools: { pan: true, zoom: true, reset: true } }, 
        fontFamily: 'inherit',
        zoom: { enabled: true, type: 'x' },
        selection: { enabled: true, type: 'x' }
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      xaxis: { 
        categories: salesCategories,
        labels: { 
          style: { fontSize: '10px' },
          rotate: -45,
          maxHeight: 60
        }
      },
      yaxis: { 
        labels: { 
          formatter: (val) => '$' + val.toFixed(0),
          style: { fontSize: '10px' }
        } 
      },
      colors: ['#10b981'],
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3 } },
      responsive: responsiveOptions
    };

    // Process order status breakdown data
    const orderStatusData = data.orderStatusBreakdown.map((item: any) => item.total_orders);
    const orderStatusLabels = data.orderStatusBreakdown.map((item: any) => item.status);
    const statusColors = ['#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4'];
    
    // console.log('Order Status Debug:', {
    //   originalData: data.orderStatusBreakdown,
    //   statusData: orderStatusData,
    //   statusLabels: orderStatusLabels
    // });

    this.ordersByStatusChart = {
      series: orderStatusData,
      chart: { 
        type: 'donut',
        height: 300,
        fontFamily: 'Inter, sans-serif',
        toolbar: { 
          show: false 
        },
        offsetY: 10
      },
      labels: orderStatusLabels,
      colors: statusColors.slice(0, orderStatusLabels.length),
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '12px',
        fontFamily: 'Inter, sans-serif',
        itemMargin: {
          horizontal: 8,
          vertical: 4
        },
        markers: {
          width: 10,
          height: 10,
          radius: 5,
          offsetX: -4
        },
        offsetY: 5,
        height: 80, // Fixed height that works well for most cases
        formatter: function(legendName: string) {
          return legendName.length > 15 ? legendName.substring(0, 15) + '...' : legendName;
        },
        onItemHover: {
          highlightDataSeries: true
        },
        onItemClick: {
          toggleDataSeries: true
        },
        containerMargin: {
          top: 5
        }
      },
      dataLabels: { 
        enabled: false 
      },
      plotOptions: {
        pie: {
          donut: {
            size: '55%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                offsetY: 0
              },
              value: {
                show: true,
                fontSize: '16px',
                fontFamily: 'Inter, sans-serif',
                offsetY: 5,
                formatter: (val: string) => val
              },
              total: {
                show: true,
                showAlways: true,
                label: 'Total',
                fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                color: '#6B7280'
              }
            }
          }
        }
      },
      responsive: [{
        breakpoint: 768,
        options: {
          chart: {
            height: 300
          },
          legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            height: 100,
            itemMargin: {
              horizontal: 6,
              vertical: 2
            },
            fontSize: '11px',
            containerMargin: {
              top: 5
            }
          }
        }
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 300
          },
          legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            height: 120,
            itemMargin: {
              horizontal: 4,
              vertical: 1
            },
            fontSize: '10px',
            markers: {
              width: 8,
              height: 8,
              radius: 4
            },
            containerMargin: {
              top: 5
            }
          }
        }
      }]
    };

    // Process category revenue data
    const categoryRevenueData = data.categoryRevenue.map((item: any) => item.total_revenue);
    const categoryLabels = data.categoryRevenue.map((item: any) => item.category);
    
    // console.log('Category Revenue Debug:', {
    //   originalData: data.categoryRevenue,
    //   revenueData: categoryRevenueData,
    //   categoryLabels: categoryLabels
    // });

    this.salesByCategoryChart = {
      series: [{ name: 'Revenue', data: categoryRevenueData }],
      chart: { 
        type: 'bar', 
        height: Math.max(260, Math.min(400, categoryLabels.length * 35)), 
        toolbar: { show: true, tools: { pan: true, zoom: true } }, 
        fontFamily: 'inherit',
        zoom: { enabled: true, type: 'y' }
      },
      plotOptions: { 
        bar: { 
          horizontal: true, 
          borderRadius: 4,
          barHeight: '70%'
        } 
      },
      dataLabels: { enabled: true, formatter: (val: number) => '$' + val.toFixed(0) },
      xaxis: { 
        categories: categoryLabels,
        labels: { style: { fontSize: '10px' } }
      },
      yaxis: { 
        labels: { 
          style: { fontSize: '10px' },
          maxWidth: 150
        } 
      },
      colors: ['#6366f1'],
      responsive: responsiveOptions
    };

    // Process top selling products data - sort by quantity descending to ensure proper order
    const sortedProductsData = [...data.topSellingProducts].sort((a, b) => b.quantity - a.quantity);
    
    // Store full product names in component property for tooltip access
    this.topProductsFullNames = sortedProductsData.map((item: any) => item.PRODUCT_NAME);
    
    const topProductsData = sortedProductsData.map((item: any) => item.quantity);
    const topProductsLabels = sortedProductsData.map((item: any) => {
      // Truncate long product names for better display
      return item.PRODUCT_NAME.length > 15 
        ? item.PRODUCT_NAME.substring(0, 15) + '...' 
        : item.PRODUCT_NAME;
    });
    
    // console.log('Top Products Debug:', {
    //   originalData: data.topSellingProducts,
    //   sortedData: sortedProductsData,
    //   productsData: topProductsData,
    //   productLabels: topProductsLabels,
    //   fullNames: this.topProductsFullNames
    // });

    const self = this; // Store reference to component instance

    this.topProductsChart = {
      series: [{ name: 'Quantity', data: topProductsData }],
      chart: { 
        type: 'bar', 
        height: 260, 
        toolbar: { show: true, tools: { pan: true, zoom: true, reset: true } }, 
        fontFamily: 'inherit',
        zoom: { enabled: true, type: 'x' },
        selection: { enabled: true, type: 'x' }
      },
      plotOptions: { 
        bar: { 
          borderRadius: 4, 
          columnWidth: topProductsLabels.length > 10 ? '80%' : '60%'
        } 
      },
      dataLabels: { enabled: false },
      xaxis: { 
        categories: topProductsLabels,
        labels: { 
          rotate: -45, 
          style: { 
            fontSize: '10px',
            fontFamily: 'Inter, sans-serif'
          },
          maxHeight: 80,
          trim: true,
          formatter: function(value: string) {
            // Truncate long labels in the x-axis
            return value.length > 15 ? value.substring(0, 12) + '...' : value;
          }
        }
      },
      yaxis: { 
        labels: { 
          formatter: (val) => val.toString(),
          style: { fontSize: '10px' }
        } 
      },
      tooltip: {
        enabled: true,
        shared: true,
        intersect: false,
        custom: function({ series, seriesIndex, dataPointIndex, w }) {
          const fullName = self.topProductsFullNames[dataPointIndex] || 'Product Name';
          const quantity = series[seriesIndex][dataPointIndex];
          
          // Split the name into parts if it contains '...'
          const nameParts = fullName.split('...').filter(part => part.trim().length > 0);
          const displayName = nameParts.length > 1 ? nameParts[0] + nameParts[1] : fullName;
          
          // Create a more detailed and styled tooltip
          return `
            <div style="
              background: rgba(31, 41, 55, 0.98);
              color: white;
              padding: 12px;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              font-family: 'Inter', sans-serif;
              backdrop-filter: blur(4px);
              border: 1px solid rgba(255, 255, 255, 0.1);
              max-width: 400px;
              z-index: 10000;
              white-space: normal;
              word-break: break-word;
            ">
              <div style="
                font-weight: 600;
                font-size: 14px;
                margin-bottom: 6px;
                color: #f3f4f6;
                white-space: normal;
                word-break: break-word;
                line-height: 1.4;
                max-width: 100%;
                overflow: visible;
              ">
                ${displayName}
              </div>
              <div style="
                display: flex;
                align-items: center;
                font-size: 13px;
                color: #9ca3af;
                margin-top: 4px;
              ">
                <span style="
                  display: inline-block;
                  width: 8px;
                  height: 8px;
                  border-radius: 50%;
                  background-color: #14b8a6;
                  margin-right: 8px;
                  flex-shrink: 0;
                "></span>
                <span>Quantity: <strong style="color: #f9fafb;">${quantity}</strong></span>
              </div>
            </div>`;
        },
        style: {
          fontSize: '14px',
          fontFamily: 'Inter, sans-serif'
        },
        fixed: {
          enabled: true,
          position: 'topRight',
          offsetX: 0,
          offsetY: 0,
        },
        onDatasetHover: {
          highlightDataSeries: true
        },
        x: {
          show: false
        },
        y: {
          formatter: undefined,
          title: {
            formatter: () => ''
          }
        }
      },
      colors: ['#14b8a6'],
      responsive: responsiveOptions
    };
  }

  onDateRangeChange(value: string): void {
    // console.log('Date range changed to:', value);
    
    // Get the date range for the selected filter
    const datePayload = this.convertDateRangeToPayload(value);
    // console.log('Date range payload:', datePayload);
    
    // Update selected date range
    this.selectedDateRange = value;
    
    // Trigger data refresh when date range changes
    this.refreshDashboard();
  }
}
