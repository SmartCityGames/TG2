import { formatDistanceToNow, parseISO } from "date-fns";
import pt from "date-fns/locale/pt";
import {
  Checkbox,
  Flex,
  FormControl,
  Heading,
  Link,
  Radio,
  Text,
  VStack,
  WarningOutlineIcon,
} from "native-base";
import { useEffect, useState } from "react";
import { Linking } from "react-native";
import { useUserLocation } from "../../../store/location/provider";
import { shuffleArray } from "./shuffle-array";

const Choice = ({ v }) => (
  <Text w={"xs"} textAlign="justify" textBreakStrategy="highQuality">
    {v}
  </Text>
);

const ChoicesWrapper = ({ children }) => <VStack space={2}>{children}</VStack>;

export default function Options({
  type,
  setSelectedOptions,
  selectedOptions,
  choices,
  changes,
}) {
  const {
    actions: { getPolygonWhichGeometryLies, getUserPosition },
  } = useUserLocation();

  const [shuffled, setShuffled] = useState(changes);

  useEffect(() => {
    if (type === "confirm_osm_change") {
      setShuffled(shuffleArray(changes));
    }
  }, [type]);

  function getOptions() {
    switch (type) {
      case "one_choice":
        return (
          <Radio.Group
            value={selectedOptions?.[0]}
            onChange={(next) => setSelectedOptions([next])}
            accessibilityLabel="choose the correct answer"
          >
            <ChoicesWrapper>
              {choices.map((v, i) => (
                <Radio key={v} value={i}>
                  <Choice v={v} />
                </Radio>
              ))}
            </ChoicesWrapper>
          </Radio.Group>
        );
      case "multiple_choice":
        return (
          <Checkbox.Group
            value={selectedOptions}
            onChange={setSelectedOptions}
            accessibilityLabel="choose the correct answers"
          >
            <ChoicesWrapper>
              {choices.map((v, i) => (
                <Checkbox key={v} value={i}>
                  <Choice v={v} />
                </Checkbox>
              ))}
            </ChoicesWrapper>
          </Checkbox.Group>
        );
      case "confirm_osm_change":
        return shuffled.length > 0 ? (
          <Radio.Group
            value={selectedOptions?.[0]}
            onChange={(next) => setSelectedOptions([next])}
            accessibilityLabel="choose the correct answer"
          >
            <ChoicesWrapper>
              {shuffled.map((v) => (
                <Radio key={v.id} value={v.id}>
                  <Flex
                    w={"xs"}
                    textAlign="justify"
                    textBreakStrategy="highQuality"
                    borderWidth={1}
                    p={3}
                    rounded="lg"
                  >
                    <Link
                      w="30%"
                      onPress={() =>
                        Linking.openURL(
                          `https://www.openstreetmap.org/changeset/${v.id}`
                        )
                      }
                    >
                      #{v.id}
                    </Link>
                    <Text>
                      <Text bold>District: </Text>
                      {getPolygonWhichGeometryLies({
                        coordinates: [
                          [
                            [v.min_lon, v.min_lat],
                            [v.max_lon, v.max_lat],
                          ],
                        ],
                        type: "Polygon",
                      })?.properties?.NM_SUBDIST ?? "outside Federal District"}
                    </Text>
                    <Text bold>Tags:</Text>
                    {Object.entries(v?.tags ?? {}).map(([key, value]) => (
                      <Text key={key} ml={2}>
                        {key}: {value}
                      </Text>
                    ))}
                    <Text>
                      <Text bold>Editado </Text>
                      {formatDistanceToNow(parseISO(v.created_at), {
                        addSuffix: true,
                        locale: pt,
                      })}
                    </Text>
                  </Flex>
                </Radio>
              ))}
            </ChoicesWrapper>
          </Radio.Group>
        ) : (
          <ChoicesWrapper>
            <Heading textAlign="center">
              Não há alterações para confirmar 🥸
            </Heading>
            <Text>
              Vá para o{" "}
              <Link
                onPress={async () => {
                  const user = await getUserPosition();
                  Linking.openURL(
                    `https://www.openstreetmap.org/edit#map=17/${user.latitude}/${user.longitude}`
                  );
                }}
              >
                Editor
              </Link>{" "}
              no OpenStreetMap
            </Text>
            <Text>
              <WarningOutlineIcon /> Suas mudanças podem demorar um pouco para
              serem refletidas no mapa
            </Text>
          </ChoicesWrapper>
        );
    }
  }

  return (
    <VStack space={3}>
      <FormControl.Label
        _text={{
          fontSize: "2xl",
          bold: true,
          textAlign: "center",
          textTransform: "capitalize",
        }}
      >
        {type === "confirm_osm_change"
          ? "Select your last change"
          : type === "one_choice"
          ? "Select the correct answer"
          : "select all aplicable answers"}
      </FormControl.Label>
      {getOptions()}
    </VStack>
  );
}
