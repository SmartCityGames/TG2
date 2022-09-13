import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { addDays, addHours } from 'date-fns';
import * as randomPointsInPolygons from 'random-points-on-polygon';
import { firstValueFrom, map } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { questions } from './questions/bank';
import { Supabase } from './supabase';
import { Geojson, Point } from './types';
import { uniqueRandomArray } from './utils/unique-random-array';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly supabase: Supabase,
    private readonly httpService: HttpService,
  ) {}

  async saveQuests() {
    const quests = await this.generateRandomQuests();

    const client = await this.supabase.getClient();

    const { error } = await client.from('quests').insert(quests, {
      returning: 'minimal',
    });

    if (error) {
      this.logger.error(`fail to insert with cause: ${error.message}`);
    } else {
      this.logger.debug({ quests });
      this.logger.debug(`quests database updated`);
    }
  }

  private async getGeojson() {
    const client = await this.supabase.getClient();

    const { signedURL } = await client.storage
      .from('assets')
      .createSignedUrl('geojson/polygon-subdistrict-2017.geojson', 60);

    return firstValueFrom(
      this.httpService.get<Geojson>(signedURL).pipe(map(({ data }) => data)),
    );
  }

  private async generateRandomQuests() {
    const geojson = await this.getGeojson();

    const randomQuestGenerator = uniqueRandomArray(questions);

    return geojson.features
      .map((feature) =>
        (randomPointsInPolygons(1, feature) as Point[]).map((point) => {
          const quest = randomQuestGenerator();
          return {
            id: uuidv4(),
            ...quest,
            expires_at: this.generateExpirationDate(),
            shape: {
              shapeType: 'Circle',
              id: `circle-${point.geometry.coordinates}`,
              center: {
                lat: point.geometry.coordinates[1],
                lng: point.geometry.coordinates[0],
              },
              radius: 75,
            },
          };
        }),
      )
      .flat();
  }

  private generateExpirationDate() {
    const today = new Date();

    const randomExpirationGenerator = uniqueRandomArray([
      'ONE_DAY',
      'HALF_DAY',
      'ONE_HOUR',
      'THREE_HOURS',
    ]);

    const expiration = randomExpirationGenerator();

    if (expiration === 'ONE_DAY') return addDays(today, 1);
    if (expiration === 'HALF_DAY') return addHours(today, 12);
    if (expiration === 'ONE_HOUR') return addHours(today, 1);
    if (expiration === 'THREE_HOURS') return addHours(today, 3);

    return null;
  }
}
