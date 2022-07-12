import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider } from "native-base";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-url-polyfill/auto";
import Navigator from "./src/components/routes/navigator";
import UserAuthProvider from "./src/store/auth/provider";

export default function App() {
  return (
    <NativeBaseProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar translucent animated style="auto" />
          <UserAuthProvider>
            <Navigator />
          </UserAuthProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </NativeBaseProvider>
  );
}
