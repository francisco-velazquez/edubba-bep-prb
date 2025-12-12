import { Module } from '../../domain/module.entity';

export interface IModuleRepositoryPort {
  save(module: Partial<Module>): Promise<Module>;
  findAll(): Promise<Module[]>;
  findById(id: number): Promise<Module | null>;
  delete(id: number): Promise<boolean>;
}
