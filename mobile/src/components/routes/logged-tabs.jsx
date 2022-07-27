import FontAwesome from "@expo/vector-icons/FontAwesome";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { requestForegroundPermissionsAsync } from "expo-location";
import { useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";
import HomeScreen from "../../screens/home";
import IndicatorsScreen from "../../screens/indicators";
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
          headerBackgroundContainerStyle: {
            height: Platform.OS === "ios" ? 105 : 100,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          options={{
            headerTransparent: true,
            tabBarIcon: (props) => <FontAwesome name="home" {...props} />,
          }}
          component={HomeScreen}
        />
        <Tab.Screen
          name="Missions"
          options={{
            tabBarIcon: (props) => <FontAwesome name="gamepad" {...props} />,
          }}
          component={MissionsScreen}
        />
        <Tab.Screen
          name="Indicators"
          options={{
            tabBarIcon: (props) => <FontAwesome name="btc" {...props} />,
          }}
          component={IndicatorsScreen}
        />
      </Tab.Navigator>
    </LoggedProviders>
  );
}
