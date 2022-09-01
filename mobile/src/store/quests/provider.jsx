import { isBefore } from "date-fns";
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

    let { data } = await supabase.from("quests").select("*");

    if (completed_quests.length > 0) {
      data = data.filter((quest) => !completed_quests.includes(quest.id));
    }

    data = data.filter(
      (quest) =>
        !quest.expires_at || isBefore(new Date(), new Date(quest.expires_at))
    );

    dispatch({
      type: "RETRIEVE_QUESTS",
      payload: data,
    });
  }

  function completeQuest(quest) {
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
        updateOwnedNfts({
          nft: getRandomNft(),
        });
      }

      if (!toast.isActive(TOAST_QUEST_COMPLETED_ID)) {
        toast.show({
          id: TOAST_QUEST_COMPLETED_ID,
          title: "congrats! 😊",
          description: "Continue to gain more EXP and rewards",
          collapsable: true,
          duration: 2000,
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
        payload: quests,
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
