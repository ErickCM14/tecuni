import { Component, inject, signal } from '@angular/core'; import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../../../core/auth/auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {
  private auth = inject(Auth);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email, Validators.minLength(4), Validators.maxLength(64), Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]],
  });

  constructor() { }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.form.value;

    this.auth.login(email!, password!).subscribe({
      next: (res) => {
        console.log(res);

        this.router.navigate(['/'])
      },
      error: err => {
        this.loading.set(false);
        this.errorMessage.set(err?.message || 'Error en login');
      },
    });
  }
}
