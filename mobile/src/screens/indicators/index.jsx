import {
  Box,
  Center,
  Divider,
  FlatList,
  Flex,
  Heading,
  Text,
  VStack,
} from "native-base";
import { useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import DebounceInput from "react-native-debounce-input";
import {
  INDICATORS_LABELS,
  useIndicators,
} from "../../store/indicators/provider";
import { sanitizeText } from "../../utils/sanitize-text";

export default function IndicatorsScreen({ route }) {
  const {
    state: { indicators, loading },
    actions: { retrieveIndicators },
  } = useIndicators();
  const [search, setSearch] = useState("");

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
    <Flex align={"center"} flex={1} mt={5}>
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
          <Center my={1} mx={2}>
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
                    <Text fontSize={14} fontWeight="semibold">
                      {INDICATORS_LABELS[value].description}:
                    </Text>
                    <Text textAlign="justify" color="gray.600">
                      {item[value]}
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
