import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = 'https://localhost:7187/api/Payment'; // Adjust your backend API URL

  constructor(private http: HttpClient) {}

  createPaymentIntent(amount: number): Observable<{ clientSecret: string }> {
    return this.http.post<{ clientSecret: string }>(`${this.apiUrl}/create-payment-intent`,amount);
  }
}
