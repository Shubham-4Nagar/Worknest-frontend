import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { NgFor } from "@angular/common";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, NgFor],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing {

  spaceTypes = [
    {
      label: 'Private Cabin',
      value: 'private_cabin',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
      description: 'Fully furnished private cabins for focused work.'
    },
    {
      label: 'Hot Desk',
      value: 'hot_desk',
      image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70',
      description: 'Flexible shared desks in vibrant coworking areas.'
    },
    {
      label: 'Meeting Room',
      value: 'meeting_room',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0',
      description: 'Professional meeting rooms with smart displays.'
    },
    {
      label: 'Event Space',
      value: 'event_space',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865',
      description: 'Large event halls for workshops and corporate events.'
    }
  ];

  stats = [
    { value: '4+', label: 'workspace formats' },
    { value: '24/7', label: 'booking-ready discovery' },
    { value: '1', label: 'unified ops dashboard' },
  ];
}
