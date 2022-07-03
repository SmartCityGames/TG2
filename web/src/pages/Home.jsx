import { Button, Center, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useUserAuth } from "../store/auth/provider";
import { useMetamask } from "../store/metamask/metamask";
import { useSupabase } from "../store/supabase/provider";
import { shortenAccount } from "../utils/shorten-account";

export default function Home() {
  const {
    state: { contracts, account, loading },
    actions: {
      checkDbWalletWithMetamask,
      setMessageBlockchain,
      getMessageBlockchain,
    },
  } = useMetamask();
  const {
    state: { session },
  } = useUserAuth();
  const supabase = useSupabase();
  const [message, setMessage] = useState("default message");
  const [dbWallet, setDbWallet] = useState(null);

  useEffect(() => {
    async function getUserWallet() {
      const response = await supabase
        .from("profiles")
        .select("wallet")
        .eq("id", session.user.id);

      if (!response.data.length) return;

      setDbWallet(response.data[0].wallet);
    }
    getUserWallet();
  }, []);

  useEffect(() => {
    if (!contracts.hello || !account) return;
    (async () => setMessage(await getMessageBlockchain()))();
  }, [contracts.hello, account]);

  if (!account) {
    return (
      <Center>
        <Button
          p={3}
          bg="orange.400"
          rounded="lg"
          onClick={() => checkDbWalletWithMetamask(dbWallet)}
        >
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
