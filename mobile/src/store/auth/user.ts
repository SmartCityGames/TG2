import { User as SupabaseUser } from "@supabase/supabase-js";

export interface User extends SupabaseUser {
  experience: number;
  ongoingQuests: UserQuest[];
  availableQuests: UserQuest[];
  doneQuests: UserQuest[];
  wallet?: string;
}

export interface UserQuest {
  name: string;
  description: string;
  endDate: Date;
  startDate: Date;
}

export interface UserAuthState {
  user?: User;
  error?: string;
}
