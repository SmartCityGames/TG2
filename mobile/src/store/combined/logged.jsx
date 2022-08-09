import IndicatorsProvider from "../indicators/provider";
import UserLocationProvider from "../location/provider";
import QuestsProvider from "../quests/provider";
import UserProfileProvider from "../user-profile/provider";

export default function LoggedProviders({ children }) {
  return (
    <UserProfileProvider>
      <IndicatorsProvider>
        <QuestsProvider>
          <UserLocationProvider>{children}</UserLocationProvider>
        </QuestsProvider>
      </IndicatorsProvider>
    </UserProfileProvider>
  );
}
