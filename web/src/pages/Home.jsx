import {
  Button,
  Center,
  Flex,
  Image,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useMetamask } from "../store/metamask/metamask";

export default function Home() {
  const {
    state: { account, values },
    actions: { getMintedTokens, getTotalNftMinted, mint },
  } = useMetamask();

  useEffect(() => {
    if (!account) return;

    getMintedTokens();
    getTotalNftMinted();
  }, [account]);

  if (!account) {
    return (
      <Center flex={1} color="white">
        <Text>Login with metamask first to see your NFTs</Text>
      </Center>
    );
  }

  return (
    <Flex gap={4} direction="column" justify="center" align="center">
      <Text color="red.300">
        There are {values.total} NFTs minted in total{" "}
      </Text>
      <Button
        onClick={() => {
          mint("01");
        }}
      >
        earn an nft
      </Button>
      {values.userNftMinted?.length ? (
        <List>
          {values.userNftMinted?.map((token) => (
            <ListItem>
              <Image src={token} />
            </ListItem>
          ))}
        </List>
      ) : (
        <Text color={"white"}>You dont have owned any token yet</Text>
      )}
    </Flex>
  );
}
