import { Component, OnInit } from '@angular/core';
import { Transporte } from '../../app/entities/models/transporte.model';
import { TransporteService } from '../../app/services/transporte.service';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClientModule } from '@angular/common/http';
import { TipoTransporte } from '../../app/entities/enums/tipo.transporte';

@Component({
  selector: 'app-transporte',
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
  templateUrl: './transporte.component.html',
})
export class TransporteComponent implements OnInit {
  transportes: Transporte[] = [];
  colunas: string[] = ['tipo', 'valor', 'estado', 'cidade', 'acoes'];

  novoTransporte: Transporte = this.criarNovoTransporte();
  exibirFormulario: boolean = false;

  tiposTransporte = [
  { valor: TipoTransporte.Onibus, nome: 'Ônibus' },
  { valor: TipoTransporte.Metro, nome: 'Metrô' },
  { valor: TipoTransporte.Trem, nome: 'Trem' },
  { valor: TipoTransporte.Vlt, nome: 'VLT' }
];

  constructor(private transporteService: TransporteService) {}

  ngOnInit(): void {
    this.carregarTransportes();
  }

  carregarTransportes(): void {
    this.transporteService.listar().subscribe({
      next: (dados) => (this.transportes = dados),
      error: (erro) => console.error('Erro ao carregar transportes', erro),
    });
  }

  abrirFormulario(): void {
    this.exibirFormulario = true;
    this.novoTransporte = this.criarNovoTransporte();
  }

salvar(): void {
  if (this.novoTransporte.idTransporte === 0) {
    // Criação
    this.transporteService.adicionar(this.novoTransporte).subscribe({
      next: () => {
        this.carregarTransportes();
        this.exibirFormulario = false;
      },
      error: (erro) => console.error('Erro ao adicionar transporte', erro),
    });
  } else {
    // Edição
    this.transporteService.atualizar(this.novoTransporte).subscribe({
      next: () => {
        this.carregarTransportes();
        this.exibirFormulario = false;
        this.novoTransporte = this.criarNovoTransporte();
      },
      error: (erro) => console.error('Erro ao atualizar transporte', erro),
    });
  }
}


editar(transporte: Transporte): void {
  this.novoTransporte = { ...transporte }; // Copia os dados
  this.exibirFormulario = true; // Exibe o formulário para edição
}


  excluir(transporte: Transporte): void {
    if (confirm(`Deseja realmente excluir o transporte ${transporte.idTransporte}?`)) {
      this.transporteService.excluir(transporte.idTransporte).subscribe({
        next: () => this.carregarTransportes(),
        error: (erro) => console.error('Erro ao excluir transporte', erro),
      });
    }
  }

  private criarNovoTransporte(): Transporte {
    return {
      idTransporte: 0,
      tipo: 1,
      valor: 0,
      estado: '',
      cidade: '',
    };
  }

    getTipoNome(tipo: number): string {
    switch (tipo) {
      case TipoTransporte.Onibus: return 'Ônibus';
      case TipoTransporte.Metro: return 'Metrô';
      case TipoTransporte.Trem: return 'Trem';
      case TipoTransporte.Vlt: return 'VLT';
      default: return 'Desconhecido';
    }
  }
}  

