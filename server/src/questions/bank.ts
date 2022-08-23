import { Quest } from '../types';

import { espvidaQuestions } from './espvida';
import { idhmQuestions } from './idhm';
import { ivsQuestions } from './ivs';
import { prospSocQuestions } from './prosp_soc';
import { rendaPerCapitaQuestions } from './renda_per_capita';
import { tSemAguaEsgotoQuestions } from './t_sem_agua_esgoto';
import { tSemLixoQuestions } from './t_sem_lixo';
import { tVulnerQuestions } from './t_vulner';

export const questions: Quest[] = [
  ...idhmQuestions,
  ...ivsQuestions,
  ...tSemLixoQuestions,
  ...tSemAguaEsgotoQuestions,
  ...tVulnerQuestions,
  ...espvidaQuestions,
  ...prospSocQuestions,
  ...rendaPerCapitaQuestions,
];
