import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { requestForegroundPermissionsAsync } from "expo-location";
import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import HomeScreen from "../../screens/home";
import MissionsScreen from "../../screens/missions";
import UserLocationProvider from "../../store/location/provider";
import QuestsProvider from "../../store/quests/provider";
import Left from "../navbar/left";
import Right from "../navbar/right";
import NoLocationPermissions from "./no-location-permissions";

const Tab = createBottomTabNavigator();

export default function LoggedTabs() {
  const [perms, setPerms] = useState(false);
  const appState = useRef(AppState.currentState);

  async function checkPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();
    setPerms(granted);
  }

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          await checkPermissions();
        }
        appState.current = nextAppState;
      }
    );

    checkPermissions();

    return () => {
      subscription.remove();
    };
  }, []);

  if (!perms) {
    return <NoLocationPermissions />;
  }

  return (
    <UserLocationProvider>
      <QuestsProvider>
        <Tab.Navigator
          screenOptions={{
            headerLeft: (props) => <Left {...props} />,
            headerRight: (props) => <Right {...props} />,
          }}
        >
          <Tab.Screen
            name="Home"
            options={{
              headerTransparent: true,
              headerTitle: "",

              tabBarIcon: (props) => <Icon name="home" {...props} />,
            }}
            component={HomeScreen}
          />
          <Tab.Screen
            name="Missions"
            options={{
              tabBarIcon: (props) => <Icon name="gamepad" {...props} />,
              headerBackgroundContainerStyle: {
                height: 105,
              },
            }}
            component={MissionsScreen}
          />
        </Tab.Navigator>
      </QuestsProvider>
    </UserLocationProvider>
  );
}
