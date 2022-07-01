import { Center, Spinner } from "@chakra-ui/react";

export default function CenteredSpinner({ size, h }) {
  return (
    <Center h={h ?? "100%"}>
      <Spinner size={size ?? "xl"} />
    </Center>
  );
}
