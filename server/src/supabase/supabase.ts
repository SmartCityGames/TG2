import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class Supabase {
  private readonly logger = new Logger(Supabase.name);
  private clientInstance: SupabaseClient;

  constructor(private readonly configService: ConfigService) {}

  async getClient() {
    this.logger.log('getting supabase client...');

    if (this.clientInstance) {
      return this.clientInstance;
    }

    this.logger.log('initialising new supabase client');

    this.clientInstance = createClient(
      this.configService.get('SUPABASE_URL'),
      this.configService.get('SUPABASE_ANON_KEY'),
      {
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    );

    await this.clientInstance.auth.signIn({
      email: this.configService.get('SUPABASE_ADMIN_EMAIL'),
      password: this.configService.get('SUPABASE_ADMIN_PASSWORD'),
    });

    return this.clientInstance;
  }
}
