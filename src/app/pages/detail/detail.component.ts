import { Component, OnInit, HostListener, OnDestroy } from '@angular/core'; // Import de OnDestroy
import { Observable, of, Subscription } from 'rxjs'; // Import de Subscription
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { ActivatedRoute } from '@angular/router';


interface ChartData {
  name: string;
   series:
    { name: string,
      value: number
    }[]
  }

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, OnDestroy { // Ajout de OnDestroy
  title: string = 'Name Country';
  public olympics$: Observable<Olympic | undefined> = of(undefined);
  public totalAthleteCount: number = 0;
  public totalMedalsCount: number = 0;
  view: [number, number] = [700, 400]; // default chart view

  // chart options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Medals Count';
  timeline: boolean = true;

  public chartData: ChartData[] = [];
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  private subscription: Subscription | undefined; // Ajout de la propriété Subscription

  constructor(private olympicService: OlympicService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    const olympicId = +this.route.snapshot.params['id'];

    if (olympicId) {
      this.olympics$ = this.olympicService.getOlympicsById(olympicId);

      // Stocker la souscription
      this.subscription = this.olympics$.subscribe(olympic => {
        if (olympic) {
          // Calculate total athletes and medals
          olympic.participations.forEach(p => {
            this.totalAthleteCount += p.athleteCount;
            this.totalMedalsCount += p.medalsCount;
          });

          // Prepare data for the multi-series chart
          const multi = olympic.participations.map(participation => ({
            name: participation.year.toString(),
            value: participation.medalsCount
          }));

          this.chartData = [{
            name: olympic.country,
            series: multi
          }];

          // Update the title with the country name
          this.title = olympic.country;
        }
      });
    }

    // Set the initial chart view based on the current window size
    this.setChartView();
  }

  // Listen for the window resize event and adjust the chart dimensions
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.setChartView();
  }

  // Dynamically set the chart view based on window width
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

  // Ajout de ngOnDestroy pour se désinscrire de l'observable
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Désinscription propre
    }
  }
}
