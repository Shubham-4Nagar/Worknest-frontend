import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfilePage implements OnInit {
  user: any = null;
  role = '';
  isLoading = true;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.role = this.authService.getRole() || 'User';

    this.authService
      .getCurrentUser()
      .pipe(catchError(() => of(null)))
      .subscribe((user) => {
        this.user = user;
        this.isLoading = false;
      });
  }

  get displayName(): string {
    const firstName = this.user?.first_name || '';
    const lastName = this.user?.last_name || '';
    const combined = `${firstName} ${lastName}`.trim();

    return combined || this.user?.name || 'Worknest member';
  }

  get email(): string {
    return this.user?.email || 'No email available';
  }

  get initials(): string {
    return this.displayName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  get joinedDate(): string | null {
    return this.user?.created_at || null;
  }
}
