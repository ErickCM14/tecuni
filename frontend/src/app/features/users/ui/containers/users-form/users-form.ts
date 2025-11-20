import { Component, OnInit, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../../domain/users.model';
import { UsersFacade } from '../../../application/users.facade';
import { NotificationAlert } from '../../../../../shared/services/notification-alert';
// import { MEXICO_STATES, MexicoState } from '../../../../../shared/constants/mexico-states';

@Component({
  selector: 'app-users-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users-form.html',
  styleUrl: './users-form.css',
})
export class UsersForm implements OnInit {
  private fb = inject(FormBuilder);
  private facade = inject(UsersFacade);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notification = inject(NotificationAlert);

  form!: FormGroup;
  loading = false;
  editMode = false;
  userId!: string;

  // mexicoStates = MEXICO_STATES;

  ngOnInit(): void {
    this.form = this.fb.group({
      // username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20), Validators.pattern('^[a-zA-Z0-9]+$')]],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]+$')]],
      // dob: ['', Validators.required],
      // country: ['', Validators.required],
      // state: new FormControl<MexicoState | ''>('', Validators.required),
      // active: [true],
      password: ['', [Validators.minLength(8)]],
    });

    this.userId = this.route.snapshot.paramMap.get('id')!;
    this.editMode = !!this.userId;

    if (this.editMode) {
      this.loadUserData();
      this.form.get('password')?.setValidators([Validators.minLength(8)]);
    } else {
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    }
    this.form.get('password')?.updateValueAndValidity();
  }

  invalid(control: string): boolean {
    const c = this.form.get(control);
    return !!(c && c.invalid && c.touched);
  }

  private loadUserData(): void {
    this.loading = true;
    this.facade.loadById(this.userId).subscribe({
      next: (user: User) => {
        this.form.patchValue({
          // username: user.username,
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          phone: user.phone,
          // dob: user.dob,
          // country: user.country,
          // state: user.state,
          password: '',
        });
      },
      error: (err) => {
        console.error(err);
        this.notification.error('No se pudo cargar la información');
      },
      complete: () => (this.loading = false),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = { ...this.form.value };
    this.loading = true;

    if (this.editMode && !payload.password) {
      delete payload.password;
    }

    const action$ = this.editMode
      ? this.facade.update(this.userId, payload)
      : this.facade.store(payload);

    action$.subscribe({
      next: () => {
        // alert(this.editMode ? '✅ Usuario actualizado.' : '✅ Usuario registrado.');
        this.editMode ? this.notification.success('Usuario actualizado.') : this.notification.success('Usuario registrado.');
        this.router.navigate(['/users']);
      },
      error: (err) => {
        console.error(err);
        // alert(`❌ Error: ${err.error?.message || 'Error desconocido'}`);
        this.notification.error(`Error: ${err.error?.message || 'Error desconocido'}`);
        this.loading = false;
      },
      complete: () => (this.loading = false)
    });
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }
}