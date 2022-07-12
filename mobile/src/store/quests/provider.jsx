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

const QuestsContext = createContext({ state: questsInitialState });

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
      Array(20)
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
        }))
    );

    setTimeout(() => {
      dispatch({
        type: "RETRIEVE_QUESTS",
        payload: quests,
      });
    }, 2000);
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
