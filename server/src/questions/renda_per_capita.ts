import { Quest } from 'src/types';

export const rendaPerCapitaQuestions: Quest[] = [
  {
    remote: true,
    description:
      'Renda per capita é um indicador muito utilizado para mensurar a situação econômica de um país.',
    source:
      'https://brasilescola.uol.com.br/geografia/renda-per-capita.htm',
    name: 'Sobre renda per capita e suas limitações',
    category: 'education',
    steps: [
      {
        type: 'one_choice',
        choices: [
          'Diferença entre a quantidade de nascimentos e óbitos em um país',
          'Soma de todos os rendimentos de um país durante o ano',
          'Divisão da renda nacional (ou PNB) pelo número de habitantes de um determinado país',
          'Soma de todas as riquezas de um país em determinado ano',
          'Divisão entre o número de habitantes e a extensão territorial de um determinado país',
        ],
        answer: [2],
      },
      {
        type: 'one_choice',
        choices: [
          'Para determinar a realidade socioeconômica de um determinado país, a renda per capta dever ser utilizada associada a outros índices econômicos e sociais',
          'Todos os países desenvolvidos possuem uma renda per capita elevada.',
        ],
        answer: [0],
      },
    ],
    rewards: {
      indicators: [
        {
          indicator: 'renda_per_capita',
          amount: 10,
        },
        {
          indicator: 'prosp_soc',
          amount: 0.00001,
        },
        {
            indicator: 't_vulner',
            amount: 0.0001,
          },
      ],
      experience: 185,
    },
  },
];
