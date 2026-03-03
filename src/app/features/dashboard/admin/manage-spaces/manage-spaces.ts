import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../core/services/admin.service';

@Component({
  selector: 'app-manage-spaces',
  imports: [CommonModule,],
  templateUrl: './manage-spaces.html',
  styleUrl: './manage-spaces.css',
})
export class ManageSpaces implements OnInit {

  spaces: any[] =[];
  isLoading = true;

  constructor(private adminService : AdminService){}

  ngOnInit(): void {
    this.loadPendingSpaces();
  }

  loadPendingSpaces(){
    this.isLoading = true;

    this.adminService.getPendingSpaces().subscribe({
      next:(res : any) => {
        this.spaces = res.pending_spaces;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
  updateSpace(spaceId:string, status: 'active'|'inactive'){
    this.adminService.updateSpacseStatus(spaceId,status).subscribe(()=>{
      this.loadPendingSpaces();
    });
  }

}

