import { Quest } from 'src/types';

export const idhmQuestions: Quest[] = [
  {
    remote: true,
    category: 'trash',
    description:
      'Dentre os principais poluentes que causam o desequilíbrio no ar atmosférico temos:',
    expires_at: 'ONE_HOUR',
    name: 'Principais Poluentes',
    steps: [
      {
        type: 'multiple_choice',
        choices: [
          'Monóxido de carbono: Produto resultante da queima incompleta dos combustíveis.',
          'Dióxido de enxofre e óxidos de azoto: produtos da combustão do enxofre presente nos combustíveis fósseis.',
          'Chumbo: Produto usado no álcool para aumentar sua octanagem',
          'Dióxido de carbono: Produto resultante da queima de qualquer matéria orgânica.',
        ],
        answer: [0, 1, 3],
      },
    ],
    rewards: {
      experience: 90,
      indicators: [
        {
          indicator: 'idhm',
          amount: 0.0001,
        },
        {
          indicator: 't_sem_lixo',
          amount: 0.00001,
        },
      ],
    },

    source: 'https://www.todamateria.com.br/poluicao-do-ar/',
  },
];
