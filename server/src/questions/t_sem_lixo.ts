import { Quest } from 'src/types';

export const tSemLixoQuestions: Quest[] = [
  {
    category: 'trash',
    description:
      'Quando pensamos nos tipos de materiais descartados, a coleta seletiva é a melhor alternativa. Para tanto, os contentores são divididos por cores, os quais indicam o tipo de lixo a ser depositado. Quais cores dos contentores estão corretas?',
    name: 'A respeito da coleta seletiva',
    steps: [
      {
        type: 'multiple_choice',
        choices: [
          'Azul: aos papéis e papelões;',
          'Verde: aos vidros;',
          'Vermelho: para os plásticos;',
          'Marrom: para os resíduos orgânicos;',
        ],
        answer: [0, 1, 2, 3],
      },
    ],
    remote: true,
    rewards: {
      experience: 70,
      indicators: [
        {
          indicator: 't_sem_lixo',
          amount: 0.0000001,
        },
      ],
    },
    source: "https://www.todamateria.com.br/tipos-de-lixo/"
  },
];
