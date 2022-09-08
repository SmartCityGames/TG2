import { Heading, Image, SimpleGrid, Text } from "@chakra-ui/react";
import { useMetamask } from "../store/metamask/metamask";
import CenteredSpinner from "./CenteredSpinner";

export default function NftList() {
  const {
    state: { values, loading },
  } = useMetamask();

  if (loading) return <CenteredSpinner />;

  if (!values.userNftMinted?.length)
    return <Text color={"white"}> Voce ainda não tem nenhum NFT</Text>;

  return (
    <>
      <Heading>Seus NFTs coletados</Heading>
      <SimpleGrid columns={[1, 1, 2]} spacing={10}>
        {values.userNftMinted?.map((token) => (
          <Image
            boxSize="300px"
            key={token}
            src={`https://ipfs-gateway.cloud/ipfs/${token}`}
            rounded="lg"
          />
        ))}
      </SimpleGrid>
    </>
  );
}
