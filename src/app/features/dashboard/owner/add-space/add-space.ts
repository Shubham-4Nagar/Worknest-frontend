import { Component } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { SpaceService } from "../../../../core/services/space.service";
import { NgIf, NgFor } from "@angular/common";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-add-space',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor],
  templateUrl: './add-space.html',
  styleUrl: './add-space.css'
})

export class AddSpace {

  spaceForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  submitted = false;

  selectedFile!: File;
  imagePreview: string | null = null;
  uploadedImageUrl: string | null = null;

  spaceTypes = [
    { label: 'Private Cabin', value: 'private_cabin' },
    { label: 'Hot Desk', value: 'hot_desk' },
    { label: 'Meeting Room', value: 'meeting_room' },
    { label: 'Event Space', value: 'event_space' }
  ];

  constructor(
    private fb: FormBuilder,
    private spaceService: SpaceService,
    private router: Router,
    private http: HttpClient
  ) {
    this.spaceForm = this.fb.group({
      space_name: ['', Validators.required],
      location: ['', Validators.required],
      max_capacity: ['', [Validators.required, Validators.min(1)]],
      space_type: ['', Validators.required],
      description: [''],
      image_url: ['']
    });
  }

  // File selection
  onFileSelected(event: any) {
    const file = event.target.files[0];  // FIXED
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  //Upload to Cloudinary
  uploadImage() {

    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('upload_preset', 'worknest_upsigned'); 

    this.http.post<any>(
      'https://api.cloudinary.com/v1_1/ddjbb1yy2/image/upload',
      formData
    ).subscribe({
      next: (response) => {

        this.uploadedImageUrl = response.secure_url;

        this.spaceForm.patchValue({
          image_url: this.uploadedImageUrl
        });

        alert('Image uploaded successfully');
      },
      error: () => {
        alert('Image upload failed');
      }
    });
  }

  onSubmit() {

    if (this.isLoading) return;

    this.submitted = true;

    if (this.spaceForm.invalid || !this.uploadedImageUrl) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.spaceService.createSpace(this.spaceForm.value).subscribe({
      next: () => {
        this.router.navigate(['/dashboard/owner']);
      },
      error: () => {
        this.errorMessage = 'Failed to create space';
        this.isLoading = false;
      }
    });
  }
}