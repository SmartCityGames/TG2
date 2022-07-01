import { Center, Text } from "@chakra-ui/react";
import { useUserAuth } from "../store/auth/provider";

export default function Profile() {
  const {
    state: { session },
  } = useUserAuth();

  return (
    <Center>
      <Text color="white">Email: {session.user.email}</Text>
    </Center>
  );
}
