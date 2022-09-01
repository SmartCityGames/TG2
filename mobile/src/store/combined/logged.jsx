import IndicatorsProvider from "../indicators/provider";
import UserLocationProvider from "../location/provider";
import NftProvider from "../nft/provider";
import QuestsProvider from "../quests/provider";
import UserProfileProvider from "../user-profile/provider";

export default function LoggedProviders({ children }) {
  return (
    <NftProvider>
      <UserProfileProvider>
        <UserLocationProvider>
          <IndicatorsProvider>
            <QuestsProvider>{children}</QuestsProvider>
          </IndicatorsProvider>
        </UserLocationProvider>
      </UserProfileProvider>
    </NftProvider>
  );
}
