import { BottomTabNavigationProp, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SignInScreen from "../../screens/auth/sign-in";
import SignUpScreen from "../../screens/auth/sign-up";
import HomeScreen from "../../screens/home";
import { useUserAuth } from "../../store/auth/provider";
import UserLocationProvider from "../../store/location/provider";

const Tab = createBottomTabNavigator();

type RootStackParamList = {
  Home: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

export type HomeScreenNavigationProps = BottomTabNavigationProp<
  RootStackParamList,
  "Home"
>;

export type SigninScreenNavigationProps = BottomTabNavigationProp<
  RootStackParamList,
  "SignIn"
>;

export type SignupScreenNavigationProps = BottomTabNavigationProp<
  RootStackParamList,
  "SignUp"
>;

export default function TabNavigator() {
  const {
    state: { user },
  } = useUserAuth();

  return user ? (
    <UserLocationProvider>
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          options={{
            headerShown: false,
          }}
          component={HomeScreen}
        />
      </Tab.Navigator>
    </UserLocationProvider>
  ) : (
    <Tab.Navigator>
      <Tab.Screen name="SignIn" component={SignInScreen} />
      <Tab.Screen name="SignUp" component={SignUpScreen} />
    </Tab.Navigator>
  );
}
