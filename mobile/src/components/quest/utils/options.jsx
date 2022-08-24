import { Checkbox, FormControl, Radio, Text, VStack } from "native-base";

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
}) {
  function getOptions() {
    return type === "one_choice" ? (
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
    ) : (
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
        {type === "one_choice"
          ? "Select the correct answer"
          : "select all aplicable answers"}
      </FormControl.Label>
      {getOptions()}
    </VStack>
  );
}
