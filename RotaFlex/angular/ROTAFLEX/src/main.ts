import { bootstrapApplication } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Importação do HttpClientModule
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Removendo HttpClientModule dos provedores
bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers, // Mantendo os provedores já definidos
  ],
})
  .catch((err) => console.error(err));