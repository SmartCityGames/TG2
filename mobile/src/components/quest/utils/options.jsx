import { formatDistanceToNow, parseISO } from "date-fns";
import {
  Box,
  Checkbox,
  FormControl,
  Link,
  Radio,
  Text,
  VStack,
} from "native-base";
import { useEffect, useState } from "react";
import { ActivityIndicator, Linking } from "react-native";
import { getAllChangesOfUser } from "../../../services/overpass-turbo";
import { useUserProfile } from "../../../store/user-profile/provider";

const Choice = ({ v }) => (
  <Text w={"xs"} textAlign="justify" textBreakStrategy="highQuality">
    {v}
  </Text>
);

const ChoicesWrapper = ({ children }) => <VStack space={2}>{children}</VStack>;

// {
//   "changeset": 120138824,
//   "id": 2709744061,
//   "lat": -15.7093167,
//   "lon": -47.87904,
//   "tags": Object {
//     "amenity": "police",
//     "name": "Polícia Militar - Posto do Varjão",
//   },
//   "timestamp": "2022-04-24T20:54:30Z",
//   "type": "node",
//   "uid": 15582472,
//   "user": "yuri serka",
//   "version": 2,
// }

export default function Options({
  type,
  setSelectedOptions,
  selectedOptions,
  choices,
}) {
  const {
    state: { username },
  } = useUserProfile();

  const [loading, setLoading] = useState(false);
  const [changes, setChanges] = useState([]);

  useEffect(() => {
    if (type === "confirm_osm_change") {
      setLoading(true);
      getAllChangesOfUser({ user: username }).then((response) => {
        console.log({ response });
        setChanges(response.length > 3 ? response.slice(0, 3) : response);
        setLoading(false);
      });
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
      case "confirm_osm_change": {
        return (
          <Radio.Group
            value={selectedOptions?.[0]}
            onChange={(next) => setSelectedOptions([next])}
            accessibilityLabel="choose the correct answer"
          >
            <ChoicesWrapper>
              {changes.map((v, i) => (
                <Radio key={v.id} value={i}>
                  <Box
                    w={"xs"}
                    textAlign="justify"
                    textBreakStrategy="highQuality"
                    borderWidth={1}
                    p={3}
                    rounded="lg"
                  >
                    <Link
                      onPress={() =>
                        Linking.openURL(
                          `https://www.openstreetmap.org/changeset/${v.changeset}`
                        )
                      }
                    >
                      {v.changeset}
                    </Link>
                    <Text>
                      Coordinates: [{v.lat}, {v.lon}]
                    </Text>
                    {Object.entries(v?.tags ?? {}).map(([key, value]) => (
                      <Text key={key}>
                        {key}: {value}
                      </Text>
                    ))}
                    <Text>
                      {formatDistanceToNow(parseISO(v.timestamp), {
                        addSuffix: true,
                      })}
                    </Text>
                  </Box>
                </Radio>
              ))}
            </ChoicesWrapper>
          </Radio.Group>
        );
      }
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
      {type === "confirm_osm_change" && loading ? (
        <ActivityIndicator size="large" />
      ) : (
        getOptions()
      )}
    </VStack>
  );
}
