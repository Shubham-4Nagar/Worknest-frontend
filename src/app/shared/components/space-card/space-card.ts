import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Space {
  space_id:string;
  space_name:string;
  location:string;
  max_capacity:number;
  image_url: string | null;
}

@Component({
  selector: 'app-space-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './space-card.html',
  styleUrl: './space-card.css'
})
export class SpaceCard {

  @Input() space!: Space;

  @Output() book = new EventEmitter<string>();

  onBook() {
    this.book.emit(this.space.space_id);
  }
}
