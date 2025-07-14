import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { WeightCardComponent } from '../weightCard/weightCard.component';

export interface Set {
  weight: number;
  reps: string;
  percent: number;
  name: string;
  description: string;
  color: string;
}
@Component({
  selector: 'app-gym',
  imports: [ReactiveFormsModule, WeightCardComponent],
  templateUrl: './gym.component.html',
  styleUrl: './gym.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GymComponent implements OnInit {
  readonly gymMaxWeight = new FormControl<number | null>(null);
  private cdr = inject(ChangeDetectorRef);

  sets: WritableSignal<Set[] | null> = signal<Set[] | null>(null);

  constructor() {
    // авто‑отписка при уничтожении компонента
    this.gymMaxWeight.valueChanges
      .pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe((value) => {
        if (value && value >= 10) {
          this.sets.set(this.calculate(value ?? 0));
        } else {
          this.sets.set(this.calculate(0));
        }
        this.cdr.detectChanges();
      });
  }
  ngOnInit(): void {
    // this.gymMaxWeight.setValue(150);
    // this.sets.set(this.calculate(150));
  }

  /** Массив сетов или null, если вес невалиден */
  private calculate(maxWeight: number): Set[] | null {
    if (!maxWeight || maxWeight <= 0) return null;
    const steps = [
      {
        coef: 0.3,
        reps: '12',
        name: 'Разминка',
        description: 'Разогрев мышц, подготовка к нагрузке.',
        color: '#f2d046',
      },
      {
        coef: 0.5,
        reps: '8‑10',
        name: 'Лёгкий подход',
        description: 'Включение мышц, контроль техники.',
        color: '#f2e446',
      },
      {
        coef: 0.7,
        reps: '5‑6',
        name: 'Средний подход',
        description: 'Плавный переход к тяжёлым весам.',
        color: '#e7f246',
      },
      {
        coef: 0.85,
        reps: '2‑3',
        name: 'Тяжёлый подход',
        description: 'Рабочий вес, активация силы.',
        color: '#d8f246',
      },
      {
        coef: 0.95,
        reps: '1‑2',
        name: 'Предмаксимальный',
        description: 'Настройка на максимум, контроль.',
        color: '#caf246',
      },
      {
        coef: 1.0,
        reps: '1',
        name: 'Максимум',
        description: 'Пиковая нагрузка, проверка силы.',
        color: '#bbf246',
      },
    ];

    return steps.map(({ coef, reps, name, description, color }) => {
      const weight = this.round5(maxWeight * coef);
      const percent = Math.round((weight / maxWeight) * 100);
      return { weight, reps, percent, name, description, color };
    });
  }

  private round5(x: number): number {
    return Math.round(x / 5) * 5; // 74 → 75, 72 → 70
  }

  /** очистить поле и результаты */
  clearInput(): void {
    this.gymMaxWeight.reset(null); // сбрасываем значение
    this.sets.set(null);
  }

  addSet(newSet: Set): void {
    this.sets.update((prev) => [...(prev ?? []), newSet]);
  }
}
