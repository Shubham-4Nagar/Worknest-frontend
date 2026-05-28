import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SpaceService } from '../../../../core/services/space.service';
import { Subject, takeUntil } from 'rxjs';

interface Space {
  space_id: string;
  space_name: string;
  location: string;
  max_capacity: number;
  space_type: string;
  image_url: string;
}

@Component({
  selector: 'app-browse-spaces',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './browse-spaces.html',
  styleUrl: './browse-spaces.css'
})
export class BrowseSpaces implements OnInit, OnDestroy {

  spaces: Space[] = [];
  filteredSpaces: Space[] = [];
  isLoading = true;
  selectedType = '';
  searchTerm = '';

  // FIX: cancel any in-flight HTTP call if component is destroyed
  // during a double-navigation cycle — prevents stale results
  private destroy$ = new Subject<void>();

  readonly typeOptions = [
    { label: 'All workspace types', value: '' },
    { label: 'Private Cabin',       value: 'private_cabin' },
    { label: 'Hot Desk',            value: 'hot_desk' },
    { label: 'Meeting Room',        value: 'meeting_room' },
    { label: 'Event Space',         value: 'event_space' },
  ];

  constructor(
    private spaceService: SpaceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadSpaces();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSpaces() {
    this.isLoading = true;
    this.spaceService.getSpaces()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          // API returns plain array OR { spaces: [...] }
          const list: Space[] = Array.isArray(data) ? data : (data?.spaces ?? []);
          this.spaces = list;
          this.filteredSpaces = list;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }

  filterSpaces() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredSpaces = this.spaces.filter(space => {
      const matchesType   = !this.selectedType || space.space_type === this.selectedType;
      const matchesSearch = !term ||
        space.space_name.toLowerCase().includes(term) ||
        space.location.toLowerCase().includes(term);
      return matchesType && matchesSearch;
    });
  }

  bookSpace(spaceId: string) {
    this.router.navigate(['/dashboard/user/bookings'], {
      queryParams: { spaceId }
    });
  }

  formatType(type: string): string {
    return type.split('_')
      .map(p => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');
  }
}
