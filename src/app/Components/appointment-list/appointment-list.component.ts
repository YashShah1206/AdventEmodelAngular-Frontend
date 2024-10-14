import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Import FormsModule
import { AppointmentService } from '../../Services/appointment.service';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Add FormsModule here
  styleUrls: ['./appointment-list.component.css'],
})
export class AppointmentListComponent implements OnInit {
  appointments: any[] = [];
  paginatedAppointments: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  selectedAppointment: any = {}; // Initialize selectedAppointment for updating
  isModalOpen: boolean = false; // Initialize modal visibility

  // Pagination variables
  currentPage: number = 1;
  itemsPerPage: number = 8;

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.fetchAppointments();
  }

  // Fetch appointments from the service
  private fetchAppointments(): void {
    this.appointmentService.getAllAppointments().subscribe(
      (data) => {
        this.appointments = data.map((appointment: any) => ({
          ...appointment,
          terminalName: appointment.terminal ? appointment.terminal.terminalName : 'N/A',
        }));
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

  // Pagination logic
  private paginateAppointments(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedAppointments = this.appointments.slice(startIndex, endIndex);
  }

  // Handle page changes
  changePage(page: number): void {
    this.currentPage = page;
    this.paginateAppointments();
  }

  // Open update modal with selected appointment
  openUpdateModal(appointment: any): void {
    this.selectedAppointment = { ...appointment }; // Set the selected appointment for updating
    this.isModalOpen = true; // Open the modal
  }

  // Close the modal
  closeModal(): void {
    this.isModalOpen = false; // Close the modal
    this.selectedAppointment = {}; // Reset selected appointment
  }

  // Confirm the update of the appointment
  updateAppointment(): void {
    // Ensure that the selected appointment has an ID for updating
    if (this.selectedAppointment && this.selectedAppointment.id) {
      this.appointmentService.updateAppointment(this.selectedAppointment).subscribe(
        () => {
          alert('Appointment updated successfully');
          this.fetchAppointments(); // Refresh appointments
          this.closeModal(); // Close modal after update
        },
        (error) => {
          console.error('Error updating appointment:', error);
          alert('Failed to update appointment');
        }
      );
    } else {
      alert('No appointment selected for update');
    }
  }

  // Soft delete appointment
  deleteAppointment(appointmentId: number): void {
    this.appointmentService.deleteAppointment(appointmentId).subscribe(
      () => {
        alert('Appointment deleted successfully');
        this.fetchAppointments(); // Refresh appointments
      },
      (error) => {
        console.error('Error deleting appointment:', error);
        alert('Failed to delete appointment');
      }
    );
  }

  // Soft delete appointment - if necessary, otherwise just use deleteAppointment
  softDeleteAppointment(appointmentId: number): void {
    // If you want a specific soft delete implementation, define it here.
    this.deleteAppointment(appointmentId); // Use existing delete method
  }

  
}