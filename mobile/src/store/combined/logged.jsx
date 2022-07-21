import UserLocationProvider from "../location/provider";
import QuestsProvider from "../quests/provider";
import UserProfileProvider from "../user-profile/provider";

export default function LoggedProviders({ children }) {
  return (
    <UserProfileProvider>
      <QuestsProvider>
        <UserLocationProvider>{children}</UserLocationProvider>
      </QuestsProvider>
    </UserProfileProvider>
  );
}