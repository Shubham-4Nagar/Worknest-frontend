import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { SpaceService } from "../../../../core/services/space.service";

interface Space {
  space_id: string;
  space_name: string;
  location: string;
  max_capacity: number;
  space_type: string;
  image_url: string;
}

@Component({
  selector: "app-browse-spaces",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./browse-spaces.html",
  styleUrl: "./browse-spaces.css"
})
export class BrowseSpaces implements OnInit {

  spaces: Space[] = [];
  filteredSpaces: Space[] = [];
  isLoading = true;
  selectedType = "";
  searchTerm = "";
  readonly typeOptions = [
    { label: 'All workspace types', value: '' },
    { label: 'Private Cabin', value: 'private_cabin' },
    { label: 'Hot Desk', value: 'hot_desk' },
    { label: 'Meeting Room', value: 'meeting_room' },
    { label: 'Event Space', value: 'event_space' },
  ];

  constructor(
    private spaceService: SpaceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadSpaces();
  }

  loadSpaces() {

    this.spaceService.getSpaces().subscribe({

      next: (data: Space[]) => {

        this.spaces = data;
        this.filteredSpaces = data;
        this.isLoading = false;

      },

      error: () => {
        this.isLoading = false;
      }

    });

  }

  filterSpaces() {
    const normalizedSearch = this.searchTerm.trim().toLowerCase();

    this.filteredSpaces = this.spaces.filter((space) => {
      const matchesType = !this.selectedType || space.space_type === this.selectedType;
      const matchesSearch =
        !normalizedSearch ||
        space.space_name.toLowerCase().includes(normalizedSearch) ||
        space.location.toLowerCase().includes(normalizedSearch);

      return matchesType && matchesSearch;
    });
  }

  bookSpace(spaceId: string) {

    this.router.navigate(
      ["/dashboard/user/bookings"],
      {
        queryParams: { spaceId: spaceId }
      }
    );

  }

  formatType(type: string): string {
    return type
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

}
