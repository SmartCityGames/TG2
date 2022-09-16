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
  useToast,
} from "native-base";
import { useEffect, useRef, useState } from "react";
import { Linking, RefreshControl } from "react-native";
import DebounceInput from "react-native-debounce-input";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingInterceptor from "../../components/loading/loading-interceptor";
import { INDICATORS_LABELS } from "../../store/indicators/utils/indicators-labels";
import { renderIndicatorIcon } from "../../store/indicators/utils/render-indicator-icon";
import { useUserLocation } from "../../store/location/provider";
import { useQuests } from "../../store/quests/provider";
import { sanitizeText } from "../../utils/sanitize-text";

const TOAST_QUEST_IS_REMOTE_ID = "TOAST_QUEST_IS_REMOTE_ID";

export default function MissionsScreen() {
  const initialFocusRef = useRef(null);

  const [search, setSearch] = useState("");

  const {
    state: { availableQuests, loading },
    actions: { retrieveQuests, updateUsersNearbyQuests },
  } = useQuests();

  const {
    actions: { getPolygonWhichGeometryLies, getUserPosition },
  } = useUserLocation();

  const { navigate } = useNavigation();

  const toast = useToast();

  useEffect(() => {
    updateQuestsInfo();
  }, []);

  async function updateQuestsInfo() {
    await retrieveQuests();
    const userPosition = await getUserPosition();
    updateUsersNearbyQuests(userPosition);
    setSearch("");
  }

  const filteredQuests =
    search.length > 0
      ? availableQuests?.filter((q) =>
          sanitizeText(q.name).toLowerCase().includes(search.toLowerCase())
        )
      : availableQuests;

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
      <LoadingInterceptor>
        <Center pt="5">
          <DebounceInput
            value={search}
            defaultValue=""
            returnKeyType="search"
            keyboardType="default"
            minLength={1}
            placeholder={
              search.length > 0 ? search : "Busque pelo nome da missão"
            }
            delayTimeout={500}
            clearButtonMode="while-editing"
            onChangeText={(v) => setSearch(sanitizeText(v))}
            style={{
              marginTop: 6,
              padding: 10,
              backgroundColor: "white",
              borderRadius: 12,
              width: "86%",
              borderWidth: 1,
              borderColor: "#ccc",
            }}
          />
        </Center>
        <FlatList
          data={filteredQuests}
          contentContainerStyle={{ flexGrow: 1 }}
          ItemSeparatorComponent={(props) => <Divider {...props} />}
          ListEmptyComponent={() => (
            <Center flex={1}>
              <Text fontSize={20} fontWeight="semibold">
                Nenhuma missão disponível 🚀
              </Text>
            </Center>
          )}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={updateQuestsInfo} />
          }
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              shadow={1}
              onPress={() => {
                if (item.remote) {
                  return navigate("DetalhesMissao", { id: item.id });
                }

                if (!item.isUserInside) {
                  if (!toast.isActive(TOAST_QUEST_IS_REMOTE_ID)) {
                    toast.show({
                      id: TOAST_QUEST_IS_REMOTE_ID,
                      title: "Esta missão não é remota",
                      description:
                        "Dirija-se ao local da missão para poder iniciá-la",
                      collapsable: true,
                      bg: "red.500",
                      duration: 5000,
                    });
                  }
                  return;
                }

                navigate("DetalhesMissao", { id: item.id });
              }}
            >
              <Center px={3}>
                <Text fontSize={28} bold textAlign="center">
                  {item.name}
                </Text>
                <Text fontSize={20} fontWeight="semibold" textTransform="capitalize">
                  {getPolygonWhichGeometryLies({
                    coordinates: [item.shape.center.lng, item.shape.center.lat],
                    type: "Point",
                  })?.properties?.NM_SUBDIST ?? "fora do Distrito Federal"}
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
                      <Popover.Content w="2xs">
                        <Popover.Arrow />
                        <Popover.CloseButton />
                        <Popover.Header>{i.indicator}</Popover.Header>
                        <Popover.Body>
                          <Text textAlign="justify">
                            {INDICATORS_LABELS[i.indicator].description_short}
                          </Text>
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
                    <Popover.Body>
                      Tempo estimado para a missão expirar
                    </Popover.Body>
                  </Popover.Content>
                </Popover>
                <Text p={2} bold color="danger.500">
                  {item.expires_at
                    ? formatDistanceToNow(new Date(item.expires_at), {
                        addSuffix: true,
                        locale: pt,
                      })
                    : "leve o tempo que precisar"}
                </Text>
              </HStack>
            </Pressable>
          )}
        />
      </LoadingInterceptor>
    </SafeAreaView>
  );
}
