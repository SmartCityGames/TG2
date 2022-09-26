import { Quest } from 'src/types';

export const tVulnerQuestions: Quest[] = [
  {
    description:
      'A fome não é um problema técnico, pois ela não se deve à falta de alimentos, isso porque a fome convive hoje com as condições materiais para resolvê-la. Assim, o problema alimentar tem uma dimensão política por estar associado ao(à)',
    category: 'education',
    source: "https://descomplica.com.br/gabarito-enem/questoes/2019/primeiro-dia/o-texto-demonstra-que-o-problema-alimentar-apresentado-tem-uma-dimensao-politica-por-estar-associado/",
    name: 'A respeito da fome e suas causas',
    remote: true,
    rewards: {
      experience: 150,
      indicators: [
        {
          indicator: 't_vulner',
          amount: 0.0002,
        },
        {
          indicator: 'renda_per_capita',
          amount: 0.00002,
        },
      ],
    },
    steps: [
      {
        choices: [
          'Escala de produtividade regional.',
          'Padrão de distribuição de renda.',
          'Dificuldade de armazenamento de grãos.',
          'Crescimento da população mundial.',
          'Custo de escoamento dos produtos.',
        ],
        answer: [1],
        type: 'one_choice',
      },
    ],
  },
];
