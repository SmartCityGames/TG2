import { Button, Center, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useMetamask } from "../store/metamask/metamask";
import { shortenAccount } from "../utils/shorten-account";

export default function Home() {
  const {
    state: { contracts, account, loading },
    actions: { getAccount, setMessageBlockchain, getMessageBlockchain },
  } = useMetamask();
  const [message, setMessage] = useState("default message");

  useEffect(() => {
    if (!contracts.hello || !account) return;
    (async () => setMessage(await getMessageBlockchain()))();
  }, [contracts.hello, account]);

  if (!account) {
    return (
      <Center>
        <Button p={3} bg="orange.400" rounded="lg" onClick={() => getAccount()}>
          login with Metamask
        </Button>
      </Center>
    );
  }

  return (
    <Center>
      <Flex gap={4} direction="column" align="center" justify="center">
        <Text size="xl" color="teal.600">
          Account: {shortenAccount(account)}
        </Text>
        <Text size="2xl" color="skyblue">
          Contract Message: {message}
        </Text>

        <Button
          p={3}
          bg="pink.400"
          rounded="lg"
          onClick={() => setMessageBlockchain()}
          disabled={loading}
        >
          Change stored message
        </Button>
      </Flex>
    </Center>
  );
}
