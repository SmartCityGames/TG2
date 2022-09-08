import { Button, Center, Flex, Link, LinkBox } from "@chakra-ui/react";
import { useEffect } from "react";
import { useMetamask } from "../store/metamask/provider";
import { MetamaskLogo } from "./MetamaskLogo";

export default function InstallMetamask() {
  const {
    actions: { checkMetamask },
  } = useMetamask();

  useEffect(() => {
    window.addEventListener("focus", checkMetamask);

    return () => {
      window.removeEventListener("focus", checkMetamask);
    };
  }, []);

  return (
    <Center flex={1} bg="gray.800" h="100vh">
      <Flex direction="column" justify="center" align="center">
        <MetamaskLogo />
        <Button
          bg="blue.500"
          color="white"
          _hover={{
            bg: "blue.300",
          }}
        >
          <Link href="https://metamask.io/download/" isExternal>
            Por favor, instale o Metamask
          </Link>
          <LinkBox></LinkBox>
        </Button>
      </Flex>
    </Center>
  );
}
