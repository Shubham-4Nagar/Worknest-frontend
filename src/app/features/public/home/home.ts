import { Component } from '@angular/core';
import { SpaceCard } from "../../../shared/components/space-card/space-card";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SpaceCard, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  spaces = [
  {
    space_id: '1',
    space_name: 'Modern Co-working Space',
    location: 'Mumbai, India',
    max_capacity: 20,
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
  },
  {
    space_id: '2',
    space_name: 'Premium Office Suite',
    location: 'Delhi, India',
    max_capacity: 10,
    image_url: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=800'
  },
  {
    space_id: '3',
    space_name: 'Startup Workspace',
    location: 'Bangalore, India',
    max_capacity: 100,
    image_url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800'
  }
];
onBook(space_id:string){
  console.log('Booking space with ID:', space_id)
}

}