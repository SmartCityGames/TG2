import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Flex, IconButton } from "native-base";
import { useUserAuth } from "../../store/auth/provider";

export default function Right(props) {
  const {
    actions: { logout },
  } = useUserAuth();

  return (
    <Flex mr="3" align="center" justify="center" direction="column" {...props}>
      <IconButton
        icon={<FontAwesome name="sign-out" size={25} color="#ff5500" />}
        rounded="full"
        onPress={() => logout()}
      />
    </Flex>
  );
}
