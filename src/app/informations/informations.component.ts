import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-informations',
  standalone: true,
  imports: [],
  templateUrl: './informations.component.html',
  styleUrl: './informations.component.scss'
})
export class InformationsComponent {
  @Input() textInformation!: string;
  @Input() numberInformation!: number | undefined;
}
