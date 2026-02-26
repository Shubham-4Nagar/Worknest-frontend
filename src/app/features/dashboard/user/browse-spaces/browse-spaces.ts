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

    if (!this.selectedType) {
      this.filteredSpaces = this.spaces;
      return;
    }

    this.filteredSpaces = this.spaces.filter(
      space => space.space_type === this.selectedType
    );

  }

  bookSpace(spaceId: string) {

    this.router.navigate(
      ["/dashboard/user/bookings"],
      {
        queryParams: { spaceId: spaceId }
      }
    );

  }

}