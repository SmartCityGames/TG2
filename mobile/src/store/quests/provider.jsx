import { useToast } from "native-base";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { toggleLoading } from "../../utils/actions/start-loading";
import { useUserProfile } from "../user-profile/provider";
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

  const {
    actions: { updateExperience },
  } = useUserProfile();

  useEffect(() => {
    retrieveQuests();
  }, []);

  async function retrieveQuests() {
    toggleLoading(dispatch);

    const quests = await Promise.resolve(
      Array(3)
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
          type: ["trash", "fire", "water", "sewer", "electricity"][
            Math.floor(Math.random() * 13) % 5
          ],
          shape: {
            shapeType: "Circle",
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

  async function completeQuest(quest) {
    dispatch({
      type: "COMPLETE_QUEST",
      payload: quest.id,
    });

    updateExperience(quest.experience);

    // if completing many quests toasts should not stack

    // toast.show({
    //   title: "congrats! 😊",
    //   description: "Continue to gain more Exp and rewards",
    //   collapsable: true,
    //   duration: 2000,
    // });
  }

  const actions = useMemo(
    () => ({ completeQuest, retrieveQuests }),
    [updateExperience]
  );

  return (
    <QuestsContext.Provider value={{ state, actions }}>
      {children}
    </QuestsContext.Provider>
  );
}
