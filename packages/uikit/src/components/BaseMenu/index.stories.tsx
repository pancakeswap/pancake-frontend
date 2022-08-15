import React, { useState } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserRouter, Link } from "react-router-dom";
import InlineMenu from "./InlineMenu";
import SubMenuComp from "./SubMenu";
import { SubMenuItem } from "./styles";
import { LinkExternal } from "../Link";
import { Box, Flex, Grid } from "../Box";
import { Text } from "../Text";
import Button from "../Button/Button";
import { EllipsisIcon } from "../Svg";

export default {
  title: "Components/Menu",
};

export const Default: React.FC<React.PropsWithChildren> = () => {
  return (
    <Flex justifyContent="space-around" p="64px">
      <InlineMenu component={<Button>Inline Menu #1</Button>}>
        <Box p="24px" width="320px">
          <Text>Menu Content</Text>
        </Box>
        <Grid
          alignItems="center"
          borderTop="1px solid"
          borderTopColor="cardBorder"
          py="16px"
          px="24px"
          gridGap="16px"
          gridTemplateColumns="repeat(2, 1fr)"
        >
          <Button variant="secondary">Clear</Button>
          <Button>Apply</Button>
        </Grid>
      </InlineMenu>
      <InlineMenu component={<Button variant="tertiary">Menu #2</Button>}>
        <Box p="24px" width="320px">
          <Text>Menu Content #2</Text>
        </Box>
      </InlineMenu>
    </Flex>
  );
};

export const Controlled: React.FC<React.PropsWithChildren> = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Box>
      <Button variant="success" scale="sm" mr="32px" onClick={() => setIsOpen(!isOpen)}>
        Outside component controlling menu
      </Button>
      <InlineMenu component={<Button>Controlled Menu</Button>} isOpen={isOpen}>
        <Box p="24px" width="320px">
          <Text mb="8px">Open Initially</Text>
          <Button scale="sm" variant="danger" onClick={() => setIsOpen(false)}>
            Close this menu inside
          </Button>
        </Box>
      </InlineMenu>
    </Box>
  );
};

export const SubMenu: React.FC<React.PropsWithChildren> = () => {
  return (
    <BrowserRouter>
      <Flex mb="24px" p="8px" width="300px" border="1px solid grey" justifyContent="space-between" alignItems="center">
        <Text>Icon</Text>
        <SubMenuComp
          component={<EllipsisIcon height="16px" width="16px" />}
          options={{ placement: "right", offset: [0, 15], padding: { top: 20 } }}
        >
          <SubMenuItem as={LinkExternal} href="https://bscscan.com" bold={false} color="text">
            View on BSCScan
          </SubMenuItem>
          <SubMenuItem as={LinkExternal} href="https://pancakeswap.info" bold={false} color="text" target="blank">
            View on PCS Info
          </SubMenuItem>
          <SubMenuItem as={Link} to="/profile">
            Go to profile page
          </SubMenuItem>
          <SubMenuItem>Just button</SubMenuItem>
        </SubMenuComp>
      </Flex>
      <Flex p="8px" width="300px" border="1px solid grey" justifyContent="space-between" alignItems="center">
        <Text>Text</Text>
        <SubMenuComp
          component={
            <Text color="primary" bold>
              Click me
            </Text>
          }
        >
          <SubMenuItem as={LinkExternal} href="https://bscscan.com" bold={false} color="text">
            View on BSCScan
          </SubMenuItem>
          <SubMenuItem as={LinkExternal} href="https://pancakeswap.info" bold={false} color="text" target="blank">
            View on PCS Info
          </SubMenuItem>
          <SubMenuItem as={Link} to="/profile">
            Go to profile page
          </SubMenuItem>
          <SubMenuItem>Just button</SubMenuItem>
        </SubMenuComp>
      </Flex>
    </BrowserRouter>
  );
};
