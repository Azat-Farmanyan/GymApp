import { Set } from './../gym/gym.component';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-weight-card',
  imports: [],
  templateUrl: './weightCard.component.html',
  styleUrl: './weightCard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeightCardComponent {
  @Input() public set!: Set;
  @Input() public setID!: number;
}
