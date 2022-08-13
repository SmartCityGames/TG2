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
import { useUserProfile } from "../user-profile/provider";
import { questsReducer } from "./reducer";
import RandomPointsOnPolygon from "random-points-on-polygon";

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

  const {
    state: { geojson },
  } = useUserLocation();

  useEffect(() => {
    retrieveQuests();
  }, [geojson]);

  async function retrieveQuests() {
    if (!geojson) return;

    toggleLoading(dispatch);

    const quests = geojson.features
      .map((feature, j) =>
        RandomPointsOnPolygon(1, feature).map((point, i) => ({
          id: i + j,
          remote: (i + j) % 2 === 0,
          description:
            (i + j) % 2 === 0
              ? "get into the circle so the mission can be completed"
              : "click to earn exp",
          name: `complete me - ${i + j}`,
          expires_at: Date.now() - 9812300 + 10000000 * (i + j),
          type: ["trash", "fire", "water", "sewer", "electricity"][
            Math.floor(Math.random() * 13) % 5
          ],
          rewards: {
            indicators: [
              {
                indicator: (i + j) % 5 === 0 ? "ivs" : "idhm",
                amount: 1,
              },
            ],
            experience: 100,
          },
          shape: {
            shapeType: "Circle",
            id: `circle-${point.geometry.coordinates}`,
            center: {
              lat: point.geometry.coordinates[1],
              lng: point.geometry.coordinates[0],
            },
            radius: 75,
          },
        }))
      )
      .flat();

    dispatch({
      type: "RETRIEVE_QUESTS",
      payload: quests ?? [],
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

  const actions = useMemo(() => ({ updateUsersNearbyQuests }), []);

  const dependentActions = useMemo(
    () => ({ completeQuest, retrieveQuests }),
    [updateExperience, incrementIndicator, state.geojson]
  );

  return (
    <QuestsContext.Provider
      value={{ state, actions: { ...actions, ...dependentActions } }}
    >
      {children}
    </QuestsContext.Provider>
  );
}
