import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
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

  @Cron(CronExpression.EVERY_DAY_AT_11AM)
  async handleCron() {
    const quests = await this.generateRandomQuests();

    this.logger.debug({ quests });

    const { error } = await this.supabase
      .getClient()
      .from('quests')
      .insert(quests, {
        returning: 'representation',
      });

    if (error) {
      this.logger.error(`fail to insert with cause: ${error.message}`);
    } else {
      this.logger.debug(`quests database updated`);
    }
  }

  private async getGeojson() {
    const { signedURL } = await this.supabase
      .getClient()
      .storage.from('assets')
      .createSignedUrl('geojson/polygon-subdistrict-2017.geojson', 60);

    return firstValueFrom(
      this.httpService.get<Geojson>(signedURL).pipe(map(({ data }) => data)),
    );
  }

  private async generateRandomQuests() {
    const geojson = await this.getGeojson();

    const today = new Date();

    const randomQuestGenerator = uniqueRandomArray(questions);

    return geojson.features
      .map((feature) =>
        (randomPointsInPolygons(1, feature) as Point[]).map((point) => {
          const quest = randomQuestGenerator();
          return {
            id: uuidv4(),
            ...quest,
            expires_at:
              quest.expires_at === 'ONE_DAY'
                ? addDays(today, 1)
                : quest.expires_at === 'ONE_HOUR'
                ? addHours(today, 1)
                : null,
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
}
