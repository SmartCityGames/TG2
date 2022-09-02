import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { formatDistanceToNow } from "date-fns";
import pt from "date-fns/locale/pt";
import {
  Center,
  Divider,
  FlatList,
  Flex,
  HStack,
  IconButton,
  Popover,
  Pressable,
  Text,
} from "native-base";
import { useEffect, useRef } from "react";
import { Linking, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingInterceptor from "../../components/loading/loading-interceptor";
import { INDICATORS_LABELS } from "../../store/indicators/utils/indicators-labels";
import { renderIndicatorIcon } from "../../store/indicators/utils/render-indicator-icon";
import { useUserLocation } from "../../store/location/provider";
import { useQuests } from "../../store/quests/provider";

export default function MissionsScreen() {
  const initialFocusRef = useRef(null);

  const {
    state: { availableQuests, loading },
    actions: { retrieveQuests, updateUsersNearbyQuests },
  } = useQuests();

  const {
    actions: { getPolygonWhichGeometryLies, getUserPosition },
  } = useUserLocation();

  const { navigate } = useNavigation();

  useEffect(() => {
    async function updateQuestsInfo() {
      const userPosition = await getUserPosition();
      updateUsersNearbyQuests(userPosition);
    }

    updateQuestsInfo();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
      <LoadingInterceptor>
        <FlatList
          pt="10"
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
            <Pressable onPress={() => navigate("Details", { id: item.id })}>
              <Center px={3}>
                <Text fontSize={28} bold textAlign="center">
                  {item.name}
                </Text>
                <Text fontSize={20} fontWeight="semibold">
                  {getPolygonWhichGeometryLies({
                    coordinates: [item.shape.center.lng, item.shape.center.lat],
                    type: "Point",
                  })?.properties?.NM_SUBDIST ?? "outside Federal District"}
                </Text>
              </Center>
              <Flex direction="row" justify="space-between" align={"center"}>
                <Flex direction="row">
                  {!!!item.isUserInside && (
                    <IconButton
                      rounded="full"
                      icon={
                        <FontAwesome5 name="route" size={20} color="#4453ad" />
                      }
                      onPress={async () => {
                        const user = await getUserPosition();
                        Linking.openURL(
                          `https://www.google.com/maps/dir/?api=1&origin=${user.latitude},${user.longitude}&destination=${item.shape.center.lat},${item.shape.center.lng}&travelmode=walking`
                        );
                      }}
                    />
                  )}
                  {!!item.source && (
                    <IconButton
                      rounded="full"
                      icon={
                        <FontAwesome5 name="globe" size={20} color="#4453ad" />
                      }
                      onPress={() => Linking.openURL(item.source)}
                    />
                  )}
                  {item.rewards.indicators.map((i) => (
                    <Popover
                      key={`popover-${item.id}-${i.indicator}-${i.amount}`}
                      initialFocusRef={initialFocusRef}
                      trigger={(triggerProps) => (
                        <IconButton
                          {...triggerProps}
                          rounded="full"
                          icon={renderIndicatorIcon(i.indicator)}
                        />
                      )}
                    >
                      <Popover.Content w={"56"}>
                        <Popover.Arrow />
                        <Popover.CloseButton />
                        <Popover.Body>
                          {INDICATORS_LABELS[i.indicator].description_short}
                        </Popover.Body>
                      </Popover.Content>
                    </Popover>
                  ))}
                </Flex>
              </Flex>
              <HStack alignSelf="flex-end" alignItems="center">
                <Popover
                  key={`popover-${item.id}-expiration`}
                  initialFocusRef={initialFocusRef}
                  trigger={(triggerProps) => (
                    <IconButton
                      {...triggerProps}
                      rounded="full"
                      icon={
                        <FontAwesome5
                          size={15}
                          color="black"
                          name="hourglass-half"
                        />
                      }
                    />
                  )}
                >
                  <Popover.Content w={"2xs"}>
                    <Popover.Arrow />
                    <Popover.CloseButton />
                    <Popover.Body>Estimated time to quest expire</Popover.Body>
                  </Popover.Content>
                </Popover>
                <Text p={2} bold color="danger.500">
                  {item.expires_at
                    ? formatDistanceToNow(new Date(item.expires_at), {
                        addSuffix: true,
                        locale: pt,
                      })
                    : "take your time"}
                </Text>
              </HStack>
            </Pressable>
          )}
        />
      </LoadingInterceptor>
    </SafeAreaView>
  );
}
