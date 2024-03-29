import { Quest } from 'src/types';

export const osmQuestions: Quest[] = [
  {
    remote: true,
    description:
      'Insira uma informação sobre o subdistrito indicado no OpenStreetMap para completar a missão.',
    source: 'https://wiki.openstreetmap.org/wiki/Pt:Beginners%27_guide',
    name: 'Familiarizando-se com o OpenStreetMap',
    category: 'education',
    steps: [
      {
        type: 'confirm_osm_change',
      },
    ],
    rewards: {
      indicators: [
        {
          indicator: 'idhm',
          amount: 0.0001,
        },
      ],
      experience: 95,
      nft: true,
    },
  },
];
