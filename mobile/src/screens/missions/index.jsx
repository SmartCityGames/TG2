import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import {
  Center,
  Divider,
  FlatList,
  Flex,
  HStack,
  IconButton,
  Text,
} from "native-base";
import { Linking, RefreshControl } from "react-native";
import { useUserLocation } from "../../store/location/provider";
import { useQuests } from "../../store/quests/provider";
import { formatTimeLeft } from "./utils/format-expiration-time";

export default function MissionsScreen() {
  const {
    state: { availableQuests, loading },
    actions: { retrieveQuests, completeQuest },
  } = useQuests();

  const {
    actions: { getPolygonWhichGeometryLies, getUserPosition },
  } = useUserLocation();

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
            <Center px={3}>
              <Text fontSize={28} fontWeight="bold">
                {item.name}
              </Text>
              <Text fontSize={20} fontWeight="semibold">
                {
                  getPolygonWhichGeometryLies({
                    coordinates: [item.shape.center.lng, item.shape.center.lat],
                    type: "Point",
                  }).properties.NM_SUBDIST
                }
              </Text>
            </Center>
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
              <Center>
                {!item.remote || item?.isUserInside ? (
                  <IconButton
                    onPress={() => completeQuest(item)}
                    rounded="full"
                    icon={
                      <FontAwesome name="thumbs-up" size={28} color="black" />
                    }
                  />
                ) : (
                  <IconButton
                    rounded="full"
                    icon={<FontAwesome5 name="car" size={28} color="black" />}
                    onPress={async () => {
                      const user = await getUserPosition();
                      Linking.openURL(
                        `https://www.google.com/maps/dir/?api=1&origin=${user.latitude},${user.longitude}&destination=${item.shape.center.lat},${item.shape.center.lng}&travelmode=walking`
                      );
                    }}
                  />
                )}
              </Center>
            </Flex>
          </Flex>
        )}
      />
    </Flex>
  );
}
