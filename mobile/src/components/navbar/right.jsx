import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Box, IconButton } from "native-base";
import { useUserAuth } from "../../store/auth/provider";

export default function Right(props) {
  const {
    actions: { logout },
  } = useUserAuth();

  return (
    <Box {...props} mr="3" mt="3" height="10">
      <IconButton
        icon={<FontAwesome name="sign-out" size={23} color="#ff5500" />}
        rounded="full"
        onPress={() => logout()}
      />
    </Box>
  );
}
