import { Component } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {RouterModule } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    RouterModule,
    MatButtonModule,
    MatButtonModule,
    MatIconModule, 
    MatSidenavModule,
    MatListModule,

  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}