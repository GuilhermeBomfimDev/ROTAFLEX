import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = environment.apiUrl;


  constructor(
    private http: HttpClient,
  
  ) { }

//INTRODUZIR LOGICA DE ROTAS AQUI 


}
