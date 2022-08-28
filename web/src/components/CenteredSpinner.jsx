import { Center, Spinner } from "@chakra-ui/react";

export default function CenteredSpinner({ size }) {
  return (
    <Center flex={1}>
      <Spinner color="white" size={size ?? "xl"} />
    </Center>
  );
}
