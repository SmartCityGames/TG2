import { useNavigation } from "@react-navigation/native";
import {
  Button,
  Heading,
  ScrollView,
  Text,
  useToast,
  VStack,
} from "native-base";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuests } from "../../store/quests/provider";
import { isArrayEquals } from "./utils/array-equality";
import Options from "./utils/options";

const TOAST_STEP_ANSWER_ID = "TOAST_STEP_ANSWER_ID";

const NOTHING_SELECTED = [-1];

export default function Quest({ route }) {
  const [selectedOptions, setSelectedOptions] = useState(NOTHING_SELECTED);

  const { goBack } = useNavigation();

  const { id } = route.params;

  const {
    state: { availableQuests },
    actions: { completeQuest },
  } = useQuests();

  const toast = useToast();

  const quest = availableQuests.find((q) => q.id === id);
  const actualStep = quest?.steps?.find((step) => !step.completed);

  useEffect(() => {
    console.log({ selectedOptions });
  }, [selectedOptions]);

  useEffect(() => {
    if (!quest) {
      goBack();
    }
  }, [quest]);

  async function handleAnswer() {
    let correct = false;
    switch (actualStep.type) {
      case "multiple_choice":
        correct = isArrayEquals(actualStep.answer, selectedOptions);
        break;
      case "one_choice":
        correct = actualStep.answer.every((ans) =>
          selectedOptions.includes(ans)
        );
        break;
    }
    if (correct) {
      const updated = {
        ...quest,
        steps: [...quest.steps.slice(1), { ...actualStep, completed: true }],
      };

      const someNotCompleted = updated.steps.some((step) => !step.completed);

      if (someNotCompleted && !toast.isActive(TOAST_STEP_ANSWER_ID)) {
        toast.show({
          id: TOAST_STEP_ANSWER_ID,
          title: "good job! 😊",
          description: "moving to the next step",
          collapsable: true,
          duration: 2000,
          bg: "green.500",
        });
      }

      completeQuest(updated);
      setSelectedOptions(NOTHING_SELECTED);
    } else {
      toast.show({
        id: TOAST_STEP_ANSWER_ID,
        title: "ops... something is wrong! 😔",
        description: "please try again",
        collapsable: true,
        duration: 3000,
        bg: "danger.500",
      });
    }
  }

  if (!quest) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
      <ScrollView px={4} mt={5}>
        <VStack space={3}>
          <Heading fontSize={28} fontWeight="bold" textAlign="center">
            {quest.name}
          </Heading>
          <Text fontSize={14} textAlign="justify">
            {quest.description}
          </Text>
          <Options
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            type={actualStep.type}
            choices={actualStep.choices}
          />
        </VStack>
        <Button
          isDisabled={!selectedOptions.length}
          my="6"
          onPress={() => handleAnswer()}
        >
          Submit your choices
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
