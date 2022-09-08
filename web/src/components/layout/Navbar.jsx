import {
  Button,
  Flex,
  Hide,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Show,
  Text,
} from "@chakra-ui/react";
import { FaBars, FaSignOutAlt, FaUser, FaWallet } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../store/auth/provider";
import { useMetamask } from "../../store/metamask/provider";
import { useUserProfile } from "../../store/profile/provider";
import logo from "../../assets/logo-scyg.png";

export default function Navbar() {
  const navigate = useNavigate();
  const {
    actions: { logout },
  } = useUserAuth();

  const {
    state: { account },
    actions: { checkWallet },
  } = useMetamask();

  const {
    state: { wallet },
  } = useUserProfile();

  return (
    <Flex h="64px" p="6" align="center" justify="space-between" direction="row">
      <HStack
        onClick={() => navigate("/")}
        _hover={{
          cursor: "pointer",
        }}
      >
        <Image src={logo} alt="scyg-logo" w="12" h="12" />
        <Text
          fontWeight="bold"
          fontSize={["lg", "4xl"]}
          bgGradient="linear(to-l, #7928CA, #FF0080)"
          bgClip="text"
          _hover={{
            bgGradient: "linear(to-r, #7929EA, #FDAA80)",
          }}
        >
          Smarty City Games
        </Text>
      </HStack>
      <Show below={!account ? "lg" : "md"}>
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<FaBars />}
            variant="outline"
          />
          <MenuList>
            {!account && (
              <MenuItem
                color="orange.500"
                icon={<FaWallet />}
                onClick={() => checkWallet(wallet)}
              >
                Login Metamask
              </MenuItem>
            )}
            <MenuItem
              color="blue.500"
              icon={<FaUser />}
              onClick={() => navigate("/me")}
            >
              Conta
            </MenuItem>
            <MenuItem
              color="red.500"
              icon={<FaSignOutAlt />}
              onClick={() => logout()}
            >
              Sair
            </MenuItem>
          </MenuList>
        </Menu>
      </Show>
      <Hide below={!account ? "lg" : "md"}>
        <Flex
          align="center"
          justify="space-between"
          direction="row"
          gap={[3, 12]}
        >
          {!account && (
            <Button
              leftIcon={<FaWallet />}
              onClick={() => checkWallet(wallet)}
              colorScheme="orange"
              variant="outline"
            >
              Login Metamask
            </Button>
          )}
          <Button
            leftIcon={<FaUser />}
            onClick={() => navigate("/me")}
            colorScheme="blue"
            variant="outline"
          >
            Conta
          </Button>
          <Button
            onClick={() => logout()}
            leftIcon={<FaSignOutAlt />}
            colorScheme="red"
            variant="solid"
          >
            Sair
          </Button>
        </Flex>
      </Hide>
    </Flex>
  );
}
