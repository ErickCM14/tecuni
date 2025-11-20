import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsFacade } from '../../../application/notifications.facade';
import { Notifications } from '../../../domain/notifications.model';
import { Auth } from '../../../../../core/auth/auth';
import { NotificationAlert } from '../../../../../shared/services/notification-alert';
import { UsersFacade } from '../../../../users/application/users.facade';
import { map } from 'rxjs';

@Component({
  selector: 'app-notifications-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './notifications-form.html',
  styleUrls: ['./notifications-form.css']
})
export class NotificationsForm implements OnInit {
  private fb = inject(FormBuilder);
  private facade = inject(NotificationsFacade);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private auth = inject(Auth);
  private notificationAlert = inject(NotificationAlert);
  private usersFacade = inject(UsersFacade);

  users$ = this.usersFacade
    .loadAll(1, 10000, 0, 'createdAt', 'desc')
    .pipe(map(res => res.items));

  allUsers: { id: string; username: string; email?: string, deviceId?: string }[] = [];

  form!: FormGroup;
  userSelect = new FormControl('');
  loading = false;
  editMode = false;
  id!: string;

  ngOnInit() {

    this.users$.subscribe(users => {
      // Filtramos solo los que tengan id y username
      this.allUsers = users
        .filter(u => u.id && u.username)
        .map(u => ({
          id: u.id!,
          username: u.username!,
          email: u.email,
          deviceId: u.deviceId,
        }));
    });

    this.form = this.fb.group({
      code: ['msg' + Math.floor(Math.random() * 10000)],
      title: ['', Validators.required],
      body: ['', Validators.required],
      status: ['pending'],
      createdUser: [this.auth.user()?.username || 'system'],
      data: this.fb.group({
        id: ['1234567'],
        notificationType: ['', Validators.required],
        extra_info: [''],
      }),
      destinatary: this.fb.array([]),
    });

    this.id = this.route.snapshot.paramMap.get('id')!;
    this.editMode = !!this.id;

    if (this.editMode) {
      this.loading = true;
      this.facade.loadById(this.id).subscribe({
        next: (notif) => {
          this.form.patchValue(notif);
          // Vaciar FormArray
          const destinataryFA = this.form.get('destinatary') as FormArray;
          destinataryFA.clear();

          // Agregar destinatarios con username y device ID
          notif.destinatary?.forEach((d: any) => {
            const user = d; // asumimos que notif.destinatary incluye user { username }      
            console.log(d);

            destinataryFA.push(
              this.fb.group({
                idUser: [user?.idUser || ''],
                // username: [user?.username || ''],
                idDevice: [d.idDevice || '', Validators.required],
                statusRead: [d.statusRead || 'unread'],
              })
            );
          });
        },
        error: (err) => {
          console.error(err);
          this.notificationAlert.error('No se pudo cargar la información');
        },
        complete: () => (this.loading = false),
      });
    }

  }

  get destinatary() {
    return this.form.get('destinatary') as FormArray;
  }

  // addSelectedUser() {
  //   const selectedId = this.userSelect.value;
  //   if (!selectedId) return;

  //   const exists = this.destinatary.value.some((d: any) => d.idUser === selectedId);
  //   if (exists) {
  //     this.notificationAlert.warning('Este usuario ya está en la lista');
  //     return;
  //   }

  //   this.destinatary.push(
  //     this.fb.group({
  //       idUser: [selectedId, Validators.required],
  //       idDevice: [],
  //       statusRead: ['unread'],
  //     })
  //   );
  //   this.userSelect.setValue('');
  // }

  addDestinatary() {
    this.destinatary.push(
      this.fb.group({
        idUser: ['', Validators.required],
        idDevice: ['', Validators.required],
        statusRead: ['unread'],
      })
    );
  }

  removeDestinatary(index: number) {
    this.destinatary.removeAt(index);
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    const data: Notifications = this.form.value;

    const action$ = this.editMode
      ? this.facade.update(this.id, data)
      : this.facade.store(data);

    action$.subscribe({
      next: () => {
        this.notificationAlert.success(`Notificación guardada correctamente`);
        this.router.navigate(['/notifications']);
      },
      error: (err) => {
        this.notificationAlert.error(`Error: ${err.error?.message || 'Error desconocido'}`);
        this.loading = false;
      },
      complete: () => (this.loading = false)
    });
  }

  // Asumiendo que allUsers ya contiene la lista de usuarios con id, username y deviceId
  addSelectedUser() {
    const selectedId = this.userSelect.value;
    if (!selectedId) return;
    console.log(selectedId);


    // Obtener usuario completo del array ya cargado
    const user = this.allUsers.find(u => u.id === selectedId);
    if (!user) return;

    console.log(user);

    // Evitar duplicados por idUser
    const exists = this.destinatary.value.some((d: any) => d.idUser === user.id);
    if (exists) {
      this.notificationAlert.warning('Este usuario ya está en la lista');
      return;
    }

    if (user.deviceId) {
      const existsDevice = this.destinatary.value.some((d: any) => d.idDevice === user.deviceId);
      if (existsDevice) {
        this.notificationAlert.warning('Ya hay un usuario con este Device ID');
        return;
      }
    } else {
      this.notificationAlert.warning('El usuario no cuenta con Device ID');
      return;
    }

    // Agregar al FormArray usando los datos que vienen del backend
    this.destinatary.push(
      this.fb.group({
        idUser: [user.id, Validators.required],
        idDevice: [user.deviceId || '', Validators.required], // deviceId que venga del backend
        statusRead: ['unread'],
      })
    );

    this.userSelect.setValue('');
  }



  // addSelectedUser() {
  //   const selectedId = this.userSelect.value;
  //   console.log(this.destinatary.value);

  //   if (!selectedId) return;

  //   // Evitar duplicados
  //   const exists = this.destinatary.value.some((d: any) => d.username === this.getUsername(selectedId));
  //   if (exists) {
  //     this.notificationAlert.warning('Este usuario ya está en la lista');
  //     return;
  //   }
  //   console.log(exists);


  //   // Agregar al FormArray
  //   const user: any = this.getUserById(selectedId);
  //   this.destinatary.push(
  //     this.fb.group({
  //       idUser: [selectedId, Validators.required],
  //       idDevice: ['dev-' + Math.floor(Math.random() * 1000)],
  //       statusRead: ['unread'],
  //     })
  //   );
  //   // this.destinatary.push(
  //   //   this.fb.group({
  //   //     username: [user.username],
  //   //     idDevice: [''], // vacío para que el usuario ingrese el Device ID
  //   //   })
  //   // );

  //   this.userSelect.setValue('');
  // }

  // Funciones de ayuda
  getUserById(id: string) {
    let u;
    this.users$.subscribe(users => {
      u = users.find(user => user.id === id);
    }).unsubscribe();
    return u;
  }

  getUsername(id: string): string {
    const user = this.allUsers.find(u => u.id === id);
    return user?.username || '';
  }


  // getUsername(id: string) {
  //   let username = '';
  //   this.users$.subscribe(users => {
  //     const user = users.find(u => u.id === id);
  //     if (user) username = user.username;
  //   }).unsubscribe();
  //   return username;
  // }

  getEmail(id: string) {
    let email = '';
    this.users$.subscribe(users => {
      const user = users.find(u => u.id === id);
      if (user) email = user.email;
    }).unsubscribe();
    return email;
  }


  cancel(): void {
    this.router.navigate(['/notifications']);
  }
}

