import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  Center,
  Divider,
  FlatList,
  Flex,
  HStack,
  IconButton,
  Text,
} from "native-base";
import { RefreshControl } from "react-native";
import { useQuests } from "../../store/quests/provider";
import { formatTimeLeft } from "./utils/format-expiration-time";

export default function MissionsScreen() {
  const {
    state: { availableQuests, loading },
    actions: { retrieveQuests, completeQuest },
  } = useQuests();

  return (
    <Flex flex={1} mt={5}>
      <FlatList
        data={availableQuests}
        contentContainerStyle={{ flexGrow: 1 }}
        ItemSeparatorComponent={(props) => <Divider {...props} />}
        ListEmptyComponent={() => (
          <Center flex={1}>
            <Text fontSize={20} fontWeight="semibold">
              No missions available 🚀
            </Text>
          </Center>
        )}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={retrieveQuests} />
        }
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Flex>
            <Text fontSize={28} fontWeight="bold" alignSelf="center" px={3}>
              {item.name}
            </Text>
            <Flex direction="column" justify="space-around" my={2}>
              <Text px={3} textAlign="justify" color="gray.600">
                {item.description}
              </Text>
              <HStack alignSelf="flex-end" alignItems="center">
                <FontAwesome name="hourglass" />
                <Text p={3} fontWeight="bold" color="danger.500">
                  {item.expires_at
                    ? formatTimeLeft(item.expires_at)
                    : "take your time"}
                </Text>
              </HStack>
              <IconButton
                alignSelf="flex-start"
                onPress={() => completeQuest(item)}
                rounded="full"
                icon={
                  <FontAwesome name="thumbs-up" size={35} color="#FA47AB" />
                }
              />
            </Flex>
          </Flex>
        )}
      />
    </Flex>
  );
}
