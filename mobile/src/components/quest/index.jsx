import { useNavigation } from "@react-navigation/native";
import { Button, Center, Checkbox, Radio, Text } from "native-base";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { useQuests } from "../../store/quests/provider";
import AsyncAlert from "../utils/AsyncAlert";
import { isArrayEquals } from "./utils/array-equality";

export default function Quest({ route }) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const { goBack } = useNavigation();
  const { id } = route.params;

  const {
    state: { availableQuests },
    actions: { completeQuest },
  } = useQuests();

  const quest = availableQuests.find((q) => q.id === id);
  const actualStep = quest?.steps?.find((step) => !step.completed);

  useEffect(() => {
    if (!quest) {
      goBack();
    }
  }, [quest]);

  async function handleAnswer() {
    let correct = false;
    switch (actualStep.type) {
      case "menu":
      case "multiple":
        correct = isArrayEquals(actualStep.answer, selectedOptions);
        break;
      case "true/false":
        correct = actualStep.answer.every((ans) =>
          selectedOptions.includes(ans)
        );
        break;
    }
    if (correct) {
      completeQuest({
        ...quest,
        steps: [...quest.steps.slice(1), { ...actualStep, completed: true }],
      });
      setSelectedOptions([]);
    } else {
      await AsyncAlert("Incorrect answer", "Please Try again");
    }
  }

  function renderOptions() {
    switch (actualStep.type) {
      case "menu":
      case "multiple":
        return (
          <>
            <Text fontWeight={"bold"} fontSize={28}>
              Select all aplicable answers:
            </Text>
            <Checkbox.Group
              value={selectedOptions}
              onChange={setSelectedOptions}
              accessibilityLabel="choose the correct answers"
            >
              {actualStep.values.map((v, i) => (
                <Checkbox key={v} value={i}>
                  {v}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </>
        );
      case "true/false":
        return (
          <>
            <Text fontWeight={"bold"} fontSize={28}>
              Select the correct answer:
            </Text>
            <Radio.Group
              onChange={(next) => setSelectedOptions([next])}
              accessibilityLabel="choose the correct answer"
            >
              {actualStep.values.map((v, i) => (
                <Radio key={v} value={i}>
                  {v}
                </Radio>
              ))}
            </Radio.Group>
          </>
        );
    }
  }

  if (!quest) {
    return <ActivityIndicator />;
  }

  return (
    <Center flex={1}>
      <Center space={3}>
        <Text fontSize={28} fontWeight="bold">
          {quest.name}
        </Text>
        <Text fontSize={18}>{quest.description}</Text>
      </Center>
      <Center flex={0.9}>{renderOptions()}</Center>
      <Button onPress={() => handleAnswer()}>Submit your choices</Button>
    </Center>
  );
}
