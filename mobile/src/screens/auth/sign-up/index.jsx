import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Button, Center, HStack, Input, Stack, Text } from "native-base";
import { useRef, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useUserAuth } from "../../../store/auth/provider";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const pwdRef = useRef();

  const {
    state: { loading },
    actions: { signup },
  } = useUserAuth();

  function tryToRegister() {
    if (!email || !password) return;
    signup({ email, password });
  }

  return (
    <KeyboardAwareScrollView>
      <Center mt="1/2">
        <Stack space={5}>
          <Input
            onChangeText={(text) => setEmail(text)}
            w="3/4"
            h="12"
            placeholder="Email"
            autoCapitalize="none"
            autoComplete="email"
            autoFocus
            InputLeftElement={
              <Center ml="3">
                <FontAwesome name="envelope" size={15} />
              </Center>
            }
            onSubmitEditing={() => pwdRef.current.focus()}
          />
          <Input
            ref={pwdRef}
            w="3/4"
            h="12"
            type={show ? "text" : "password"}
            placeholder="Password"
            onChangeText={(text) => setPassword(text)}
            autoComplete="password"
            autoCapitalize="none"
            InputLeftElement={
              <Center ml="3.5">
                <FontAwesome name="lock" size={20} />
              </Center>
            }
            InputRightElement={
              <Center mr="3">
                <FontAwesome
                  size={20}
                  name={show ? "eye-slash" : "eye"}
                  onPress={() => setShow((v) => !v)}
                />
              </Center>
            }
            onSubmitEditing={tryToRegister}
          />
          <Button
            colorScheme="darkBlue"
            isLoading={loading}
            onPress={tryToRegister}
          >
            <Text color="white" fontSize="lg">
              Sign Up
            </Text>
          </Button>
          <Center>
            <HStack space="1">
              <Text>Already have an account?</Text>
              <Text
                color="blue.600"
                onPress={() => navigation.navigate("SignIn")}
              >
                Login
              </Text>
            </HStack>
          </Center>
        </Stack>
      </Center>
    </KeyboardAwareScrollView>
  );
}
