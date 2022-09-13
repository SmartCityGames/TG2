import { Quest } from 'src/types';

export const idhmQuestions: Quest[] = [
  {
    remote: true,
    category: 'trash',
    description:
      'Dentre os principais poluentes que causam o desequilíbrio no ar atmosférico temos:',
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
  {
    remote: true,
    category: 'education',
    description:
      'A pirâmide de formato triangular da década de 1970 foi dando lugar a uma pirâmide mais retangular de base mais estreita e topo mais largo. Em 1991, a população de 0 a 14 anos correspondia a 34,7% da população brasileira, tendo passado para 24,1% em 2010. A população em idade ativa, entre 15 e 59 anos, por sua vez, passou de 58,0% a 65,1% no mesmo período. As alterações no perfil demográfico brasileiro, descritas no texto, trouxeram como consequência socioeconômica o(a):',
    name: 'A respeito da pirâmide geogeográfica do Brasil',
    steps: [
      {
        type: 'one_choice',
        choices: [
          'aumento da mortalidade infantil',
          'crescimento das desigualdades regionais',
          'redução dos gastos na educação superior',
          'restrição no atendimento público hospitalar',
          'expansão na demanda por ocupações laborais',
        ],
        answer: [4],
      },
    ],
    rewards: {
      experience: 178,
      indicators: [
        {
          indicator: 'idhm',
          amount: 0.001,
        },
        {
          indicator: 'prosp_soc',
          amount: 0.00001,
        },
        {
          indicator: 'espvida',
          amount: 0.0001,
        },
      ],
    },
    source: 'https://www.qconcursos.com/questoes-do-enem/questoes/67e9dcb4-7c',
  },
];
