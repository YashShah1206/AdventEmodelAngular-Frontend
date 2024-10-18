import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../Services/appointment.service';
import { AuthService } from '../../Services/auth.services';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./appointment-list.component.css'],
})
export class AppointmentListComponent implements OnInit {
  appointments: any[] = [];
  paginatedAppointments: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  selectedAppointment: any = {}; 
  isModalOpen: boolean = false;
  role: string | null = null; // Add role property

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 8;

  constructor(private appointmentService: AppointmentService, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchAppointments();
  }

  private fetchAppointments(): void {
    this.appointmentService.getAllAppointments().subscribe(
      (data) => {
        this.role = this.authService.getRole(); // Store the role of the logged-in user
        const token = this.authService.getToken(); // Get the JWT token from local storage
        const userId = token ? this.authService.getUserIdFromToken(token) : null; // Handle null token

        if (this.role === 'Admin') {
          // If admin, show all appointments
          this.appointments = data.map((appointment: any) => ({
            ...appointment,
            terminalName: appointment.terminal ? appointment.terminal.terminalName : 'N/A',
          }));
        } else {
          // If user, filter appointments by userId
          if (userId) {
            this.appointments = data
              .filter((appointment: any) => appointment.userId == userId)
              .map((appointment: any) => ({
                ...appointment,
                terminalName: appointment.terminal ? appointment.terminal.terminalName : 'N/A',
              }));

            if (this.appointments.length === 0) {
              this.errorMessage = 'No appointments found for this user.';
            }
          } else {
            this.errorMessage = 'User ID could not be retrieved. Please log in again.';
          }
        }

        this.paginateAppointments();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching appointments:', error);
        this.errorMessage = 'Failed to load appointments. Please try again later.';
        this.isLoading = false;
      }
    );
  }

  // Approve appointment
  approveAppointment(appointment: any): void {
    this.appointmentService.approveAppointment(appointment.id).subscribe(
      () => {
        alert('Appointment approved successfully');
        this.fetchAppointments();
      },
      (error) => {
        console.error('Error approving appointment:', error);
        alert('Failed to approve appointment');
      }
    );
  }

  // Reject appointment
  rejectAppointment(appointment: any): void {
    this.appointmentService.rejectAppointment(appointment.id).subscribe(
      () => {
        alert('Appointment rejected successfully');
        this.fetchAppointments();
      },
      (error) => {
        console.error('Error rejecting appointment:', error);
        alert('Failed to reject appointment');
      }
    );
  }

  private paginateAppointments(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedAppointments = this.appointments.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.paginateAppointments();
  }

  openUpdateModal(appointment: any): void {
    this.selectedAppointment = { ...appointment };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  updateAppointment(): void {
    this.appointmentService.updateAppointment(this.selectedAppointment).subscribe(
      () => {
        alert('Appointment updated successfully');
        this.fetchAppointments();
        this.closeModal();
      },
      (error) => {
        console.error('Error updating appointment:', error);
        alert('Failed to update appointment');
      }
    );
  }

  softDeleteAppointment(appointmentId: number): void {
    this.appointmentService.softDeleteAppointment(appointmentId).subscribe(
      () => {
        alert('Appointment deleted successfully');
        this.fetchAppointments();
      },
      (error) => {
        console.error('Error deleting appointment:', error);
        alert('Failed to delete appointment');
      }
    );
  }
}
