import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import { Avatar, Box, Pressable } from "native-base";
import { useUserProfile } from "../../store/user-profile/provider";

export default function Left(props) {
  const {
    state: { avatar_url },
    actions: { updateProfilePicture },
  } = useUserProfile();

  async function pickImage() {
    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      allowsMultipleSelection: false,
    });

    if (!result.cancelled) {
      updateProfilePicture(result.uri);
    }
  }

  return (
    <Box {...props} ml="3" mt="5">
      <Pressable onPress={() => pickImage()}>
        <Avatar
          source={{ uri: avatar_url }}
          borderColor={"black"}
          borderWidth={1}
        >
          <Avatar.Badge bg="green.500" />
        </Avatar>
      </Pressable>
    </Box>
  );
}
