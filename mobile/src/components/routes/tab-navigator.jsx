import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, Text } from "native-base";
import SignInScreen from "../../screens/auth/sign-in";
import SignUpScreen from "../../screens/auth/sign-up";
import HomeScreen from "../../screens/home";
import { useUserAuth } from "../../store/auth/provider";
import UserLocationProvider from "../../store/location/provider";
import Icon from "react-native-vector-icons/FontAwesome";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function TabNavigator() {
  const {
    state: { session },
    actions: { logout },
  } = useUserAuth();

  return session ? (
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
  ) : (
    <Stack.Navigator>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}
