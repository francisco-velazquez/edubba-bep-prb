import { Module } from '../../modules/domain/module.entity';

export interface Chapter {
  id: number;
  title: string;
  description?: string;
  videoUrl?: string;
  contentUrl?: string;
  orderIndex: number;
  isPublished: boolean;

  // Relación N:1 con Módulo
  moduleId: number;
  module?: Module;

  // Relación 1:1 con Examen
  exam?: any;

  createdAt: Date;
  updatedAt: Date;
}

export const I_CHAPTER_REPOSITORY = Symbol('IChapterRepository');
