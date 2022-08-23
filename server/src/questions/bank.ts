import { Quest } from '../types';
import { idhmQuestions } from './idhm';
import { ivsQuestions } from './ivs';
import { trashQuestions } from './trash';
import { waterAndSewerQuestions } from './water_and_sewer';

export const questions: Quest[] = [
  ...idhmQuestions,
  ...ivsQuestions,
  ...trashQuestions,
  ...waterAndSewerQuestions,
];
