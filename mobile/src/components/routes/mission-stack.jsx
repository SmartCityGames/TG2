import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MissionsScreen from "../../screens/missions";
import Quest from "../quest";

const Stack = createNativeStackNavigator();

export default function MissionStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        header: () => null,
      }}
    >
      <Stack.Screen name="List" component={MissionsScreen} />
      <Stack.Screen name="Details" component={Quest} />
    </Stack.Navigator>
  );
}
