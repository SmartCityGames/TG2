import { Avatar, Box } from "native-base";
import { useEffect, useState } from "react";
import { useUserAuth } from "../../store/auth/provider";
import { useSupabase } from "../../store/supabase/provider";

export default function Left(props) {
  const {
    state: { session },
  } = useUserAuth();
  const supabase = useSupabase();
  const [avatarUrl, setAvatarUrl] = useState(
    "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
  );

  useEffect(() => {
    async function getUserProfile() {
      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", session.user.id);

      if (error || !data.length) return;

      if (!data[0].avatar_url) return;

      setAvatarUrl(response.data[0].avatar_url);
    }
    getUserProfile();
  }, [session.user.id]);

  return (
    <Box {...props} ml="3" mt="3">
      <Avatar source={{ uri: avatarUrl }}>
        <Avatar.Badge bg="green.500" />
      </Avatar>
    </Box>
  );
}
