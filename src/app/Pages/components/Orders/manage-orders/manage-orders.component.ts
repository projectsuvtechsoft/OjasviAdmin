import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiServiceService } from 'src/app/Service/api-service.service';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css'],
})
export class ManageOrdersComponent implements OnInit {
  statusCategories = [
    'Pending',
    'Preparing',
    // 'Order Prepared',
    'Packaging',
    // 'Packaged',
    'Dispatching',
    // 'Dispatched',
    'Delivered',
    'Canceled',
  ];
  formTitle = ' Manage Orders ';
  constructor(
    private api: ApiServiceService,
    private message: NzNotificationService,
    private router: Router
  ) {}
  back() {
    this.router.navigate(['/masters/menu']);
  }
  orders: { [key: string]: any[] } = {};
  loading = true;

  dropListIds: string[] = [];

  selectedOrder: any = null;
  showModal = false;

  openOrderModal(order: any) {
    this.selectedOrder = order;
    this.showModal = true;
  }

  closeOrderModal() {
    this.selectedOrder = null;
    this.showModal = false;
  }

  // Mock API response
  mockOrders = [
    {
      ID: 1,
      TITLE: 'Order #1001',
      customerName: 'Emily Johnson',
      cartId: 'CART-1001',
      product: {
        name: 'Hydrating Facial Cleanser',
        image:
          'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=80&h=80',
        quantity: 2,
      },
      orderDate: '2024-06-01T10:15:00',
      address: '1234 Maple Ave, Los Angeles, CA 90001, USA',
      totalAmount: 38.0,
      STATUS: 'Pending',
    },
    {
      ID: 2,
      TITLE: 'Order #1002',
      customerName: 'Michael Smith',
      cartId: 'CART-1002',
      product: {
        name: 'Vitamin C Serum',
        image:
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=80&h=80',
        quantity: 1,
      },
      orderDate: '2024-06-01T11:30:00',
      address: '5678 Oak St, New York, NY 10001, USA',
      totalAmount: 25.0,
      STATUS: 'Preparing',
    },
    {
      ID: 3,
      TITLE: 'Order #1003',
      customerName: 'Sophia Lee',
      cartId: 'CART-1003',
      product: {
        name: 'SPF 50 Sunscreen',
        image:
          'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=facearea&w=80&h=80',
        quantity: 3,
      },
      orderDate: '2024-06-01T12:05:00',
      address: '9101 Pine Rd, Miami, FL 33101, USA',
      totalAmount: 45.0,
      STATUS: 'Order Prepared',
    },
    {
      ID: 4,
      TITLE: 'Order #1004',
      customerName: 'James Williams',
      cartId: 'CART-1004',
      product: {
        name: 'Retinol Night Cream',
        image:
          'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=80&h=80',
        quantity: 1,
      },
      orderDate: '2024-06-01T13:20:00',
      address: '2222 Elm St, Dallas, TX 75201, USA',
      totalAmount: 32.0,
      STATUS: 'Packaging',
    },
    {
      ID: 5,
      TITLE: 'Order #1005',
      customerName: 'Olivia Brown',
      cartId: 'CART-1005',
      product: {
        name: 'Aloe Vera Gel',
        image:
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=80&h=80',
        quantity: 2,
      },
      orderDate: '2024-06-01T14:10:00',
      address: '3333 Cedar Ave, Seattle, WA 98101, USA',
      totalAmount: 18.0,
      STATUS: 'Packaged',
    },
    {
      ID: 6,
      TITLE: 'Order #1006',
      customerName: 'William Martinez',
      cartId: 'CART-1006',
      product: {
        name: 'Green Tea Toner',
        image:
          'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=facearea&w=80&h=80',
        quantity: 1,
      },
      orderDate: '2024-06-01T15:00:00',
      address: '4444 Birch Blvd, Chicago, IL 60601, USA',
      totalAmount: 22.0,
      STATUS: 'Dispatching',
    },
    {
      ID: 7,
      TITLE: 'Order #1007',
      customerName: 'Ava Davis',
      cartId: 'CART-1007',
      product: {
        name: 'Charcoal Face Mask',
        image:
          'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=facearea&w=80&h=80',
        quantity: 2,
      },
      orderDate: '2024-06-01T15:45:00',
      address: '5555 Spruce Dr, San Francisco, CA 94101, USA',
      totalAmount: 30.0,
      STATUS: 'Dispatched',
    },
    {
      ID: 8,
      TITLE: 'Order #1008',
      customerName: 'Benjamin Wilson',
      cartId: 'CART-1008',
      product: {
        name: 'Moisturizing Lotion',
        image:
          'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=facearea&w=80&h=80',
        quantity: 1,
      },
      orderDate: '2024-06-01T16:30:00',
      address: '6666 Willow Way, Boston, MA 02101, USA',
      totalAmount: 20.0,
      STATUS: 'Delivered',
    },
    {
      ID: 9,
      TITLE: 'Order #1009',
      customerName: 'Lucas Miller',
      cartId: 'CART-1009',
      product: {
        name: 'Soothing Face Mist',
        image:
          'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=80&h=80',
        quantity: 1,
      },
      orderDate: '2024-06-01T17:00:00',
      address: '7777 Aspen Ct, Denver, CO 80201, USA',
      totalAmount: 15.0,
      STATUS: 'Canceled',
    },
    {
      ID: 5,
      TITLE: 'Order #1005',
      customerName: 'Olivia Brown',
      cartId: 'CART-1005',
      product: {
        name: 'Aloe Vera Gel',
        image:
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=80&h=80',
        quantity: 2,
      },
      orderDate: '2024-06-01T14:10:00',
      address: '3333 Cedar Ave, Seattle, WA 98101, USA',
      totalAmount: 18.0,
      STATUS: 'Packaged',
    },
    {
      ID: 6,
      TITLE: 'Order #1006',
      customerName: 'William Martinez',
      cartId: 'CART-1006',
      product: {
        name: 'Green Tea Toner',
        image:
          'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=facearea&w=80&h=80',
        quantity: 1,
      },
      orderDate: '2024-06-01T15:00:00',
      address: '4444 Birch Blvd, Chicago, IL 60601, USA',
      totalAmount: 22.0,
      STATUS: 'Delivered',
    },
    {
      ID: 5,
      TITLE: 'Order #1005',
      customerName: 'Olivia Brown',
      cartId: 'CART-1005',
      product: {
        name: 'Aloe Vera Gel',
        image:
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=80&h=80',
        quantity: 2,
      },
      orderDate: '2024-06-01T14:10:00',
      address: '3333 Cedar Ave, Seattle, WA 98101, USA',
      totalAmount: 18.0,
      STATUS: 'Packaged',
    },
    {
      ID: 6,
      TITLE: 'Order #1006',
      customerName: 'William Martinez',
      cartId: 'CART-1006',
      product: {
        name: 'Green Tea Toner',
        image:
          'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=facearea&w=80&h=80',
        quantity: 1,
      },
      orderDate: '2024-06-01T15:00:00',
      address: '4444 Birch Blvd, Chicago, IL 60601, USA',
      totalAmount: 22.0,
      STATUS: 'Delivered',
    },
    {
      ID: 5,
      TITLE: 'Order #1005',
      customerName: 'Olivia Brown',
      cartId: 'CART-1005',
      product: {
        name: 'Aloe Vera Gel',
        image:
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=80&h=80',
        quantity: 2,
      },
      orderDate: '2024-06-01T14:10:00',
      address: '3333 Cedar Ave, Seattle, WA 98101, USA',
      totalAmount: 18.0,
      STATUS: 'Preparing',
    },
    {
      ID: 6,
      TITLE: 'Order #1006',
      customerName: 'William Martinez',
      cartId: 'CART-1006',
      product: {
        name: 'Green Tea Toner',
        image:
          'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=facearea&w=80&h=80',
        quantity: 1,
      },
      orderDate: '2024-06-01T15:00:00',
      address: '4444 Birch Blvd, Chicago, IL 60601, USA',
      totalAmount: 22.0,
      STATUS: 'Pending',
    },
    {
      ID: 5,
      TITLE: 'Order #1005',
      customerName: 'Olivia Brown',
      cartId: 'CART-1005',
      product: {
        name: 'Aloe Vera Gel',
        image:
          'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=facearea&w=80&h=80',
        quantity: 2,
      },
      orderDate: '2024-06-01T14:10:00',
      address: '3333 Cedar Ave, Seattle, WA 98101, USA',
      totalAmount: 18.0,
      STATUS: 'Dispatching',
    },
    {
      ID: 6,
      TITLE: 'Order #1006',
      customerName: 'William Martinez',
      cartId: 'CART-1006',
      product: {
        name: 'Green Tea Toner',
        image:
          'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=facearea&w=80&h=80',
        quantity: 1,
      },
      orderDate: '2024-06-01T15:00:00',
      address: '4444 Birch Blvd, Chicago, IL 60601, USA',
      totalAmount: 22.0,
      STATUS: 'Delivered',
    },
  ];

  ngOnInit(): void {
    this.loading = true;
    setTimeout(() => {
      // Simulate API call
      this.orders = {};
      for (const status of this.statusCategories) {
        this.orders[status] = this.mockOrders.filter(
          (order) => order.STATUS === status
        );
      }
      this.dropListIds = this.statusCategories.map((status) =>
        this.getDropListId(status)
      );
      this.loading = false;
    }, 1000);
  }

  getDropListId(status: string): string {
    return 'drop-list-' + status.replace(/\s+/g, '-').toLowerCase();
  }

  drop(event: CdkDragDrop<any[]>, newStatus: string): void {
    if (event.previousContainer === event.container) return;
    const movedOrder = event.previousContainer.data[event.previousIndex];
    movedOrder.STATUS = newStatus;
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }
}
