import { addDays, format, isBefore } from "date-fns";
import { useToast } from "native-base";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { toggleLoading } from "../../utils/actions/start-loading";
import { shuffleArray } from "../../utils/shuffle-array";
import { useIndicators } from "../indicators/provider";
import { useUserLocation } from "../location/provider";
import { haversine } from "../location/utils/haversine";
import { useNft } from "../nft/provider";
import { useSupabase } from "../supabase/provider";
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

  const supabase = useSupabase();

  const {
    state: { completed_quests },
    actions: { updateExperience, updateOwnedNfts },
  } = useUserProfile();

  const {
    actions: { incrementIndicator },
  } = useIndicators();

  const {
    actions: { getPolygonWhichGeometryLies, getUserPosition },
  } = useUserLocation();

  const {
    actions: { getRandomNft },
  } = useNft();

  useEffect(() => {
    retrieveQuests();
  }, []);

  async function retrieveQuests() {
    toggleLoading(dispatch);

    const today = new Date();

    let { data } = await supabase
      .from("quests")
      .select("*")
      .filter("created_at", "gte", format(addDays(today, -1), "yyyy-MM-dd"));

    if (completed_quests.length > 0) {
      data = data.filter((quest) => !completed_quests.includes(quest.id));
    }

    data = data.filter(
      (quest) =>
        !quest.expires_at || isBefore(today, new Date(quest.expires_at))
    );

    dispatch({
      type: "RETRIEVE_QUESTS",
      payload: data,
    });
  }

  async function completeQuest(quest) {
    const { id, rewards } = quest;

    if (quest.steps.every((step) => step.completed)) {
      dispatch({
        type: "COMPLETE_QUEST",
        payload: id,
      });

      updateExperience({ amount: rewards.experience, questId: id });

      const subdistrictId = getPolygonWhichGeometryLies({
        coordinates: [quest.shape.center.lng, quest.shape.center.lat],
        type: "Point",
      }).properties.ID_SUPABASE;

      incrementIndicator(
        rewards.indicators.map((i) => ({ ...i, target: subdistrictId }))
      );

      if (quest.rewards.nft) {
        await updateOwnedNfts({
          nft: getRandomNft(),
        });
      }

      if (!toast.isActive(TOAST_QUEST_COMPLETED_ID)) {
        toast.show({
          id: TOAST_QUEST_COMPLETED_ID,
          title: "Muito bom! 😊",
          description:
            "Continue completando missões para ganhar mais XP e outras recompensas!",
          collapsable: true,
          duration: 5000,
          bg: "green.500",
        });
      }
    } else {
      dispatch({
        type: "UPDATE_QUEST",
        payload: {
          id,
          quest,
        },
      });
    }
  }

  function updateUsersNearbyQuests(userLoc) {
    const { latitude: ulat, longitude: ulng } = userLoc;

    const quests = state.availableQuests.map((q) => {
      const { lat: qlat, lng: qlng } = q.shape.center;
      return q.remote
        ? {
            ...q,
            isUserInside: haversine(ulat, ulng, qlat, qlng) <= q.shape.radius,
          }
        : q;
    });

    if (quests.length) {
      dispatch({
        type: "RETRIEVE_QUESTS",
        payload: shuffleArray(quests),
      });
    }
  }

  const actions = useMemo(
    () => ({ updateUsersNearbyQuests }),
    [state.availableQuests]
  );

  const dependentActions = useMemo(
    () => ({ completeQuest, retrieveQuests }),
    [
      updateExperience,
      incrementIndicator,
      getPolygonWhichGeometryLies,
      getUserPosition,
      updateOwnedNfts,
      getRandomNft,
    ]
  );

  return (
    <QuestsContext.Provider
      value={{ state, actions: { ...actions, ...dependentActions } }}
    >
      {children}
    </QuestsContext.Provider>
  );
}
