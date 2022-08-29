import {
  Button,
  Center,
  Flex,
  Image,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import CenteredSpinner from "../components/CenteredSpinner";
import { useMetamask } from "../store/metamask/metamask";
import { useUserProfile } from "../store/profile/provider";

export default function Home() {
  const {
    state: { account, values, loading },
    actions: { getMintedTokens, getTotalNftMinted, mintBatch },
  } = useMetamask();

  const {
    state: { collected_nfts },
    actions: { updateCollectedNfts },
  } = useUserProfile();

  const nftsToGet = collected_nfts.filter((nft) => !nft?.taken);

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
    <Flex gap={4} direction="column" justify="center" align="center" my={5}>
      <Text color="red.300">{values.total} NFTs got minted in total </Text>

      <Text color="blueviolet">You have {nftsToGet.length} NFTs to get</Text>

      <Button
        onClick={async () => {
          const taken = await mintBatch(nftsToGet);
          updateCollectedNfts(taken);
        }}
      >
        try to mint
      </Button>
      {loading ? (
        <CenteredSpinner />
      ) : !values.userNftMinted?.length ? (
        <Text color={"white"}>You dont have owned any token yet</Text>
      ) : (
        <SimpleGrid columns={2} spacing={10}>
          {values.userNftMinted?.map((token) => (
            <Image
              boxSize="300px"
              key={token}
              src={`https://ipfs-gateway.cloud/ipfs/${token}`}
            />
          ))}
        </SimpleGrid>
      )}
    </Flex>
  );
}
