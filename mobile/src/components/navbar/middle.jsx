import { Box, Flex, Text } from "native-base";
import { useEffect, useState } from "react";
import { Bar } from "react-native-progress";
import { useUserProfile } from "../../store/user-profile/provider";

export default function Middle({ children, ...rest }) {
  const [progress, setProgress] = useState(0);

  const { state } = useUserProfile();

  useEffect(() => {
    setProgress(state.experience / (700 * state.level));
  }, [state]);

  return (
    <Flex align="center" justify="center" direction="column" {...rest}>
      <Text fontWeight="bold" fontSize="16">
        {children}
      </Text>
      <Box w={"5/6"}>
        <Bar progress={progress} animated width={null} height={10} />
      </Box>
      <Flex align="center" justify="space-between" direction="row" w="90%">
        <Text fontWeight="bold" alignSelf="flex-start">
          level {state.level}
        </Text>
        <Text fontWeight="bold" alignSelf="flex-end" textAlign="left">
          {state.level * 700} xp
        </Text>
      </Flex>
    </Flex>
  );
}
