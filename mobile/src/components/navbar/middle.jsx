import { Box, Flex, Text } from "native-base";
import { Bar } from "react-native-progress";
import {
  MAX_XP_PER_LEVEL,
  useUserProfile,
} from "../../store/user-profile/provider";

export default function Middle({ children, ...rest }) {
  const {
    state: { experience, level },
  } = useUserProfile();

  return (
    <Flex align="center" justify="center" direction="column" {...rest}>
      <Text fontWeight="bold" fontSize="16">
        {children}
      </Text>
      <Box w={"5/6"}>
        <Bar
          progress={experience / (MAX_XP_PER_LEVEL * level)}
          animated
          width={null}
          height={10}
        />
      </Box>
      <Flex align="center" justify="space-between" direction="row" w="90%">
        <Text fontWeight="bold" alignSelf="flex-start">
          level {level}
        </Text>
        <Text fontWeight="bold" alignSelf="flex-end" textAlign="left">
          {level * MAX_XP_PER_LEVEL} xp
        </Text>
      </Flex>
    </Flex>
  );
}
