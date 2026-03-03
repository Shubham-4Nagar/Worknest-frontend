import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { RequestOwnerService } from "../../../../core/services/owner-request.service";

@Component({
  selector: 'app-request-owner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './request-owner.html',
  styleUrl: './request-owner.css'
})
export class RequestOwner {

  selectedFile!: File;
  uploadedFileUrl: string | null = null;

  isUploading = false;
  isSubmitting = false;

  message = '';

  constructor(
    private http: HttpClient,
    private requestService: RequestOwnerService
  ) {}

  // Select file
  onFileSelected(event: any) {

    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;
  }

  // Upload to Cloudinary
  uploadFile() {

    if (!this.selectedFile) return;

    this.isUploading = true;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('upload_preset', 'worknest_upsigned');
    formData.append('folder', 'worknest/id_proofs');

    this.http.post<any>(
      'https://api.cloudinary.com/v1_1/ddjbb1yy2/image/upload',
      formData
    ).subscribe({

      next: (response) => {

        this.uploadedFileUrl = response.secure_url;
        this.isUploading = false;

        alert('Document uploaded successfully');

      },

      error: () => {

        this.isUploading = false;
        alert('Upload failed');

      }

    });

  }

  // Submit to backend
  submitRequest(){
    if(!this.uploadedFileUrl) return;

    this.isSubmitting = true;
    this.message ='';

    this.requestService.submitRequest({
        id_proof:this.uploadedFileUrl
    }).subscribe({

        next: () => {
            this.message = "Owner request submitted Successfully";
            this.isSubmitting = false;
        },

        error: (err) => {
            this.message = err.error?.error || "Request Failed";
            this.isSubmitting = false;
        }
    });
}

}