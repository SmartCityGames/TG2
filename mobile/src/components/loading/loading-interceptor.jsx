import { Center } from "native-base";
import { ActivityIndicator } from "react-native";
import { useIndicators } from "../../store/indicators/provider";
import { useUserLocation } from "../../store/location/provider";
import { useQuests } from "../../store/quests/provider";
import { useUserProfile } from "../../store/user-profile/provider";

export default function LoadingInterceptor({ children, extra }) {
  const {
    state: { loading: loadingLoc },
  } = useUserLocation();

  const {
    state: { loading: loadingQuests },
  } = useQuests();

  const {
    state: { loading: loadingIndicators },
  } = useIndicators();

  const {
    state: { loading: loadingProfile },
  } = useUserProfile();

  const loading = [
    loadingLoc,
    loadingQuests,
    loadingIndicators,
    loadingProfile,
    ...(extra ?? []),
  ].some((l) => l);

  if (loading) {
    return (
      <Center flex={1}>
        <ActivityIndicator size="large" />
      </Center>
    );
  }

  return children;
}
