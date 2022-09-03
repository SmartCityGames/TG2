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
import { Platform, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllChangesOfUser } from "../../services/osm/changesets";
import { useQuests } from "../../store/quests/provider";
import { useUserProfile } from "../../store/user-profile/provider";
import { CenterLoading } from "../loading/center-loading";
import { isArrayEquals } from "./utils/array-equality";
import Options from "./utils/options";

const TOAST_STEP_ANSWER_ID = "TOAST_STEP_ANSWER_ID";

const NOTHING_SELECTED = [-1];

export default function Quest({ route }) {
  const [selectedOptions, setSelectedOptions] = useState(NOTHING_SELECTED);
  const [loading, setLoading] = useState(false);
  const [changes, setChanges] = useState([]);

  const { goBack } = useNavigation();

  const { id } = route.params;

  const {
    state: { availableQuests },
    actions: { completeQuest },
  } = useQuests();

  const {
    state: { username },
  } = useUserProfile();

  const toast = useToast();

  const quest = availableQuests.find((q) => q.id === id);
  const actualStep = quest?.steps?.find((step) => !step.completed);

  useEffect(() => {
    if (!quest || !actualStep) {
      goBack();
      return;
    }

    getUserChanges();
  }, [quest]);

  if (!quest || loading) {
    return <CenterLoading />;
  }

  async function getUserChanges() {
    if (actualStep.type === "confirm_osm_change") {
      setLoading(true);
      getAllChangesOfUser({
        user: username,
        quest_created_at: quest.created_at,
        quest_expiration: quest.expires_at,
      }).then((response) => {
        setChanges(response.length > 3 ? response.slice(0, 3) : response);
        setLoading(false);
      });
    }
  }

  async function handleAnswer() {
    let correct = false;
    switch (actualStep.type) {
      case "multiple_choice":
        correct = isArrayEquals(actualStep.answer, selectedOptions.slice(1));
        break;
      case "one_choice":
        correct = actualStep.answer.every((ans) =>
          selectedOptions.includes(ans)
        );
        break;
      case "confirm_osm_change": {
        const [selected] = selectedOptions;
        correct = changes.findIndex((change) => change.id === selected) === 0;
      }
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
          title: "Parabéns! 😊",
          description: "Você acertou a questão!",
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
        title: "ops... algo não está certo! 😔",
        description: "Por favor, tente novamente!",
        collapsable: true,
        duration: 3000,
        bg: "danger.500",
      });
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
      <ScrollView
        px={4}
        mt={Platform.OS === "ios" ? 7 : 9}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={getUserChanges} />
        }
      >
        <VStack space={3}>
          <Heading fontSize={28} bold textAlign="center">
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
            changes={changes}
          />
        </VStack>
        <Button
          isDisabled={
            actualStep.type === "multiple_choice"
              ? selectedOptions.length < 2
              : selectedOptions[0] < 0
          }
          my="6"
          onPress={handleAnswer}
        >
          Enviar suas escolhas
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
