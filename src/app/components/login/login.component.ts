import { Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  // Cambiado de None a Emulated para mejor aislamiento de estilos
  encapsulation: ViewEncapsulation.Emulated,
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isTestEnv = false; // bandera para ocultar elementos

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.isTestEnv = navigator.userAgent.includes('Cypress'); // detecta si es Cypress

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

onSubmit(): void {
  if (this.loginForm.invalid) return;

  this.authService.login(this.loginForm.value).subscribe({
    next: () => {
      // Esperamos un poco para asegurarnos que el token fue guardado
      setTimeout(() => {
        const perfil = this.authService.getUsuarioPerfil();

        if (!perfil || !perfil.roles) {
          this.errorMessage = 'No se pudo obtener el perfil del usuario';
          return;
        }

        const roles = perfil.roles;

        // Redirigir según el rol
        if (roles.includes('ROLE_CLIENTE')) {
          this.router.navigate(['/contratos']);
        } else if (roles.includes('ROLE_ADMIN') || roles.includes('ROLE_AGENTE')) {
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = 'Rol desconocido o no autorizado';
        }
      }, 0); // Ejecuta en el siguiente ciclo del event loop
    },
    error: () => {
      this.errorMessage = 'Credenciales incorrectas';
    },
  });
}


  get f() {
    return this.loginForm.controls;
  }
}
