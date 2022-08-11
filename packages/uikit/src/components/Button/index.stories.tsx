/* eslint-disable import/no-extraneous-dependencies */
import capitalize from "lodash/capitalize";
import React, { useState } from "react";
import { BrowserRouter, Link } from "react-router-dom";
import styled from "styled-components";
import Box from "../Box/Box";
import Flex from "../Box/Flex";
import { AddIcon, AutoRenewIcon, LogoIcon } from "../Svg";
import IconButton from "./IconButton";
import Button from "./Button";
import { ExpandableButton, ExpandableLabel } from "./ExpandableButton";
import { scales, variants } from "./types";

export default {
  title: "Components/Button",
  component: Button,
  argTypes: {},
};

const Row = styled(Flex)`
  margin-bottom: 32px;
  & > button + button,
  & > a + a {
    margin-left: 16px;
  }
`;

export const Default: React.FC<React.PropsWithChildren> = () => {
  return (
    <>
      <Box mb="32px">
        <button type="button">Unstyled Button</button>
      </Box>
      <Box mb="32px">
        {Object.values(variants).map((variant) => {
          return (
            <Box key={variant} mb="32px">
              {Object.values(scales).map((scale) => {
                return (
                  <Button key={scale} variant={variant} scale={scale} mr="8px">
                    {`${capitalize(variant)} ${scale.toUpperCase()}`}
                  </Button>
                );
              })}
            </Box>
          );
        })}
      </Box>
      <Box>
        <Button mr="8px" disabled>
          Disabled
        </Button>
        <Button variant="secondary" mr="8px" disabled>
          Disabled
        </Button>
        <Button disabled p="0 45px" decorator={{ text: "Soon" }}>
          Locked
        </Button>
      </Box>
    </>
  );
};

export const Anchors: React.FC<React.PropsWithChildren> = () => {
  return (
    <>
      <Box mb="32px">
        {Object.values(variants).map((variant) => {
          return (
            <Box key={variant} mb="32px">
              {Object.values(scales).map((scale) => {
                return (
                  <Button
                    as="a"
                    href="https://pancakeswap.finance"
                    key={scale}
                    variant={variant}
                    scale={scale}
                    external
                    mr="8px"
                  >
                    {`${capitalize(variant)} anchor ${scale.toUpperCase()}`}
                  </Button>
                );
              })}
            </Box>
          );
        })}
      </Box>
      <Box>
        <Button as="a" href="https://pancakeswap.finance" mr="8px" external disabled>
          Disabled
        </Button>
        <Button as="a" href="https://pancakeswap.finance" variant="secondary" external disabled>
          Disabled
        </Button>
      </Box>
    </>
  );
};

export const Variants: React.FC<React.PropsWithChildren> = () => {
  return (
    <Box width="640px">
      <BrowserRouter>
        <Row>
          <Button as={Link} to="/router-link" variant="secondary">
            As an React Router link
          </Button>
        </Row>
        <Row>
          <Button width="100%">Full size</Button>
        </Row>
        <Row>
          <Button isLoading endIcon={<AutoRenewIcon spin color="currentColor" />}>
            Approving
          </Button>
          <Button isLoading variant="success">
            Approving
          </Button>
        </Row>
        <Row>
          <Button startIcon={<LogoIcon />}>Start Icon</Button>
          <Button endIcon={<LogoIcon />}>End Icon</Button>
          <Button startIcon={<LogoIcon />} endIcon={<LogoIcon />}>
            Start & End Icon
          </Button>
        </Row>
        <Row>
          <IconButton>
            <LogoIcon />
          </IconButton>
          <IconButton variant="secondary">
            <AddIcon />
          </IconButton>
        </Row>
        <Row>
          <IconButton scale="sm" variant="danger">
            <LogoIcon />
          </IconButton>
          <IconButton scale="sm" variant="success">
            <AddIcon color="currentColor" />
          </IconButton>
        </Row>
      </BrowserRouter>
    </Box>
  );
};

export const Expandable: React.FC<React.PropsWithChildren> = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Box width="640px">
      <BrowserRouter>
        <Row>
          <ExpandableButton expanded={expanded} onClick={() => setExpanded((prev) => !prev)} />
          <ExpandableLabel expanded={expanded} onClick={() => setExpanded((prev) => !prev)}>
            ExpandableLabel
          </ExpandableLabel>
        </Row>
      </BrowserRouter>
    </Box>
  );
};
