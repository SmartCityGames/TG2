import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  Box,
  Center,
  Divider,
  FlatList,
  Heading,
  HStack,
  IconButton,
  Popover,
  Text,
  VStack,
} from "native-base";
import { useEffect, useRef, useState } from "react";
import { RefreshControl } from "react-native";
import DebounceInput from "react-native-debounce-input";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingInterceptor from "../../components/loading/loading-interceptor";
import { useIndicators } from "../../store/indicators/provider";
import { INDICATORS_LABELS } from "../../store/indicators/utils/indicators-labels";
import { renderIndicatorIcon } from "../../store/indicators/utils/render-indicator-icon";
import { renderIndicatorValue } from "../../store/indicators/utils/render-indicator-value";
import { sanitizeText } from "../../utils/sanitize-text";

export default function IndicatorsScreen({ route }) {
  const {
    state: { indicators, loading },
    actions: { retrieveIndicators },
  } = useIndicators();

  const [search, setSearch] = useState("");

  const initialFocusRef = useRef(null);

  useEffect(() => {
    setSearch("");
  }, [indicators]);

  useEffect(() => {
    setSearch(route?.params?.district ?? "");
  }, [route?.params?.district]);

  const filteredIvs =
    search.length > 0
      ? indicators?.filter((iv) =>
          iv.udh.toLowerCase().includes(search.toLowerCase())
        )
      : indicators;

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
            placeholder={search.length > 0 ? search : "search your district"}
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
          pt="3"
          data={filteredIvs}
          contentContainerStyle={{ flexGrow: 1 }}
          ItemSeparatorComponent={(props) => <Divider {...props} />}
          ListEmptyComponent={() => (
            <Center flex={1}>
              <Text fontSize={20} fontWeight="semibold">
                Failed to load indicators
              </Text>
            </Center>
          )}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={retrieveIndicators}
            />
          }
          keyExtractor={(item) => item.udh}
          renderItem={({ item }) => (
            <Center my={1} mx={3}>
              <Heading
                fontSize={24}
                bold
                alignSelf="center"
                textTransform={"capitalize"}
              >
                {item.udh}
              </Heading>
              <VStack alignSelf={"flex-start"} space={3}>
                {Object.keys(item).map((value) =>
                  !INDICATORS_LABELS[value] ? null : (
                    <Box key={`${item.udh}-${value}`} textAlign="justify">
                      <HStack alignItems="center">
                        <HStack space="2" alignItems="center">
                          {renderIndicatorIcon(value, {
                            color: "#44aa77",
                            size: 14,
                          })}
                          <Text fontSize={14} fontWeight="semibold">
                            {INDICATORS_LABELS[value].description_short}:
                          </Text>
                        </HStack>
                        <Popover
                          initialFocusRef={initialFocusRef}
                          trigger={(triggerProps) => (
                            <IconButton
                              {...triggerProps}
                              rounded="full"
                              icon={
                                <FontAwesome
                                  name="info-circle"
                                  color="#446677"
                                  size={15}
                                />
                              }
                            />
                          )}
                        >
                          <Popover.Content w="56">
                            <Popover.Arrow />
                            <Popover.CloseButton />
                            <Popover.Header>{value}</Popover.Header>
                            <Popover.Body>
                              {INDICATORS_LABELS[value].description_long}
                            </Popover.Body>
                          </Popover.Content>
                        </Popover>
                      </HStack>
                      <Text textAlign="justify" color="gray.600" ml="6">
                        {renderIndicatorValue(item, value)}
                      </Text>
                    </Box>
                  )
                )}
              </VStack>
            </Center>
          )}
        />
      </LoadingInterceptor>
    </SafeAreaView>
  );
}
