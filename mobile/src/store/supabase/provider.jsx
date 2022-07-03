import { createClient } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

const supabaseUrl = "https://ztznlnawnncaxlmnhhjm.supabase.co/";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0em5sbmF3bm5jYXhsbW5oaGptIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTU3NjYzMjQsImV4cCI6MTk3MTM0MjMyNH0.GGNH3MyOf_4n2V1r_LR0kqrH-YjYi0HK9oHHMzujGxI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SupabaseContext = createContext(supabase);

export const useSupabase = () => useContext(SupabaseContext);

export default function SupabaseProvider({ children }) {
  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}
