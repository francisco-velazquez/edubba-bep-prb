import { Option } from '../../domain/option.entity';

export class OptionResponseDto {
  id: number;
  optionText: string;
  isCorrect: boolean;

  constructor(orm: Option) {
    this.id = orm.id!;
    this.optionText = orm.optionText;
    this.isCorrect = orm.isCorrect;
  }
}
