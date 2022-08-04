import { Center, Divider, FlatList, Flex, Text } from "native-base";
import { useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import DebounceInput from "react-native-debounce-input";
import { useIndicators } from "../../store/indicators/provider";
import { sanitizeText } from "../../utils/sanitize-text";

export default function IndicatorsScreen({ route }) {
  const {
    state: { indicators, loading },
    actions: { retrieveIndicators },
  } = useIndicators();
  const [filteredIvs, setFilteredIvs] = useState(indicators);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch("");
  }, [indicators]);

  useEffect(() => {
    setSearch(route?.params?.district ?? "");
  }, [route?.params?.district]);

  useEffect(() => {
    filterDistricts(search);
  }, [search]);

  function filterDistricts(name) {
    setFilteredIvs(
      indicators.filter((iv) => iv.UDH.toLowerCase().includes(name.toLowerCase()))
    );
  }

  return (
    <Flex align={"center"} flex={1} mt={5}>
      <DebounceInput
        returnKeyType="search"
        keyboardType="default"
        minLength={1}
        placeholder="search your district"
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
        keyExtractor={(item) => item.UDH}
        renderItem={({ item }) => (
          <Center>
            <Text fontSize={24} fontWeight="bold" alignSelf="center" px={2}>
              {item.UDH}
            </Text>
            <Flex direction="column" justify="space-around" my={2}>
              <Text
                px={3}
                textAlign="justify"
                color="gray.600"
                ellipsizeMode="clip"
              >
                Índice de Desenvolvimento Humano Municipal: {item.IDHM}
              </Text>
              <Text px={3} textAlign="justify" color="gray.600">
                Índice de Vulnerabilidade Social: {item.IVS}
              </Text>
            </Flex>
          </Center>
        )}
      />
    </Flex>
  );
}
