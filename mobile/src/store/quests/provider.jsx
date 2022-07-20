import { useToast } from "native-base";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { toggleLoading } from "../../utils/actions/start-loading";
import { questsReducer } from "./reducer";

const questsInitialState = {
  availableQuests: [],
  loading: false,
  error: undefined,
};

const QuestsContext = createContext({ state: { ...questsInitialState } });

export const useQuests = () => useContext(QuestsContext);

export default function QuestsProvider({ children }) {
  const [state, dispatch] = useReducer(questsReducer, questsInitialState);
  const toast = useToast();

  useEffect(() => {
    retrieveQuests();
  }, []);

  async function retrieveQuests() {
    toggleLoading(dispatch);

    const quests = await Promise.resolve(
      Array(2)
        .fill({
          name: "complete me",
          experience: 100,
          description: "click to earn exp",
          expires_at: 1657583383759 - 9812300,
        })
        .map((v, i) => ({
          ...v,
          id: i,
          name: `${v.name} ${i}`,
          expires_at: v.expires_at + 10000000 * i,
          type: ["trash", "fire", "water", "sewer", "electricity"].at(
            Math.floor(Math.random() * 13) % 5
          ),
          shape: {
            shapeType: "circle",
            id: i,
            center: {
              lat: -15.7093 + Math.random() * 0.013,
              lng: -47.8757 - Math.random() * 0.01,
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

  function completeQuest(questId) {
    dispatch({
      type: "COMPLETE_QUEST",
      payload: questId,
    });

    toast.show({
      title: "congrats! 😊",
      description: "Continue to gain more Exp and rewards",
      collapsable: true,
    });
  }

  const actions = useMemo(() => ({ completeQuest, retrieveQuests }), []);

  return (
    <QuestsContext.Provider value={{ state, actions }}>
      {children}
    </QuestsContext.Provider>
  );
}
