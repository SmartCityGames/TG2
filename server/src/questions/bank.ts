import { Quest } from "../types";

export const questions: Quest[] = [
  {
    remote: true,
    description: 'inserted by a cron',
    name: `complete me`,
    expires_at: 'NEVER',
    category: ['trash', 'fire', 'water', 'sewer', 'electricity'][
      Math.floor(Math.random() * 13) % 5
    ],
    steps: [
      {
        type: 'one_choice',
        choices: [
          'A melhor forma de se livrar de um problema é enfrentá-lo',
          'Eu não tenho medo de nada',
        ],
        answer: [0],
      },
      {
        type: 'multiple_choice',
        choices: [
          'A melhor forma de se livrar de um problema é enfrentá-lo',
          'O medo é o pior inimigo do homem',
          'A vida é uma caixinha de surpresas',
        ],
        answer: [1, 2],
      },
    ],
    rewards: {
      indicators: [
        {
          indicator: 'ivs',
          amount: 0.00001,
        },
      ],
      experience: 100,
    },
  },
];
