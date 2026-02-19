import { Component } from '@angular/core';
import { Navbar } from "../../shared/components/navbar/navbar";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  standalone:true,
  imports: [Navbar, RouterOutlet],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout {
  spaces = [
  {
    id: 1,
    name: 'Modern Co-working Space',
    location: 'Mumbai, India',
    price: 1500,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
  },
  {
    id: 2,
    name: 'Premium Office Suite',
    location: 'Delhi, India',
    price: 2500,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=800'
  },
  {
    id: 3,
    name: 'Startup Workspace',
    location: 'Bangalore, India',
    price: 1200,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800'
  }
];

onBook(id: number) {
  console.log('Booking space with ID:', id);
}


}
