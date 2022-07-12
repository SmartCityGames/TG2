import { Box, IconButton } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { useUserAuth } from "../../store/auth/provider";

export default function Right(props) {
  const {
    actions: { logout },
  } = useUserAuth();

  return (
    <Box {...props} mr="3" mt="3" height="10">
      <IconButton
        icon={<Icon name="sign-out" size={20} color="#ff5500" />}
        variant="outline"
        onPress={() => logout()}
      />
    </Box>
  );
}
