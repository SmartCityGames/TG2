import { Flex, Image, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Flex
      align="center"
      justify="space-evenly"
      direction={["column", "column", "row"]}
      gap={[3, 3, 12]}
      py={5}
      px={3}
    >
      <Image
        src="https://www.infoescola.com/wp-content/uploads/2016/02/unb.png"
        alt="unb-logo"
      />

      <Text textAlign="center">
        Copyright © {new Date().getFullYear()} Yuri Serka do Carmo Rodrigues &
        Henrique Mendes de Freitas Mariano. Todos os direitos reservados.
      </Text>
    </Flex>
  );
}
