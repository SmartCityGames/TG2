import { Button, Center, HStack, Image, Input, Stack, Text } from "native-base";
import { useState, useRef } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/FontAwesome";
import { useUserAuth } from "../../../store/auth/provider";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const pwdRef = useRef();

  const {
    state: { loading },
    actions: { signin },
  } = useUserAuth();

  function tryToLogin() {
    if (!email || !password) return;
    signin({ email, password });
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
                <Icon name="envelope" size={15} />
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
                <Icon name="lock" size={20} />
              </Center>
            }
            InputRightElement={
              <Center mr="3">
                <Icon
                  size={20}
                  name={show ? "eye-slash" : "eye"}
                  onPress={() => setShow((v) => !v)}
                />
              </Center>
            }
            onSubmitEditing={tryToLogin}
          />
          <Button colorScheme="darkBlue" isLoading={loading} onPress={tryToLogin}>
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
