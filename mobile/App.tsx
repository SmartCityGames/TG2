import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import TabNavigator from "./src/components/routes/tab-navigator";
import globalStyles from "./styles";

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={globalStyles.container}>
        <StatusBar translucent animated style="auto" />
        <TabNavigator />
      </SafeAreaView>
    </NavigationContainer>
  );
}
