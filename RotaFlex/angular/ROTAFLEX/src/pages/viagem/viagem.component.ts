// src/app/components/viagem/viagem.component.ts
import { Component } from '@angular/core';
import { Rota } from '../../app/entities/models/rota.model';
import { OpcaoTransporte } from '../../app/entities/models/opcaoTransporte.model';
import { ViagemService } from '../../app/services/viagem.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

@Component({
  standalone: true,
  imports: [
      MatTableModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      FormsModule,
      CommonModule,
      MatIconModule,
      MatDividerModule,
      HttpClientModule,
    ],
  selector: 'app-viagem',
  templateUrl: './viagem.component.html'
})
export class ViagemComponent {
  tipoViagem: 'particular' | 'publico' = 'particular';
  viagem: Rota = { origem: '', destino: '' };
  opcoes: OpcaoTransporte[] = [];
  carregando = false;
  erro = '';

  constructor(private viagemService: ViagemService) {}

  calcularRota() {
    if (!this.viagem.origem || !this.viagem.destino) return;

    this.carregando = true;
    this.erro = '';
    this.opcoes = [];

    this.viagemService.calcularRota(this.viagem).subscribe({
      next: (res) => {
        this.opcoes = res;
        this.carregando = false;
      },
      error: (err) => {
        this.erro = 'Erro ao calcular rota.';
        console.error(err);
        this.carregando = false;
      }
    });
  }
}
