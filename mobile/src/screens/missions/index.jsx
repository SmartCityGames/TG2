import { differenceInHours, differenceInMinutes } from "date-fns";
import { differenceInSeconds } from "date-fns/esm";
import { Button, Divider, FlatList, Flex, HStack, Text } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { useQuests } from "../../store/quests/provider";

export default function MissionsScreen() {
  const {
    state: { availableQuests },
    actions: { completeQuest },
  } = useQuests();

  function formatTimeLeft(q) {
    const now = new Date();
    const expiration = new Date(q.expires_at);
    let time = differenceInHours(expiration, now);

    if (!time) {
      time = differenceInMinutes(expiration, now);
      if (!time) {
        time = differenceInSeconds(expiration, now);
        return `${time} seconds left`;
      }
      return `${time} minutes left`;
    }
    return `${time} hours left`;
  }

  return (
    <Flex flex={1} mt="3">
      <FlatList
        data={availableQuests}
        renderItem={({ item }) => (
          <Flex>
            <Text fontSize={28} fontWeight="bold" alignSelf="center" px={3}>
              {item.name}
            </Text>
            <Text px={3}>{item.description}</Text>
            <Flex direction="row" justify="space-between" my={2}>
              <Button
                ml={3}
                alignSelf="flex-start"
                bg="green.500"
                onPress={() => completeQuest(item.id)}
                leftIcon={<Icon name="thumbs-up" color="white" size={15} />}
              >
                <Text color="gray.800" fontSize={14} fontWeight="semibold">
                  complete
                </Text>
              </Button>
              <HStack alignItems="center">
                <Icon name="hourglass" />
                <Text p={3} fontWeight="bold" color="danger.500">
                  {formatTimeLeft(item)}
                </Text>
              </HStack>
            </Flex>
            <Divider />
          </Flex>
        )}
      />
    </Flex>
  );
}
