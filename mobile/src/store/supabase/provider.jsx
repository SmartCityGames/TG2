import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { createContext, useContext, useEffect } from "react";

const supabaseUrl = "https://ztznlnawnncaxlmnhhjm.supabase.co/";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0em5sbmF3bm5jYXhsbW5oaGptIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTU3NjYzMjQsImV4cCI6MTk3MTM0MjMyNH0.GGNH3MyOf_4n2V1r_LR0kqrH-YjYi0HK9oHHMzujGxI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  localStorage: AsyncStorage,
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: false,
});

const SupabaseContext = createContext(supabase);

export const useSupabase = () => useContext(SupabaseContext);

export default function SupabaseProvider({ children }) {
  useEffect(() => {
    return () => {
      supabase.removeAllSubscriptions();
    };
  }, []);

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}
