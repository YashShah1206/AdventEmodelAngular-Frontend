import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.services';
import { AppointmentListComponent } from '../appointment-list/appointment-list.component'; // Import the AppointmentListComponent
import { NavbarComponent } from '../navbar/navbar.component'; // Ensure you import the NavbarComponent

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  standalone: true,
  imports: [CommonModule, AppointmentListComponent, NavbarComponent], // Add NavbarComponent to imports
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent implements OnInit {
  username: string | null = null;
  role: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    if (this.isLoggedIn()) {
      this.username = this.authService.getUsername();
      this.role = this.authService.getRole();
    }
  }

  ngOnInit(): void {
    // Initialization logic if needed
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Navigation methods
  navigateToBooking() {
    this.router.navigate(['/book-appointment']);
  }

  navigateToDrivers() {
    this.router.navigate(['/drivers']);
  }

  navigateToTerminals() {
    this.router.navigate(['/terminals']);
  }

  navigateToContainers() {
    this.router.navigate(['/containers']);
  }

  navigateToTruckingCompanies() {
    this.router.navigate(['/trucking-companies']);
  }

  navigateToAppointments() {
    this.router.navigate(['/appointments']);
  }

  navigateToShip() {
    this.router.navigate(['/ships']);
  }
}
