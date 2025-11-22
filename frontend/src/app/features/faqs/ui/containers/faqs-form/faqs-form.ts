import { Component, OnInit, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { NotificationAlert } from '../../../../../shared/services/notification-alert';
import { FaqsFacade } from '../../../application/faqs.facade';

@Component({
  selector: 'app-faqs-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './faqs-form.html',
  styleUrl: './faqs-form.css'
})
export class FaqsForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private facade = inject(FaqsFacade);
  private notification = inject(NotificationAlert);

  form!: FormGroup;
  faqId?: string;
  loading = false;

  ngOnInit() {
    this.buildForm();

    // Detectar si hay ID (modo edición)
    this.route.paramMap.subscribe(params => {
      this.faqId = params.get('id') || undefined;
      if (this.faqId) {
        this.loadFaq(this.faqId);
      }
    });
  }

  private buildForm() {
    this.form = this.fb.group({
      code: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9]+$/)
        ]
      ],
      color: [
        '#000000',
        [
          Validators.minLength(7),
          Validators.maxLength(9),
          Validators.pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/) // formato color hex
        ]
      ],
      icon: ['https://backend-23.nubeseo.es/wp-content/uploads/2024/12/faqs-que-es.jpg'],
      // categoryId: ['6906fe75bf8ccd8e11321177', Validators.required],
      translations: this.fb.group({
        es: this.fb.group({
          name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
          description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]]
        })
      }),
      questions: this.fb.array([], Validators.minLength(1))
    });
  }

  get questions(): FormArray {
    return this.form.get('questions') as FormArray;
  }

  addQuestion() {
    const q = this.fb.group({
      // key: [this.questions.length + 1],
      translations: this.fb.group({
        es: this.fb.group({
          label: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
        }),
      }),
      questionType: [
        'multiple_choice',
        [Validators.required, Validators.pattern(/^(multiple_choice|multiple_selection|open_ended_question)$/)]
      ],
      responses: this.fb.array([], Validators.minLength(1))
    });
    this.questions.push(q);
  }

  addResponse(qIndex: number) {
    const responses = this.questions.at(qIndex).get('responses') as FormArray;
    const r = this.fb.group({
      value: [(responses.length + 1).toString(), [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      order: [(responses.length + 1).toString(), [Validators.required, Validators.min(1)]],
      translations: this.fb.group({
        es: this.fb.group({
          label: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
        }),
      }),
    });
    responses.push(r);
  }

  getResponses(i: number): FormArray {
    return this.questions.at(i).get('responses') as FormArray;
  }

  private loadFaq(id: string) {
    this.loading = true;
    this.facade.loadById(id).subscribe({
      next: (data) => {
        console.log(data);
        
        this.form.patchValue({
          code: data.code,
          color: data.color,
          icon: data.icon,
          // categoryId: '6906fe75bf8ccd8e11321177',
          translations: {
            es: {
              name: data.translations?.es?.name || '',
              description: data.translations?.es?.description || ''
            }
          }
        });

        this.questions.clear();
        (data.questions || []).forEach((q: any) => {
          const qGroup = this.fb.group({
            translations: this.fb.group({
              es: this.fb.group({
                label: [q.translations?.es?.label || '', Validators.required],
              }),
            }),
            questionType: [q.questionType.code || 'multiple_choice', Validators.required],
            responses: this.fb.array([])
          });

          const responses = qGroup.get('responses') as FormArray;
          (q.responses || []).forEach((r: any) => {
            responses.push(
              this.fb.group({
                translations: this.fb.group({
                  es: this.fb.group({
                    label: [r.translations?.es?.label || '', Validators.required],
                  }),
                }),
                order: [r.order],
                value: [r.value],
              })
            );
          });

          this.questions.push(qGroup);

          console.log('Form validity:', this.form.valid);
          console.log('Form errors:', this.form.errors);
          console.log('Invalid controls:', this.getInvalidControls(this.form));
        });
      },
      error: () => this.notification.error('Error al cargar el cuestionario'),
      complete: () => (this.loading = false),
    });

    // console.log('Form validity:', this.form.valid);
    // console.log('Form errors:', this.form.errors);
    // console.log('Invalid controls:', this.getInvalidControls(this.form));
  }

  getInvalidControls(form: FormGroup | FormArray, path: string = ''): string[] {
    const invalid: string[] = [];
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key)!;
      const newPath = path ? `${path}.${key}` : key;
      if (control.invalid) {
        invalid.push(newPath);
      }
      if (control instanceof FormGroup || control instanceof FormArray) {
        invalid.push(...this.getInvalidControls(control, newPath));
      }
    });
    return invalid;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request$ = this.faqId
      ? this.facade.update(this.faqId, this.form.value)
      : this.facade.store(this.form.value);

    request$.subscribe({
      next: () => {
        this.notification.success(`Cuestionario ${this.faqId ? 'actualizado' : 'guardado'} correctamente`);
        this.router.navigate(['/faqs']);
      },
      error: (err) => this.notification.error(`Error: ${err.error?.message || 'Error desconocido'}`),
    });
  }

  removeResponse(qIndex: number, rIndex: number) {
    const responses = this.questions.at(qIndex).get('responses') as FormArray;
    responses.removeAt(rIndex);
  }

  removeQuestion(qIndex: number) {
    this.questions.removeAt(qIndex);
  }

}

