import { Component, OnInit } from "@angular/core";
import { NgFor, NgIf } from "@angular/common";
import { SpaceService } from "../../../../core/services/space.service";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-owner-dashboard',
    standalone: true,
    imports: [NgIf, NgFor, RouterLink],
    templateUrl: './owner-dashboard.html',
    styleUrl: './owner-dashboard.css'
})
export class OwnerDashboard implements OnInit {

    spaces: any[] = [];
    isLoading = true;

    constructor(private spaceService : SpaceService){}

    ngOnInit(){
        this.loadSpaces();
    }
    loadSpaces(){
        this.spaceService.getOwnerSpaces().subscribe({
            next:(res)=> {
                console.log("FULL RESPONSE:", res);
                this.spaces =res.spaces;
                this.isLoading = false;
            },
            error: (err) => {
                console.error(err);
                this.isLoading = false;
            }
        });
    }
    deleteSpace(spaceId: string){
        const confirmed = confirm("Are you sure you want to delete this space ?");

        if(!confirmed) return;

        this.spaceService.deleteSpaces(spaceId).subscribe({
            next: ()=> {
                this.spaces = this.spaces.filter(
                    space => space.space_id !== spaceId
                );
            },
            error(err) {
                console.log("Delete failed:", err);
                alert("Something went wrong!");
            }
        });
    }
}