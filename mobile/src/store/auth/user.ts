interface User {
  experience: number;
  ongoingQuests: UserQuest[];
  availableQuests: UserQuest[];
  doneQuests: UserQuest[];
  wallet: string;
}

interface UserQuest {
  name: string;
  description: string;
  endDate: Date;
  startDate: Date;
}

export interface UserAuthState {
  user: User | null;
  error: string | null;
}
