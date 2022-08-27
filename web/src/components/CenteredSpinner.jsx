import { Center, Spinner } from "@chakra-ui/react";

export default function CenteredSpinner({ size, h }) {
  return (
    <Center flex={1}>
      <Spinner size={size ?? "xl"} />
    </Center>
  );
}
