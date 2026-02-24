import { Component } from "@angular/core";
import { FormBuilder, Validator, ReactiveFormsModule, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { SpaceService } from "../../../../core/services/space.service";
import { NgIf, NgFor} from "@angular/common";

@Component({
    selector:'app-add-space',
    standalone:true,
    imports:[ReactiveFormsModule, NgIf, NgFor],
    templateUrl: './add-space.html',
    styleUrl: './add-space.css' 
})

export class AddSpace{
    
    spaceForm! : FormGroup;
    isLoading  = false;
    errorMessage = '';
    submitted = false;

    spaceTypes = [
        {label:'Private Cabin', value:'private_cabin' },
        {label:'Hot Desk', value:'hot_desk' },
        {label:'Meeting Room', value:'meeting_room' },
        {label:'Event Space', value:'event_space' }
    ]

    constructor(
        private fb : FormBuilder,
        private spaceService: SpaceService,
        private router : Router
    ){
        this.spaceForm = this.fb.group({
            space_name: ['', Validators.required],
            location: ['', Validators.required],
            max_capacity:['', [Validators.required, Validators.min(1)]],
            space_type:['', Validators.required],
            description: [''],
            image_url: ['']
        });
    }

    onSubmit(){

        if(this.isLoading) return;

        this.submitted = true;
        
        if(this.spaceForm.invalid) return;

        this.isLoading  = true;
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