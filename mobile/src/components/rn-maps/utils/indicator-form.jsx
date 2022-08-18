import { Box, FlatList, Radio } from "native-base";
import { useEffect, useState } from "react";
import DebounceInput from "react-native-debounce-input";
import { useIndicators } from "../../../store/indicators/provider";
import { sanitizeText } from "../../../utils/sanitize-text";

export default function IndicatorForm() {
  const {
    state: { indicators, selectedIndicator },
    actions: { changeSelectedIndicator },
  } = useIndicators();
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch("");
  }, [indicators]);

  const indicatorsIndicators =
    Object.keys(indicators?.[0] ?? {})?.filter(
      (i) => !["id", "udhs", "udh"].includes(i)
    ) ?? [];

  const filteredIndicators = [
    ...new Set(
      search.length > 0
        ? indicatorsIndicators?.filter((iv) =>
            iv.toLowerCase().includes(search.toLowerCase())
          )
        : indicatorsIndicators
    ),
  ];

  return (
    <Box
      position="absolute"
      right="12"
      top="40"
      w={"4/6"}
      maxH={"md"}
      mt={5}
      px={2}
      bg={"white"}
      p={3}
      rounded="lg"
    >
      <DebounceInput
        value={search}
        defaultValue=""
        returnKeyType="search"
        keyboardType="default"
        minLength={1}
        placeholder={search.length > 0 ? search : "search one indicator"}
        delayTimeout={500}
        clearButtonMode="while-editing"
        onChangeText={(v) => setSearch(sanitizeText(v))}
        style={{
          marginTop: 6,
          marginLeft: 6,
          padding: 10,
          backgroundColor: "white",
          borderRadius: 12,
          width: "86%",
          borderWidth: 1,
          borderColor: "#ccc",
        }}
      />
      <Radio.Group
        name="radio-group"
        value={selectedIndicator}
        accessibilityLabel="selected indicator"
        onChange={(nextValue) => changeSelectedIndicator(nextValue)}
      >
        <FlatList
          data={filteredIndicators}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={() => null}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Radio my={1} value={item}>
              {item}
            </Radio>
          )}
        />
      </Radio.Group>
    </Box>
  );
}
