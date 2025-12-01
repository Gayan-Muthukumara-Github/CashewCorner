import { Component, HostListener, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent implements OnDestroy {
  isSidebarOpen = true;
  showUserMenu = false;
  adminUser = 'Admin';
  private sessionSub?: Subscription;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    const user = this.authService.getCurrentUser();
    this.adminUser = user?.fullName || user?.username || this.adminUser;

    this.sessionSub = this.authService.sessionExpired$.subscribe(() => {
      this.showUserMenu = false;
    });
  }

  ngOnDestroy(): void {
    this.sessionSub?.unsubscribe();
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  logout(): void {
    this.authService.logoutFromServer().subscribe();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth < 1024 && this.isSidebarOpen) {
      this.isSidebarOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-container')) {
      this.showUserMenu = false;
    }
  }
}
