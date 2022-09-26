import { Module } from '@nestjs/common';
import { Supabase } from './supabase';

@Module({
  providers: [Supabase],
  exports: [Supabase],
})
export class SupabaseModule {}
