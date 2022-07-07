import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "../../screens/auth/sign-in";
import SignUpScreen from "../../screens/auth/sign-up";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}
