import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

export const SUPABASE_CLIENT = 'SUPABASE_CLIENT'; // Token de inyección

export const supabaseProvider = {
  provide: SUPABASE_CLIENT,
  useFactory: (configService: ConfigService): SupabaseClient => {
    const supabaseUrl = configService.get<string>('SUPABASE_URL');
    const supabaseAnonKey = configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration not found in environment.');
    }

    // Inicializa y devuelve el cliente de Supabase
    return createClient(supabaseUrl, supabaseAnonKey);
  },
  inject: [ConfigService],
};
