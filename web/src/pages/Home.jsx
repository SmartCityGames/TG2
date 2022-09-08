import { Button, Center, Flex, HStack, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import NftList from "../components/NftList";
import { useMetamask } from "../store/metamask/provider";
import { useNft } from "../store/nft/provider";
import { useUserProfile } from "../store/profile/provider";

export default function Home() {
  const {
    state: { account, values },
    actions: { getMintedTokens, getTotalNftMinted, mintBatch },
  } = useMetamask();

  const {
    state: { collected_nfts },
    actions: { updateCollectedNfts },
  } = useUserProfile();

  const {
    state: { nfts },
  } = useNft();

  const nftsToGet = collected_nfts.filter((nft) => !nft?.taken);

  useEffect(() => {
    if (!account) return;

    getMintedTokens();
    getTotalNftMinted();
  }, [account]);

  if (!account) {
    return (
      <Center flex={1} color="white">
        <Text textAlign="center" fontWeight="bold">
          Faça login com o metamask primeiro para ver seus NFTs
        </Text>
      </Center>
    );
  }

  return (
    <Flex
      gap={4}
      direction="column"
      justify="center"
      align="center"
      my={5}
      color="white"
    >
      <HStack fontWeight="bold">
        <Text color="red.300" textDecor="underline">
          {values.total}/{Object.keys(nfts).length}
        </Text>
        <Text>NFTs foram resgatados no total</Text>
      </HStack>

      <HStack fontWeight="bold">
        <Text>Você tem</Text>

        <Text color="green.300" textDecor="underline">
          {nftsToGet.length}
        </Text>
        <Text>NFTs para tentar resgatar</Text>
      </HStack>

      <Button
        onClick={async () => {
          const taken = await mintBatch(nftsToGet);
          updateCollectedNfts(taken);
        }}
        colorScheme="purple"
      >
        Tente resgatá-los
      </Button>
      <NftList />
    </Flex>
  );
}
