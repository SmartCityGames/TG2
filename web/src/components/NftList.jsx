import { Heading, Image, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useMetamask } from "../store/metamask/provider";
import { useNft } from "../store/nft/provider";
import CenteredSpinner from "./CenteredSpinner";

export default function NftList() {
  const {
    state: { values, loading },
  } = useMetamask();

  const {
    state: { nfts },
  } = useNft();

  if (loading) return <CenteredSpinner />;

  if (!values.userNftMinted?.length)
    return <Text color={"white"}> Voce ainda não tem nenhum NFT</Text>;

  return (
    <>
      <Heading>Seus NFTs coletados</Heading>
      <SimpleGrid columns={[1, 1, 2]} spacing={10}>
        {values.userNftMinted?.map((token) => {
          const id = Object.values(nfts).findIndex((nft) => nft.png === token);
          return id === -1 ? null : (
            <VStack key={token} alignItems="start">
              <Text fontWeight="semibold">#{id}</Text>
              <Image
                boxSize="300px"
                src={`https://ipfs-gateway.cloud/ipfs/${token}`}
                rounded="lg"
              />
            </VStack>
          );
        })}
      </SimpleGrid>
    </>
  );
}
