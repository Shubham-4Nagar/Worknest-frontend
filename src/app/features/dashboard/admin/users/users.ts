import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../core/services/admin.service';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {

  users: any[] = [];
  isLoading = true;
  searchTerm = '';
  selectedRole = 'All';

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getAllUsers().subscribe({
      next: (response: any) => {
        this.users = response?.users ?? response ?? [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  get filteredUsers(): any[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.users.filter((user) => {
      const fullName = `${user.first_name || ''} ${user.last_name || ''} ${user.name || ''}`.toLowerCase();
      const email = (user.email || '').toLowerCase();
      const role = user.role || 'User';

      const matchesSearch = !term || fullName.includes(term) || email.includes(term);
      const matchesRole = this.selectedRole === 'All' || role === this.selectedRole;

      return matchesSearch && matchesRole;
    });
  }

  getRoleCount(role: string): number {
    return this.users.filter((user) => (user.role || 'User') === role).length;
  }

  getDisplayName(user: any): string {
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    return fullName || user.name || 'Unnamed user';
  }

}
