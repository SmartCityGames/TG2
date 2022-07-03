import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import TabNavigator from "./src/components/routes/tab-navigator";
import UserAuthProvider from "./src/store/auth/provider";
import globalStyles from "./styles";

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={globalStyles.container}>
        <StatusBar translucent animated style="auto" />
        <UserAuthProvider>
          <TabNavigator />
        </UserAuthProvider>
      </SafeAreaView>
    </NavigationContainer>
  );
}
