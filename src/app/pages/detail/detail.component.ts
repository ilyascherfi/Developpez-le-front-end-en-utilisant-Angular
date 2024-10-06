import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { Color, id, LegendPosition } from '@swimlane/ngx-charts';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})

export class DetailComponent implements OnInit {
  title: string = 'Name Country';

  public olympics$: Observable<Olympic | undefined> = of(undefined); // Correct type
  public totalAthleteCount: number = 0;
  public totalMedalsCount: number = 0;
  view: [number, number] = [700, 400];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = true;

  public chartData: any[] = [];

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };



  constructor(private olympicService: OlympicService,
              private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const olympicId = +this.route.snapshot.params['id'];

    if (olympicId) {
      this.olympics$ = this.olympicService.getOlympicsById(olympicId);

      this.olympics$.subscribe(olympic => {
        if (olympic) {
          olympic.participations.forEach(p => {
            this.totalAthleteCount += p.athleteCount;
          })
          olympic.participations.forEach(p => {
            this.totalMedalsCount += p.medalsCount;
          })

          const multi = olympic.participations.map(participation => ({
            name: olympic.country,
            series: olympic.participations.map(p => ({
              name: p.year.toString(),
              value: p.medalsCount
            }))
          }));


          this.chartData = multi;

        }
      });
    }
  }

}
