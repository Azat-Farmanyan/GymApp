import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-instruction',
  imports: [RouterLink],
  templateUrl: './instruction.component.html',
  styleUrl: './instruction.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstructionComponent {}
