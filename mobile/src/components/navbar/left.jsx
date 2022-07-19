import { Avatar, Box } from "native-base";
import { useUserProfile } from "../../store/user-profile/provider";

export default function Left(props) {
  const {
    state: { avatar_url },
  } = useUserProfile();

  return (
    <Box {...props} ml="3" mt="3">
      <Avatar
        source={{
          uri: avatar_url,
        }}
      >
        <Avatar.Badge bg="green.500" />
      </Avatar>
    </Box>
  );
}
