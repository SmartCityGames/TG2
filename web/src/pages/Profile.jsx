import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
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
            <FormControl maxW="xs" isDisabled isInvalid={wallet !== account}>
              <FormLabel>Carteira:</FormLabel>
              <Input value={shortenAccount(wallet)} />
              <FormErrorMessage>
                Sua carteira vinculada não é a mesma que você está logado
              </FormErrorMessage>
            </FormControl>
            <FormControl maxW="xs" isDisabled>
              <FormLabel>Email:</FormLabel>
              <Input value={session.user.email} />
            </FormControl>
            <FormControl
              maxW="xs"
              isInvalid={!!errors.username && touched.username}
            >
              <FormLabel htmlFor="username">
                usuário do OpenStreetMap:
              </FormLabel>
              <Field
                as={Input}
                id="username"
                name="username"
                type="text"
                autoComplete="username"
              />
              <FormHelperText>
                Seu usuário será utilizado para buscar suas mudanças no app
              </FormHelperText>
              <FormErrorMessage>{errors.username}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="purple"
              width="full"
              isDisabled={loading || values.username === username}
            >
              Salvar alterações
            </Button>
          </Flex>
        </form>
      )}
    </Formik>
  );
}
