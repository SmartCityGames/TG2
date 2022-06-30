import { Button, Flex, Text, useToast } from "@chakra-ui/react";
import { faker } from "@faker-js/faker";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useMetamask } from "../store/metamask/metamask";
import { shortenAccount } from "../utils/shorten-account";

export default function Home() {
  const toast = useToast();
  const {
    state,
    actions: { getAccount },
  } = useMetamask();
  const [message, setMessage] = useState("default message");

  useEffect(() => {
    if (!state.contracts.hello) return;

    state.contracts.hello
      .getMessage()
      .then(setMessage)
      .catch((error) => {
        toast({
          title: `ERROR`,
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      });
  }, [state.contracts.hello]);

  async function setMessageBlockchain() {
    const signer = await state.contracts.hello.connect(state.signer);
    await signer.setMessage(faker.random.words(5));
  }

  return (
    <>
      <Navbar />
      <Flex align="center" justify="center" h="100vh">
        <Flex columnGap={4} direction="column" align="center" justify="center">
          {state.account && (
            <>
              <Text size="xl" color="teal.600">
                Account: {shortenAccount(state.account)}
              </Text>
              <Text size="2xl" color="skyblue">
                Contract Message: {message}
              </Text>

              <Button
                p={3}
                bg="pink.400"
                rounded="lg"
                onClick={() => setMessageBlockchain()}
              >
                Mudar
              </Button>
            </>
          )}
          {!state.account && (
            <Button
              p={3}
              bg="orange.400"
              rounded="lg"
              onClick={() => getAccount()}
            >
              login with Metamask
            </Button>
          )}
        </Flex>
      </Flex>
    </>
  );
}
