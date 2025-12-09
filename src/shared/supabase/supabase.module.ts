import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SUPABASE_CLIENT, supabaseProvider } from './supabase.provider';

@Module({
  imports: [ConfigModule],
  providers: [supabaseProvider],
  exports: [SUPABASE_CLIENT], // Exporta el token para que otros módulos lo usen
})
export class SupabaseModule {}