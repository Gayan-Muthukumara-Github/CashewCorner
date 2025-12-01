import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  stats = [
    { label: 'Total Transactions', value: '12,487', delta: '+4.2%' },
    { label: 'Revenue', value: '$84,230', delta: '+6.3%' },
    { label: 'Refunds', value: '$1,230', delta: '-0.8%' },
    { label: 'Active Customers', value: '3,214', delta: '+2.1%' }
  ];

  activities = [
    { id: 'TX-984201', customer: 'Amal Perera', amount: '$120.00', status: 'Completed', time: '2m ago' },
    { id: 'TX-984199', customer: 'Nadee Silva', amount: '$86.50', status: 'Pending', time: '8m ago' },
    { id: 'TX-984180', customer: 'Iqbal Mohamed', amount: '$34.99', status: 'Failed', time: '14m ago' },
    { id: 'TX-984176', customer: 'Kamal Jay', amount: '$299.00', status: 'Completed', time: '29m ago' }
  ];
}
