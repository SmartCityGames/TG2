import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { requestForegroundPermissionsAsync } from "expo-location";
import { Button } from "native-base";
import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import HomeScreen from "../../screens/home";
import { useUserAuth } from "../../store/auth/provider";
import UserLocationProvider from "../../store/location/provider";
import Left from "../navbar/left";
import NoLocationPermissions from "./no-location-permissions";

const Tab = createBottomTabNavigator();

export default function LoggedTabs() {
  const {
    actions: { logout },
  } = useUserAuth();

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
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          options={{
            headerTransparent: true,
            headerTitle: "",
            headerLeft: (props) => <Left {...props} />,
            headerRight: (props) => (
              <Button
                mr="3"
                onPress={() => logout()}
                leftIcon={<Icon name="sign-out" size={20} color="#ff5500" />}
                variant="outline"
                rounded="full"
                {...props}
              />
            ),
            tabBarIcon: (props) => <Icon name="home" {...props} />,
          }}
          component={HomeScreen}
        />
        <Tab.Screen
          name="Missions"
          options={{
            headerTransparent: true,
            tabBarIcon: (props) => <Icon name="gamepad" {...props} />,
          }}
          component={HomeScreen}
        />
      </Tab.Navigator>
    </UserLocationProvider>
  );
}
