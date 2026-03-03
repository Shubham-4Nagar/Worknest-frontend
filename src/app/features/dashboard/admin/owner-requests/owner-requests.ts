import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../core/services/admin.service';

@Component({
  selector: 'app-owner-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './owner-requests.html',
  styleUrl: './owner-requests.css',
})
export class OwnerRequests implements OnInit {

  owners: any[] = [];
  isLoading = true;

  constructor(private adminService: AdminService){}

  ngOnInit(): void {
    this.loadPendingOwners();
  }

  loadPendingOwners(){
    this.isLoading = true;

    this.adminService.getPendingOwners().subscribe((res:any)=>{
      this.owners = res.pending_owners;
      this.isLoading = false;
    });
  }

  updateOwnerStatus(ownerId:string, status: 'approved'|'rejected'){
    this.adminService.verifyOwner(ownerId, status).subscribe(() => {
      this.loadPendingOwners(); 
    });
  }
}