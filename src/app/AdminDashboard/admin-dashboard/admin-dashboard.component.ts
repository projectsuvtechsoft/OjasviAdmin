import { Component, OnInit } from '@angular/core';
import { ApexOptions } from 'ng-apexcharts';


interface KPICard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  bgColor: string;
  change?: string;
  changeType?: 'increase' | 'decrease';
}

interface Product {
  id: number;
  image: string;
  name: string;
  category: string;
  unitsSold: number;
  revenue: number;
}

interface CategoryData {
  category: string;
  totalProducts: number;
  orders: number;
  revenue: number;
  percentOfTotal: string;
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
  orders: number;
  totalSpent: number;
}

interface CategoryCount {
  category: string;
  productCount: number;
  percentOfTotal: string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  selectedDateRange = '30d';
  dateRanges = [
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 90 Days', value: '90d' }
  ];

  kpiCards: KPICard[] = [
    {
      title: 'Total Sales',
      value: '₹2.45L',
      icon: 'dollar',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+12.5%',
      changeType: 'increase'
    },
    {
      title: 'Total Orders',
      value: '1,243',
      icon: 'shopping-cart',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+8.3%',
      changeType: 'increase'
    },
    {
      title: 'Total Customers',
      value: '875',
      icon: 'user',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+5.2%',
      changeType: 'increase'
    },
    {
      title: 'Pending Orders',
      value: '48',
      icon: 'clock-circle',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: '-3.1%',
      changeType: 'decrease'
    },
    {
      title: 'Avg Order Value',
      value: '₹1,970',
      icon: 'rise',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      change: '+4.8%',
      changeType: 'increase'
    },
    {
      title: 'Returning Customers',
      value: '32%',
      icon: 'reload',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      change: '+2.1%',
      changeType: 'increase'
    },
    {
      title: 'Avg Rating',
      value: '4.5 / 5',
      icon: 'star',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      change: '+0.2',
      changeType: 'increase'
    },
    {
      title: 'Active Products',
      value: '312',
      icon: 'appstore',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      change: '+18',
      changeType: 'increase'
    }
  ];

  salesOverTimeChart: Partial<ApexOptions> = {};
  ordersByStatusChart: Partial<ApexOptions> = {};
  salesByCategoryChart: Partial<ApexOptions> = {};
  topProductsChart: Partial<ApexOptions> = {};

  topSellingProducts: Product[] = [
    {
      id: 1,
      image: 'https://via.placeholder.com/50',
      name: 'Hydrating Face Serum',
      category: 'Face Care',
      unitsSold: 456,
      revenue: 68400
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/50',
      name: 'Anti-Aging Night Cream',
      category: 'Face Care',
      unitsSold: 389,
      revenue: 58350
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/50',
      name: 'Hair Growth Oil',
      category: 'Hair Care',
      unitsSold: 512,
      revenue: 51200
    },
    {
      id: 4,
      image: 'https://via.placeholder.com/50',
      name: 'Vitamin C Moisturizer',
      category: 'Face Care',
      unitsSold: 334,
      revenue: 50100
    },
    {
      id: 5,
      image: 'https://via.placeholder.com/50',
      name: 'Deep Conditioning Mask',
      category: 'Hair Care',
      unitsSold: 287,
      revenue: 43050
    }
  ];

  categoryData: CategoryData[] = [
    { category: 'Face Care', totalProducts: 128, orders: 842, revenue: 176850, percentOfTotal: '42.3%' },
    { category: 'Hair Care', totalProducts: 95, orders: 623, revenue: 124600, percentOfTotal: '29.8%' },
    { category: 'Body Care', totalProducts: 67, orders: 412, revenue: 82400, percentOfTotal: '19.7%' },
    { category: 'Makeup', totalProducts: 22, orders: 156, revenue: 34150, percentOfTotal: '8.2%' }
  ];

