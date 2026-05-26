import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { RequestOwnerService } from "../../../../core/services/owner-request.service";
import { finalize } from "rxjs";

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
  selectedFileName = '';

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
    this.selectedFileName = file.name;
    this.message = '';
  }

  // Upload to Cloudinary
  uploadFile() {

    if (!this.selectedFile) return;

    this.isUploading = true;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('upload_preset', 'worknest_upsigned');
    formData.append('folder', 'worknest/id_proofs');

    this.message = '';

    this.http.post<any>(
      'https://api.cloudinary.com/v1_1/ddjbb1yy2/image/upload',
      formData
    ).pipe(finalize(() => this.isUploading = false)).subscribe({

      next: (response) => {

        this.uploadedFileUrl = response.secure_url;
        this.message = 'Document uploaded successfully. You can submit the request now.';

      },

      error: () => {

        this.message = 'Upload failed. Please try again.';

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
    }).pipe(finalize(() => this.isSubmitting = false)).subscribe({

        next: () => {
            this.message = "Owner request submitted Successfully";
        },

        error: (err) => {
            this.message = err.error?.error || "Request Failed";
        }
    });
}

}
