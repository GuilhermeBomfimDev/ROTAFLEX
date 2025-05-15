import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transporte } from '../entities/models/transporte.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class TransporteService {

  private apiUrl = `${environment.apiUrl}/TransportePublico`;

  
  constructor(private http: HttpClient) {}

  // GET: Listar todos os transportes
  listar(): Observable<Transporte[]> {
    return this.http.get<Transporte[]>(this.apiUrl);
  }

  // GET: Obter transporte por ID
  obterPorId(id: number): Observable<Transporte> {
    return this.http.get<Transporte>(`${this.apiUrl}/${id}`);
  }

  // POST: Criar novo transporte
  adicionar(transporte: Transporte): Observable<Transporte> {
    return this.http.post<Transporte>(this.apiUrl, transporte);
  }

  // PUT: Atualizar transporte existente
  atualizar(transporte: Transporte): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${transporte.idTransporte}`, transporte);
  }

  // DELETE: Excluir transporte
  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
