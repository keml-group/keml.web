import { Component } from '@angular/core';

@Component({
  selector: 'conversation-partner',
  templateUrl: './conversation-partner.component.svg',
  styleUrl: './conversation-partner.component.css'
})
export class ConversationPartnerComponent {

  fillColor = 'rgb(0, 255, 0)';

  changeColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    this.fillColor = `rgb(${r}, ${g}, ${b})`;
  }
}
