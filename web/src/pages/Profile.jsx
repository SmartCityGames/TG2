import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { Field, Formik } from "formik";
import CenteredSpinner from "../components/CenteredSpinner";
import { useUserAuth } from "../store/auth/provider";
import { useMetamask } from "../store/metamask/metamask";
import { useUserProfile } from "../store/profile/provider";
import { shortenAccount } from "../utils/shorten-account";

export default function Profile() {
  const {
    state: { session },
  } = useUserAuth();

  const {
    state: { username, wallet, loading },
    actions: { updateProfile },
  } = useUserProfile();

  const {
    state: { account },
  } = useMetamask();

  if (loading || !wallet) {
    return <CenteredSpinner />;
  }

  return (
    <Formik
      initialValues={{
        username,
      }}
      onSubmit={({ username }) => {
        updateProfile({ username });
      }}
    >
      {({ handleSubmit, errors, touched, values }) => (
        <form onSubmit={handleSubmit}>
          <Flex
            flex={1}
            gap={4}
            direction="column"
            align="center"
            justify="center"
            color="white"
          >
            <FormControl isDisabled isInvalid={wallet !== account}>
              <FormLabel>Wallet:</FormLabel>
              <Input value={shortenAccount(wallet)} />
              <FormErrorMessage>
                Your binded wallet isn't the same you're logged in
              </FormErrorMessage>
            </FormControl>
            <FormControl isDisabled>
              <FormLabel>Email address:</FormLabel>
              <Input value={session.user.email} />
            </FormControl>
            <FormControl isInvalid={!!errors.username && touched.username}>
              <FormLabel htmlFor="username">OpenStreetMap username:</FormLabel>
              <Field
                as={Input}
                id="username"
                name="username"
                type="text"
                autoComplete="username"
              />
              <FormErrorMessage>{errors.username}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="purple"
              width="full"
              isDisabled={loading || values.username === username}
            >
              Save Changes
            </Button>
          </Flex>
        </form>
      )}
    </Formik>
  );
}