  productReviews: ProductReview[] = [
    { productName: 'Hydrating Face Serum', avgRating: 4.8, reviewCount: 234, latestReviewDate: '2024-11-10' },
    { productName: 'Anti-Aging Night Cream', avgRating: 4.6, reviewCount: 189, latestReviewDate: '2024-11-09' },
    { productName: 'Hair Growth Oil', avgRating: 4.7, reviewCount: 267, latestReviewDate: '2024-11-10' },
    { productName: 'Vitamin C Moisturizer', avgRating: 4.5, reviewCount: 156, latestReviewDate: '2024-11-08' },
    { productName: 'Deep Conditioning Mask', avgRating: 4.4, reviewCount: 142, latestReviewDate: '2024-11-07' }
  ];

  topCustomers: Customer[] = [
    { name: 'Priya Sharma', email: 'priya.sharma@email.com', orders: 28, totalSpent: 55160 },
    { name: 'Rahul Verma', email: 'rahul.v@email.com', orders: 24, totalSpent: 47280 },
    { name: 'Anjali Patel', email: 'anjali.patel@email.com', orders: 22, totalSpent: 43340 },
    { name: 'Vikram Singh', email: 'vikram.singh@email.com', orders: 19, totalSpent: 37430 },
    { name: 'Neha Gupta', email: 'neha.g@email.com', orders: 17, totalSpent: 33490 }
  ];

  categoryCount: CategoryCount[] = [
    { category: 'Face Care', productCount: 128, percentOfTotal: '41.0%' },
    { category: 'Hair Care', productCount: 95, percentOfTotal: '30.4%' },
    { category: 'Body Care', productCount: 67, percentOfTotal: '21.5%' },
    { category: 'Makeup', productCount: 22, percentOfTotal: '7.1%' }
  ];

  ngOnInit(): void {
    this.initializeCharts();
  }

  initializeCharts(): void {
    const responsiveOptions = [
      {
        breakpoint: 640,
        options: {
          chart: { height: 250 },
          legend: { fontSize: '10px' }
        }
      }
    ];

    this.salesOverTimeChart = {
      series: [{ name: 'Sales', data: [12, 15, 18, 14, 21, 25, 28, 24, 31, 35, 32, 38] }],
      chart: { height: 300, type: 'area', toolbar: { show: false }, fontFamily: 'inherit' },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
      yaxis: { labels: { formatter: (val) => '₹' + val + 'K' } },
      colors: ['#10b981'],
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3 } },
      responsive: responsiveOptions
    };

    this.ordersByStatusChart = {
      series: [624, 412, 159, 48],
      chart: { type: 'donut', height: 300, fontFamily: 'inherit' },
      labels: ['Delivered', 'Shipped', 'Cancelled', 'Pending'],
      colors: ['#10b981', '#3b82f6', '#ef4444', '#f59e0b'],
      legend: { position: 'bottom', fontSize: '12px' },
      dataLabels: { enabled: true, formatter: (val: number) => val.toFixed(1) + '%' },
      responsive: responsiveOptions
    };

    this.salesByCategoryChart = {
      series: [{ name: 'Revenue', data: [176.85, 124.6, 82.4, 34.15] }],
      chart: { type: 'bar', height: 300, toolbar: { show: false }, fontFamily: 'inherit' },
      plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
      dataLabels: { enabled: true, formatter: (val: number) => '₹' + val + 'K' },
      xaxis: { categories: ['Face Care', 'Hair Care', 'Body Care', 'Makeup'] },
      colors: ['#6366f1'],
      responsive: responsiveOptions
    };

    this.topProductsChart = {
      series: [{ name: 'Revenue', data: [68.4, 58.35, 51.2, 50.1, 43.05] }],
      chart: { type: 'bar', height: 300, toolbar: { show: false }, fontFamily: 'inherit' },
      plotOptions: { bar: { borderRadius: 4, columnWidth: '60%' } },
      dataLabels: { enabled: false },
      xaxis: { 
        categories: ['Serum', 'Cream', 'Oil', 'Moisturizer', 'Mask'],
        labels: { rotate: -45, style: { fontSize: '11px' } }
      },
      yaxis: { labels: { formatter: (val) => '₹' + val + 'K' } },
      colors: ['#14b8a6'],
      responsive: responsiveOptions
    };
  }

  onDateRangeChange(value: string): void {
    console.log('Date range changed to:', value);
  }
}
