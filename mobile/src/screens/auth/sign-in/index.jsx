import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  Button,
  Center,
  HStack,
  Image,
  Input,
  Link,
  Stack,
  Text,
} from "native-base";
import { useRef, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useUserAuth } from "../../../store/auth/provider";

export default function SignInScreen() {
  const { navigate } = useNavigation();

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
      <Center>
        <Stack space={5}>
          <Center>
            <Image
              mt="10"
              size="2xl"
              source={require("../../../../assets/map_marker.png")}
              alt="logo"
            />
          </Center>
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
                <FontAwesome5 name="envelope" size={15} />
              </Center>
            }
            onSubmitEditing={() => pwdRef.current.focus()}
          />
          <Input
            ref={pwdRef}
            w="3/4"
            h="12"
            type={show ? "text" : "password"}
            placeholder="Senha"
            onChangeText={(text) => setPassword(text)}
            autoComplete="password"
            autoCapitalize="none"
            InputLeftElement={
              <Center ml="3.5">
                <FontAwesome5 name="lock" size={20} />
              </Center>
            }
            InputRightElement={
              <Center mr="3">
                <FontAwesome5
                  size={20}
                  name={show ? "eye-slash" : "eye"}
                  onPress={() => setShow((v) => !v)}
                />
              </Center>
            }
            onSubmitEditing={tryToLogin}
          />
          <Button colorScheme="purple" isLoading={loading} onPress={tryToLogin}>
            <Text color="white" fontSize="lg">
              Entrar
            </Text>
          </Button>
          <Center>
            <HStack space="1">
              <Text>Não possui uma conta?</Text>
              <Link
                _text={{
                  color: "blue.600",
                }}
                onPress={() => navigate("SignUp")}
              >
                Cadastre-se agora
              </Link>
            </HStack>
          </Center>
        </Stack>
      </Center>
    </KeyboardAwareScrollView>
  );
}
