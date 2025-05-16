import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transporte } from '../entities/models/transporte.model';
import { environment } from '../../environments/environment';
import { Rota } from '../entities/models/rota.model';
import { OpcaoTransporte } from '../entities/models/opcaoTransporte.model';

@Injectable({
  providedIn: 'root'
})

export class ViagemService {

  private apiUrl = `${environment.apiUrl}/Viagem`;

  
  constructor(private http: HttpClient) {}

  calcularRota(rota: Rota): Observable<OpcaoTransporte[]> {
    return this.http.post<OpcaoTransporte[]>(`${this.apiUrl}/calcular`, rota);
  }

}
