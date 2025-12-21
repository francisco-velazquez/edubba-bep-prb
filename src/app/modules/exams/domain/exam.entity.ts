import { Module } from '../../modules/domain/module.entity';

export interface Exam {
  id: number;
  title: string;

  moduleId: number;
  module?: Module;

  // questions?: Question[]; // Para el futuro módulo de Questions
}
export const I_EXAM_REPOSITORY = Symbol('I_EXAM_REPOSITORY');
