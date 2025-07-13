import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-gym',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './gym.component.html',
  styleUrl: './gym.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GymComponent {
  readonly gymMaxWeight = new FormControl<number | null>(null);
  private cdr = inject(ChangeDetectorRef);

  sets:
    | {
        weight: number;
        reps: string;
        percent: number;
        name: string;
      }[]
    | null = null;

  constructor() {
    // авто‑отписка при уничтожении компонента
    this.gymMaxWeight.valueChanges
      .pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe((value) => {
        console.log(value);

        this.sets = this.calculate(value ?? 0);

        this.cdr.detectChanges();
      });
  }

  /** Массив сетов или null, если вес невалиден */
  private calculate(maxWeight: number):
    | {
        /** Вес на штанге, кг */
        weight: number;
        /** Повторения, текстом */
        reps: string;
        /** Процент от МП (целое, без ‑%) */
        percent: number;
        /** Название на русском */
        name: string;
      }[]
    | null {
    if (!maxWeight || maxWeight <= 0) return null;
    const steps = [
      { coef: 0.3, reps: '12', name: 'Разминка' },
      { coef: 0.5, reps: '8‑10', name: 'Лёгкий подход' },
      { coef: 0.7, reps: '5‑6', name: 'Средний подход' },
      { coef: 0.85, reps: '2‑3', name: 'Тяжёлый подход' },
      { coef: 0.95, reps: '1‑2', name: 'Предмаксимальный' },
      { coef: 1.0, reps: '1', name: 'Максимум' },
    ];

    return steps.map(({ coef, reps, name }) => {
      const weight = this.round5(maxWeight * coef);
      const percent = Math.round((weight / maxWeight) * 100);
      return { weight, reps, percent, name };
    });
  }

  private round5(x: number): number {
    return Math.round(x / 5) * 5; // 74 → 75, 72 → 70
  }

  /** очистить поле и результаты */
  clearInput(): void {
    this.gymMaxWeight.reset(null); // сбрасываем значение
    this.sets = null; // убираем вывод
  }
}
