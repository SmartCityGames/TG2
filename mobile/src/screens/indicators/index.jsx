import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  Box,
  Center,
  Divider,
  FlatList,
  Flex,
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
import { useIndicators } from "../../store/indicators/provider";
import {
  INDICATORS_LABELS,
  SOCIAL_PROSPERITY_MAPPER,
} from "../../store/indicators/utils/indicators-labels";
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

  function renderIndicatorValue(district, indicator) {
    const value = Number(district[indicator]);
    switch (indicator) {
      case "prosp_soc":
        return SOCIAL_PROSPERITY_MAPPER[(Math.floor(value) * 10).toFixed(0)];
      case "renda_per_capita":
        return `${INDICATORS_LABELS[indicator].unit} ${value.toFixed(2)}`;
      case "t_sem_lixo":
        return `${(value * 100).toFixed(2)} ${
          INDICATORS_LABELS[indicator].unit
        }`;
      case "espvida":
        return `${value.toFixed(0)} ${INDICATORS_LABELS[indicator].unit} `;
      default:
        return `${value.toFixed(2)} ${
          INDICATORS_LABELS[indicator].unit ?? ""
        }`.trim();
    }
  }

  return (
    <Flex flex={1} mt={5}>
      <Center>
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
          <RefreshControl refreshing={loading} onRefresh={retrieveIndicators} />
        }
        keyExtractor={(item) => item.udh}
        renderItem={({ item }) => (
          <Center my={1} mx={3}>
            <Heading
              fontSize={24}
              fontWeight="bold"
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
                      <Text fontSize={14} fontWeight="semibold">
                        {INDICATORS_LABELS[value].description_short}:
                      </Text>
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
                    <Text textAlign="justify" color="gray.600" ml={10}>
                      {renderIndicatorValue(item, value)}
                    </Text>
                  </Box>
                )
              )}
            </VStack>
          </Center>
        )}
      />
    </Flex>
  );
}
