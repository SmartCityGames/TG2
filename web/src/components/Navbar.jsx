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
import { FaBars, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../store/auth/provider";

export default function Navbar() {
  const navigate = useNavigate();
  const {
    actions: { logout },
  } = useUserAuth();

  return (
    <Flex h="64px" p="6" align="center" justify="space-between" direction="row">
      <Text
        fontWeight="bold"
        fontSize={["lg", "4xl"]}
        bgGradient="linear(to-l, #7928CA, #FF0080)"
        bgClip="text"
      >
        Smarty City Games
      </Text>
      <Show below="md">
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<FaBars />}
            variant="outline"
          />
          <MenuList>
            <MenuItem
              color="blue.500"
              icon={<FaUser />}
              onClick={() => navigate("/me")}
            >
              Account
            </MenuItem>
            <MenuItem
              color="red.500"
              icon={<FaSignOutAlt />}
              onClick={() => logout()}
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Show>
      <Hide below="md">
        <Flex
          align="center"
          justify="space-between"
          direction="row"
          gap={[3, 12]}
        >
          <Button
            leftIcon={<FaUser />}
            onClick={() => navigate("/me")}
            colorScheme="blue"
            variant="outline"
          >
            Account
          </Button>
          <Button
            onClick={() => logout()}
            leftIcon={<FaSignOutAlt />}
            colorScheme="red"
            variant="solid"
          >
            Logout
          </Button>
        </Flex>
      </Hide>
    </Flex>
  );
}
