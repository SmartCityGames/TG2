import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { requestForegroundPermissionsAsync } from "expo-location";
import { useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import HomeScreen from "../../screens/home";
import MissionsScreen from "../../screens/missions";
import LoggedProviders from "../../store/combined/logged";
import Left from "../navbar/left";
import Middle from "../navbar/middle";
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
    <LoggedProviders>
      <Tab.Navigator
        screenOptions={{
          headerLeft: (props) => <Left {...props} />,
          headerRight: (props) => <Right {...props} />,
          headerTitle: (props) => <Middle {...props} />,
        }}
      >
        <Tab.Screen
          name="Home"
          options={{
            headerTransparent: true,
            tabBarIcon: (props) => <Icon name="home" {...props} />,
          }}
          component={HomeScreen}
        />
        <Tab.Screen
          name="Missions"
          options={{
            tabBarIcon: (props) => <Icon name="gamepad" {...props} />,
            headerBackgroundContainerStyle: {
              height: Platform.OS === "ios" ? 105 : 100,
            },
          }}
          component={MissionsScreen}
        />
      </Tab.Navigator>
    </LoggedProviders>
  );
}
