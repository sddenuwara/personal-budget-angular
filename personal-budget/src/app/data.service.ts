import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  public dataSource = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#ffcd56',
          '#ff6384',
          '#36a2eb',
          '#fd6b19',
          '#00ff00',
          '#0000ff',
          '#ff0000'
        ]
      }
    ]
  };

  createData(): Observable<any> {
    return this.http.get('http://localhost:3000/budget');
  }

  getData() {
    if (this.dataSource.labels.length == 0) {
      this.createData()
      .subscribe((res: any) => {
        this.dataSource = res;
        return this.dataSource;
      });
    }
    return this.dataSource;
  }

  constructor(private http: HttpClient) {
    this.getData();
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

}
