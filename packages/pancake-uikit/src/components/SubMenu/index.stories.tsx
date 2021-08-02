import React from "react";
import { BrowserRouter, Link } from "react-router-dom";
import SubMenu from "./SubMenu";
import { SubMenuItem } from "./styles";
import { LinkExternal } from "../Link";
import { Flex } from "../Box";
import { Text } from "../Text";
import { EllipsisIcon } from "../Svg";

export default {
  title: "Components/SubMenu",
  component: SubMenu,
  argTypes: {},
};

export const Default: React.FC = () => {
  return (
    <BrowserRouter>
      <Flex mb="24px" p="8px" width="300px" border="1px solid grey" justifyContent="space-between" alignItems="center">
        <Text>Icon</Text>
        <SubMenu
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
        </SubMenu>
      </Flex>
      <Flex p="8px" width="300px" border="1px solid grey" justifyContent="space-between" alignItems="center">
        <Text>Text</Text>
        <SubMenu
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
        </SubMenu>
      </Flex>
    </BrowserRouter>
  );
};
