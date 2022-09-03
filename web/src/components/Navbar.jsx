import {
  Button,
  Flex,
  Hide,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Show,
  Text,
} from "@chakra-ui/react";
import { FaBars, FaSignOutAlt, FaUser, FaWallet } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../store/auth/provider";
import { useMetamask } from "../store/metamask/metamask";
import { useUserProfile } from "../store/profile/provider";

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
      <Text
        fontWeight="bold"
        fontSize={["lg", "4xl"]}
        bgGradient="linear(to-l, #7928CA, #FF0080)"
        bgClip="text"
        onClick={() => navigate("/")}
        _hover={{
          bgGradient: "linear(to-r, #7929EA, #FDAA80)",
          cursor: "pointer",
        }}
      >
        Smarty City Games
      </Text>
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
