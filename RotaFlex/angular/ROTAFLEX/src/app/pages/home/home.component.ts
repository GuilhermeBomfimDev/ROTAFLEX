import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {

  rotaForm: FormGroup;
  resultado: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.rotaForm = this.fb.group({
      origem: ['', Validators.required],
      destino: ['', Validators.required]
    });
  }
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
  
  calcularRota() {
    const rota = {
      Origem: this.rotaForm.value.origem,
      Destino: this.rotaForm.value.destino
    };

    this.http.post<any[]>('https://localhost:7031/api/rota/calcular', rota)
      .subscribe({
        next: (res) => {
          this.resultado = res;
        },
        error: (err) => {
          alert(err.error?.mensagem || 'Erro ao calcular rota');
          console.error(err);
        }
      });
  }
}
