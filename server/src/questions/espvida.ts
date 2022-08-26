import { Quest } from 'src/types';

export const espvidaQuestions: Quest[] = [
  {
    remote: true,
    category: 'education',
    description:
      'A expectativa de vida, também chamada de esperança de vida, é um dado matemático responsável por calcular o tempo de vida médio restante a partir do nascimento.',
    expires_at: 'ONE_HOUR',
    name: 'Sobre expectativa de vida',
    source: 'https://www.preparaenem.com/geografia/expectativa-vida.htm',
    steps: [
      {
        type: 'one_choice',
        choices: [
          'É uma previsão elaborada a partir das condições de vida da população, incluindo saúde, educação, violência, infraestruturas, índices e tipos de mortes mais frequentes, hábitos sociais e alimentares',
          'É uma média estatística elaborada a partir das condições de vida da população, incluindo saúde, educação, violência, infraestruturas, índices e tipos de mortes mais frequentes, hábitos sociais e alimentares.',
        ],
        answer: [1],
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
  },
  {
    remote: true,
    category: 'education',
    description:
      'Quase 35 milhões de pessoas no Brasil vivem sem água tratada e cerca de 100 milhões não têm acesso à coleta de esgoto, resultando em doenças que poderiam ser evitadas. Dentre estas doenças podemos citar:',
    source:
      'https://www.teraambiental.com.br/blog-da-tera-ambiental/conheca-as-doencas-causadas-pelo-nao-tratamento-do-esgoto',
    expires_at: 'ONE_HOUR',
    name: 'Sobre a falta de tratamento de esgoto',
    steps: [
      {
        type: 'multiple_choice',
        choices: ['Cólera', 'Gripe', 'Leptospirose', 'Dengue', 'Raiva'],
        answer: [0, 2, 3],
      },
    ],
    rewards: {
      experience: 35,
      indicators: [
        {
          indicator: 'idhm',
          amount: 0.0001,
        },
        {
          indicator: 't_sem_agua_esgoto',
          amount: 0.0001,
        },
        {
          indicator: 'espvida',
          amount: 0.1,
        },
        {
          indicator: 'ivs',
          amount: 0.001,
        },
      ],
    },
  },
];
