import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { LoginRequest } from '../../entities/request/login-request';
import { LoginResponse } from '../../entities/response/login-response';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],  // <== IMPORTA AQUI
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  errorMessage = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder, 
    private loginService: LoginService,
    private router: Router
  ) {}

  submit() {
    if (this.form.invalid) return;

    const loginData: LoginRequest = {
      email: this.form.value.email || '',
      senha: this.form.value.senha || ''
    };

    this.loginService.login(loginData).subscribe({
      next: (res) => {
        alert(res.mensagem + '\nSeja muito bem-vindo, ' + res.usuario.nome);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMessage = err.error?.mensagem || 'Houve um erro desconhecido';
      }
    });
  }
}
