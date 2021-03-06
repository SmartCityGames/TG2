import { Button, Center, HStack, Text, VStack } from "native-base";
import { Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";

export default function NoLocationPermissions() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Center flex={1} bg="purple.200">
        <VStack space={5}>
          <VStack space={3}>
            <Text fontWeight="bold" fontSize="xl" color="gray.900">
              This application needs your exact location!
            </Text>
            <Text fontSize="md" color="gray.600">
              Go to settings and
            </Text>
            <VStack space={2}>
              <HStack space={3}>
                <Icon name="location-arrow" size={20} color="blue" />
                <Text>Select location</Text>
              </HStack>
              <HStack space={3}>
                <Icon name="check" size={16} color="green" />
                <Text>
                  Allow <Text>Always</Text> or <Text>During app use</Text>
                </Text>
              </HStack>
            </VStack>
          </VStack>
          <Button p="3" bg="red.500" onPress={() => Linking.openSettings()}>
            <Text fontSize="lg" fontWeight="bold" color="white">
              Configurations
            </Text>
          </Button>
        </VStack>
      </Center>
    </SafeAreaView>
  );
}
