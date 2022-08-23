import { Quest } from 'src/types';
import { F, V } from './utils/constants';

export const waterAndSewerQuestions: Quest[] = [
  {
    remote: true,
    description:
      'Segundo um levantamento do Instituto Trata Brasil, em 2020, 99% da população têm água potável e o tratamento de esgoto chega a 89% dos moradores de Brasília, sendo assim a menor do país. No entanto, não consideram as áreas não regularizadas na capital.',
    source:
      'https://g1.globo.com/df/distrito-federal/noticia/2020/11/30/df-tem-maior-indice-de-saneamento-basico-do-pais-mas-especialista-indica-desafios.ghtml',
    name: 'A respeito do tratamento de esgoto no Brasil',
    expires_at: 'ONE_DAY',
    category: 'sewer',
    steps: [
      {
        type: 'one_choice',
        choices: [V, F],
        answer: [0],
      },
    ],
    rewards: {
      indicators: [
        {
          indicator: 't_sem_agua_esgoto',
          amount: 0.00001,
        },
        {
          indicator: 'idhm',
          amount: 0.00001,
        },
      ],
      experience: 100,
    },
  },
];
