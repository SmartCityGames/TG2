import { Button, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";
import CenteredSpinner from "../components/CenteredSpinner";
import { useUserAuth } from "../store/auth/provider";
import { useUserProfile } from "../store/profile/provider";
import { shortenAccount } from "../utils/shorten-account";

export default function Profile() {
  const {
    state: { session },
  } = useUserAuth();

  const {
    state: { username, wallet, loading },
    actions: { updateProfile },
  } = useUserProfile();

  if (loading) {
    return <CenteredSpinner />;
  }

  return (
    <Flex
      flex={1}
      gap={4}
      direction="column"
      align="center"
      justify="center"
      color="white"
    >
      <FormControl isDisabled>
        <FormLabel>Wallet:</FormLabel>
        <Input value={shortenAccount(wallet)} />
      </FormControl>
      <FormControl isDisabled>
        <FormLabel>Email address:</FormLabel>
        <Input value={session.user.email} />
      </FormControl>
      <FormControl>
        <FormLabel>OpenStreetMap username:</FormLabel>
        <Input type="text" value={username} />
      </FormControl>

      <Flex>
        <Button
          onClick={() => {
            updateProfile();
          }}
        >
          Salvar alterações
        </Button>
      </Flex>
    </Flex>
  );
}
