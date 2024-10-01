import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { InformationsComponent } from 'src/app/informations/informations.component';
import { TitleComponent } from 'src/app/title/title.component';
import { Olympic } from 'src/app/core/models/Olympic';

interface ChartData {
  id: number,
  country: string,
  totalMedals: number
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [TitleComponent, InformationsComponent]
})
export class HomeComponent implements OnInit {
  view: [number, number] = [700, 400];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  public olympics$: Observable<Olympic[]> = of([]);

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe(olympicsDataArray => {
      const chartData = olympicsDataArray.map(olympic => {
        let medalCount = 0
        olympic.participations.forEach((participation) => { medalCount += participation.medalsCount})
        return {
          id: olympic.id,
          country: olympic.country,
          medalCount: medalCount
        }
      })
      console.log("chartData",chartData)
    })

  }
}
