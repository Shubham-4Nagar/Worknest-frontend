import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { SpaceService } from '../../../../core/services/space.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-edit-space',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './edit-space.html',
  styleUrl: './edit-space.css'
})
export class EditSpace implements OnInit {

  spaceId!: string;
  isLoading = true;
  isSaving = false;
  message = '';
  editForm!: FormGroup;
  spaceTypes = [
    { label: 'Private Cabin', value: 'private_cabin' },
    { label: 'Hot Desk', value: 'hot_desk' },
    { label: 'Meeting Room', value: 'meeting_room' },
    { label: 'Event Space', value: 'event_space' }
  ];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private spaceService: SpaceService,
    private router: Router
  ) {}

  ngOnInit() {

    //  Create form first
    this.editForm = this.fb.group({
      space_name: ['', Validators.required],
      location: ['', Validators.required],
      max_capacity: ['', [Validators.required, Validators.min(1)]],
      space_type: ['', Validators.required],
      description: ['']
    });

    //Get ID
    this.spaceId = this.route.snapshot.paramMap.get('id')!;

    //Load space data
    this.loadSpace();
  }

  loadSpace() {
    this.spaceService.getSpaceById(this.spaceId).subscribe({
      next: (res) => {
        console.log("Edit response:", res);

        //IMPORTANT FIX HERE
        const space = res.space || res;

        this.editForm.patchValue({
          space_name: space.space_name,
          location: space.location,
          max_capacity: space.max_capacity,
          space_type: space.space_type,
          description: space.description ?? ''
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.router.navigate(['/dashboard/owner/spaces']);
      }
    });
  }

  onSubmit() {
    if (this.editForm.invalid || this.isSaving) return;

    this.isSaving = true;
    this.message = '';

    this.spaceService.updateSpaces(this.spaceId, this.editForm.value)
      .subscribe({
        next: () => {
          this.message = 'Space updated successfully';
          this.router.navigate(['/dashboard/owner/spaces']);
        },
        error: (err) => {
          console.error(err);
          this.message = 'Update failed';
          this.isSaving = false;
        }
      });
  }
}
