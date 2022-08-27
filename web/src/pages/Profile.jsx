import { Flex, Text } from "@chakra-ui/react";
import { useUserAuth } from "../store/auth/provider";
import { useUserProfile } from "../store/profile/provider";

export default function Profile() {
  const {
    state: { session },
  } = useUserAuth();

  const {
    state: { username },
  } = useUserProfile();

  return (
    <Flex flex={1} direction="column" align="center" justify="center">
      <Text color="white">Email: {session.user.email}</Text>
      <Text color="white">Username: {username}</Text>
    </Flex>
  );
}
