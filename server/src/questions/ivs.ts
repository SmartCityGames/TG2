import { Quest } from 'src/types';

export const ivsQuestions: Quest[] = [
  {
    remote: true,
    description:
      'Há várias maneiras de definir os conceitos de risco e de vulnerabilidade social, devido às diversas áreas de conhecimento que fazem uso deles, porém, a abordagem dá-se através de perspectivas diferenciadas. Constata-se, primeiramente, que há uma discussão em torno da gênese do conceito de risco e seu uso (FRANÇA et al., 2002; YUNES; SZYMANSKI, 2001), que se apresenta em várias disciplinas do campo das Ciências Naturais e Exatas (por exemplo, Biologia e Ecologia) e, em particular, das Ciências da Saúde (Medicina, Epidemiologia) e das Ciências Sociais e Humanas (Economia, Sociologia, Política, Psicologia). Por outro lado, tem havido uma confusão no uso dos conceitos de risco e vulnerabilidade havendo a necessidade de esclarecimento conceitual. A Política Nacional de Assistência Social (BRASIL, 2004) também se utiliza desses conceitos os quais são assim compreendidos',
    source:
      'https://www.estudegratis.com.br/provas/ieses-2016-bahiagas-analista-de-processos-organizacionais-servico-social',
    name: 'Sobre os conceitos de risco e vulnerabilidade social',
    expires_at: 'NEVER',
    category: 'education',
    steps: [
      {
        type: 'one_choice',
        choices: [
          'Os conceitos de vulnerabilidade e risco social devem ser problematizados, uma vez que não são adjetivos da condição do usuário. A produção da desigualdade é inerente ao sistema capitalista, ao (re)produzi-la produz e reproduz vulnerabilidades e riscos sociais.',
          'Os riscos estão associados com situações próprias do ciclo de vida das pessoas, com as condições das famílias, da comunidade e do ambiente em que as pessoas vivem e a vulnerabilidade é a baixa capacidade material das famílias e pessoas para enfrentar e superar os desafios com que se defrontam.',
        ],
        answer: [0],
      },
      {
        type: 'one_choice',
        choices: [
          'A vulnerabilidade opera apenas quando o risco está presente; sem risco, a vulnerabilidade não tem efeito.',
          'As vulnerabilidades e riscos devem ser enfrentados como produtos da desigualdade, e, portanto, requerem uma intervenção para além do campo das políticas sociais. Não se resolve desigualdade com potencialidades individuais ou familiares.',
        ],
        answer: [1],
      },
    ],
    rewards: {
      indicators: [
        {
          indicator: 'ivs',
          amount: 0.0001,
        },
      ],
      experience: 200,
    },
  },
];
