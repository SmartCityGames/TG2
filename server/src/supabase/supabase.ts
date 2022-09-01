import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class Supabase {
  private readonly logger = new Logger(Supabase.name);
  private clientInstance: SupabaseClient;

  constructor(private readonly configService: ConfigService) {}

  getClient() {
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

    return this.clientInstance;
  }

  async auth() {
    if (!this.clientInstance) {
      this.getClient();
    }

    this.logger.log('authenticating ...');

    this.clientInstance.auth.signIn({
      email: this.configService.get('SUPABASE_ADMIN_EMAIL'),
      password: this.configService.get('SUPABASE_ADMIN_PASSWORD'),
    });

    return this.clientInstance;
  }
}
