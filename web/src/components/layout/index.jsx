import { Flex } from "@chakra-ui/react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minH="calc(100vh - 64px)"
        bg="gray.800"
      >
        {children}
      </Flex>
      <Footer />
    </>
  );
}
