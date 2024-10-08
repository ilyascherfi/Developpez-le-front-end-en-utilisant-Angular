import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import {LegendPosition } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';

interface ChartData {
  id: number,
  name: string,
  value: number
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  view: [number, number] = [700, 400]; // default view dimensions
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: LegendPosition = LegendPosition.Below;
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  public olympics$: Observable<Olympic[]> = of([]);
  public chartData: ChartData[] = []

  constructor(private olympicService: OlympicService,
              private router: Router
  ) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe(olympicsDataArray => {
      const chartData = olympicsDataArray.map(olympic => {
        let medalCount: number = 0;
        olympic.participations.forEach(participation => {
          medalCount += participation.medalsCount;
        });
        return {
          id: olympic.id,
          name: olympic.country,
          value: medalCount
        };
      });
      this.chartData = chartData;
    });
  }

  // Listen for the window resize event and adjust the view accordingly
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.setChartView();
  }

  ngAfterViewInit(): void {
    // Set initial chart dimensions based on current screen size
    this.setChartView();
  }

  setChartView(): void {
    const width = window.innerWidth;

    if (width < 600) {
      // Small screen (mobile)
      this.view = [300, 300];
    } else if (width >= 600 && width < 1024) {
      // Medium screen (tablet)
      this.view = [500, 400];
    } else {
      // Large screen (desktop)
      this.view = [700, 400];
    }
  }

  onSelect(event: { name: string, value: number, label: string }): void {
    const selectedCountry: ChartData | undefined = this.chartData.find(country => country.name === event.name);
    if (selectedCountry !== undefined) {
      const id: number = selectedCountry.id;
      this.router.navigateByUrl(`details/${id}`);
    }
  }
}
