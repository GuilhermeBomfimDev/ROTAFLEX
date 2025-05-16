import { Component } from '@angular/core';
import { TransporteComponent } from "../transporte/transporte.component";
import { HttpClientModule } from '@angular/common/http';
import { ViagemComponent } from "../viagem/viagem.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TransporteComponent,
    HttpClientModule,
    ViagemComponent,
],

  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
