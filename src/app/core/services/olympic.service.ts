import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, filter, tap, map } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient) {}
  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next([]);
        return caught;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  getOlympicsById(id: number): Observable<Olympic | undefined> {
    return this.olympics$.asObservable().pipe(
      map(olympics => {
        let olympic = undefined
        olympics.forEach(e=>{
          if (e.id == id) {
            olympic = e;
          }
        })

        // Log or handle the case where the Olympic is not found
        if (!olympic) {
          console.warn(`Olympic with ID ${id} not found`);
        }
        return olympic;
      }),
      catchError(error => {
        // Log the error and return undefined in case of an error
        console.error('Error fetching Olympic by ID:', error);
        return of(undefined); // Return undefined on error
      })
    );
  }
}
