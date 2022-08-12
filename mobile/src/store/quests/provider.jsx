import { useToast } from "native-base";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { toggleLoading } from "../../utils/actions/start-loading";
import { useIndicators } from "../indicators/provider";
import { haversine } from "../location/utils/haversine";
import { useUserProfile } from "../user-profile/provider";
import { questsReducer } from "./reducer";

const questsInitialState = {
  availableQuests: [],
  loading: false,
  error: undefined,
};

const QuestsContext = createContext({ state: { ...questsInitialState } });

export const useQuests = () => useContext(QuestsContext);

const TOAST_QUEST_COMPLETED_ID = "TOAST_QUEST_COMPLETED_ID";

export default function QuestsProvider({ children }) {
  const [state, dispatch] = useReducer(questsReducer, questsInitialState);
  const toast = useToast();

  const {
    actions: { updateExperience },
  } = useUserProfile();

  const {
    actions: { incrementIndicator },
  } = useIndicators();

  useEffect(() => {
    retrieveQuests();
  }, []);

  async function retrieveQuests() {
    toggleLoading(dispatch);

    const quests = await Promise.resolve(
      Array(3)
        .fill({
          name: "complete me",
          description: "click to earn exp",
          expires_at: Date.now() - 9812300,
          rewards: {
            indicators: [
              {
                indicator: "ivs",
                target: "c1cbb652-141a-42aa-a2a2-12ca9cf7dcb3",
                amount: 1,
              },
            ],
            experience: 100,
          },
        })
        .map((v, i) => ({
          ...v,
          id: i,
          remote: i % 2 === 0,
          description:
            i % 2 ? "walk around and get into the circle" : "click to earn exp",
          name: `${v.name} ${i}`,
          expires_at: v.expires_at + 10000000 * i,
          type: ["trash", "fire", "water", "sewer", "electricity"][
            Math.floor(Math.random() * 13) % 5
          ],
          shape: {
            shapeType: "Circle",
            id: i,
            center: {
              lat: -15.709134792137093 + Math.random() * 0.001,
              lng: -47.87964955278737 + Math.random() * 0.002,
            },
            radius: 75,
          },
        }))
    );

    dispatch({
      type: "RETRIEVE_QUESTS",
      payload: quests,
    });
  }

  function completeQuest(quest) {
    const { id, rewards } = quest;

    dispatch({
      type: "COMPLETE_QUEST",
      payload: id,
    });

    updateExperience(rewards.experience);
    incrementIndicator(rewards.indicators);

    if (!toast.isActive(TOAST_QUEST_COMPLETED_ID)) {
      toast.show({
        id: TOAST_QUEST_COMPLETED_ID,
        title: "congrats! 😊",
        description: "Continue to gain more EXP and rewards",
        collapsable: true,
        duration: 2000,
      });
    }
  }

  function updateUsersNearbyQuests(userLoc) {
    const { latitude: ulat, longitude: ulng } = userLoc.coords;

    const quests = state.availableQuests.map((q) => {
      const { lat: qlat, lng: qlng } = q.shape.center;
      return q.remote
        ? {
            ...q,
            isInside: haversine(ulat, ulng, qlat, qlng) <= q.shape.radius,
          }
        : q;
    });

    if (quests.length) {
      dispatch({
        type: "RETRIEVE_QUESTS",
        payload: quests,
      });
    }
  }

  const actions = useMemo(
    () => ({ retrieveQuests, updateUsersNearbyQuests }),
    []
  );

  const dependentActions = useMemo(
    () => ({ completeQuest }),
    [updateExperience, incrementIndicator]
  );

  return (
    <QuestsContext.Provider
      value={{ state, actions: { ...actions, ...dependentActions } }}
    >
      {children}
    </QuestsContext.Provider>
  );
}
