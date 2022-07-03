import { createClient } from "@supabase/supabase-js";
import { createContext, useContext } from "react";
import { config } from "../../config/index";

export const supabase = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_ANON_KEY
);

const SupabaseContext = createContext(supabase);

export const useSupabase = () => useContext(SupabaseContext);

export default function SupabaseProvider({ children }) {
  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}
