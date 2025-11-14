import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

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
  map!: L.Map;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.rotaForm = this.fb.group({
      origem: ['', Validators.required],
      destino: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    this.inicializarMapa();
  }

  inicializarMapa() {
  if (this.map) {
    this.map.invalidateSize();
    return;
  }

  this.map = L.map('map').setView([-23.55, -46.63], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    detectRetina: true,
  }).addTo(this.map);

  setTimeout(() => {
    this.map.invalidateSize();
  }, 300);
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
          this.adicionarMarcadores();
        },
        error: (err) => {
          alert(err.error?.mensagem || 'Erro ao calcular rota');
          console.error(err);
        }
      });
  }

  adicionarMarcadores() {
    if (!this.resultado || this.resultado.length === 0) return;

    const origem = this.resultado.find(x => x.tipo === "origem");
    const destino = this.resultado.find(x => x.tipo === "destino");

    if (origem) {
      L.marker([origem.latitude, origem.longitude])
        .addTo(this.map)
        .bindPopup("Origem")
        .openPopup();
    }

    if (destino) {
      L.marker([destino.latitude, destino.longitude])
        .addTo(this.map)
        .bindPopup("Destino");
    }

    // Ajusta o mapa para mostrar ambos os pontos
    if (origem && destino) {
      const bounds = L.latLngBounds(
        [origem.latitude, origem.longitude],
        [destino.latitude, destino.longitude]
      );
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }
}
