import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Input } from "react-native-elements";
import { SigninScreenNavigationProps } from "../../../components/routes/tab-navigator";
import { signup } from "../../../store/auth/actions";
import { useUserAuth } from "../../../store/auth/provider";

export default function SignUpScreen() {
  const navigation = useNavigation<SigninScreenNavigationProps>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { dispatch } = useUserAuth();

  return (
    <View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          autoCompleteType="email"
          label="Email"
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          autoCompleteType="password"
          label="Password"
          leftIcon={{ type: "font-awesome", name: "lock" }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title="Sign up"
          onPress={() => {
            signup(dispatch, { email, password })
            setEmail(''); setPassword('');
          }}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title="Return"
          onPress={() => {
            navigation.navigate('SignIn');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
