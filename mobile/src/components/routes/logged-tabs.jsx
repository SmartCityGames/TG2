import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getForegroundPermissionsAsync } from "expo-location";
import { Button, Center, HStack, Text, VStack } from "native-base";
import { useEffect, useRef, useState } from "react";
import { AppState, Linking } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import HomeScreen from "../../screens/home";
import { useUserAuth } from "../../store/auth/provider";
import UserLocationProvider from "../../store/location/provider";

const Tab = createBottomTabNavigator();

export default function LoggedTabs() {
  const {
    actions: { logout },
  } = useUserAuth();

  const [perms, setPerms] = useState(false);
  const appState = useRef(AppState.currentState);

  async function checkPermissions() {
    const { granted } = await getForegroundPermissionsAsync();
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
    return (
      <Center flex={1} bg="purple.200">
        <VStack space={5}>
          <VStack space={3}>
            <Text fontWeight="bold" fontSize="xl" color="gray.900">
              This application needs your exact location!
            </Text>
            <Text fontSize="md" color="gray.600">
              Go to settings and
            </Text>
            <VStack space={2}>
              <HStack space={3}>
                <Icon name="location-arrow" size={20} color="blue" />
                <Text>Select location</Text>
              </HStack>
              <HStack space={3}>
                <Icon name="check" size={16} color="green" />
                <Text>
                  Allow <Text>Always</Text> or <Text>During app use</Text>
                </Text>
              </HStack>
            </VStack>
          </VStack>
          <Button p="3" bg="red.500" onPress={() => Linking.openSettings()}>
            <Text fontSize="lg" fontWeight="bold" color="white">
              Configurations
            </Text>
          </Button>
        </VStack>
      </Center>
    );
  }

  return (
    <UserLocationProvider>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          options={{
            headerTransparent: true,
            headerTitle: "",
            headerRight: (props) => (
              <Button
                mr="3"
                onPress={() => logout()}
                leftIcon={<Icon name="sign-out" size={25} color="#ff5500" />}
                variant="outline"
                color="red.500"
                {...props}
              />
            ),
          }}
          component={HomeScreen}
        />
      </Tab.Navigator>
    </UserLocationProvider>
  );
}
