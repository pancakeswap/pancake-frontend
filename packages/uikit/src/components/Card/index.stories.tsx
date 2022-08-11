import React from "react";
import styled, { useTheme } from "styled-components";
/* eslint-disable import/no-unresolved */
import { Meta } from "@storybook/react/types-6-0";
import Box from "../Box/Box";
import Heading from "../Heading/Heading";
import CardRibbon from "./CardRibbon";
import UIKitCardHeader from "./CardHeader";
import CardBody from "./CardBody";
import CardFooter from "./CardFooter";
import Card from "./Card";

const Row = styled.div`
  margin-bottom: 32px;
`;

export default {
  title: "Components/Card",
  component: Card,
  argTypes: {},
} as Meta;

export const Default: React.FC<React.PropsWithChildren> = () => {
  return (
    <div style={{ padding: "32px", width: "500px" }}>
      <Row>
        <Card>
          <CardBody>Body</CardBody>
          <CardFooter>Footer</CardFooter>
        </Card>
      </Row>
      <Row>
        <Card isActive>
          <CardBody>Active</CardBody>
          <CardFooter>Footer</CardFooter>
        </Card>
      </Row>
      <Row>
        <Card isSuccess>
          <CardBody>Success</CardBody>
          <CardFooter>Footer</CardFooter>
        </Card>
      </Row>
      <Row>
        <Card isWarning>
          <CardBody>Warning</CardBody>
          <CardFooter>Footer</CardFooter>
        </Card>
      </Row>
      <Row>
        <Card isDisabled>
          <CardBody>Disabled</CardBody>
          <CardFooter>Footer</CardFooter>
        </Card>
      </Row>
    </div>
  );
};

export const CardHeader: React.FC<React.PropsWithChildren> = () => {
  const theme = useTheme();
  // This is example how to make card header "overlap" the border.
  // Seems to be easiest solution that works on all screens and does not rely on absolute positioning trickery
  const headerHeight = "60px";
  const customHeadingColor = "#7645D9";
  const gradientStopPoint = `calc(${headerHeight} + 1px)`;
  const borderBackground = `linear-gradient(${customHeadingColor} ${gradientStopPoint}, ${theme.colors.cardBorder} ${gradientStopPoint})`;

  // Gradient overlap is also possible, just put the "dividing" gradient first and after that the header gradient
  const gradientBorderColor = `linear-gradient(transparent ${gradientStopPoint}, ${theme.colors.cardBorder} ${gradientStopPoint}), ${theme.colors.gradients.cardHeader}`;
  return (
    <div style={{ padding: "32px", width: "500px" }}>
      <Row>
        <Card borderBackground={borderBackground}>
          <Box background={customHeadingColor} p="16px" height={headerHeight}>
            <Heading size="xl" color="white">
              Custom overlapping Header
            </Heading>
          </Box>
          <CardBody>The border on sides of header is covered</CardBody>
          <CardFooter>Footer</CardFooter>
        </Card>
      </Row>
      <Row>
        <Card borderBackground={gradientBorderColor}>
          <Box background={theme.colors.gradients.cardHeader} p="16px" height={headerHeight}>
            <Heading size="xl">Gradient overlapping Header</Heading>
          </Box>
          <CardBody>The border on sides of header is covered</CardBody>
          <CardFooter>Footer</CardFooter>
        </Card>
      </Row>
      <Row>
        <Card>
          <UIKitCardHeader>
            <Heading size="xl">Card Header</Heading>
          </UIKitCardHeader>
          <CardBody>Body</CardBody>
          <CardFooter>Footer</CardFooter>
        </Card>
      </Row>
      <Row>
        <Card>
          <UIKitCardHeader variant="blue">
            <Heading size="xl">Card Header</Heading>
          </UIKitCardHeader>
          <CardBody>Body</CardBody>
          <CardFooter>Footer</CardFooter>
        </Card>
      </Row>
      <Row>
        <Card>
          <UIKitCardHeader variant="violet">
            <Heading size="xl">Card Header</Heading>
          </UIKitCardHeader>
          <CardBody>Body</CardBody>
          <CardFooter>Footer</CardFooter>
        </Card>
      </Row>
      <Row>
        <Card>
          <UIKitCardHeader variant="bubblegum">
            <Heading size="xl">Card Header</Heading>
          </UIKitCardHeader>
          <CardBody>Body</CardBody>
          <CardFooter>Footer</CardFooter>
        </Card>
      </Row>
    </div>
  );
};

export const CustomBackground: React.FC<React.PropsWithChildren> = () => {
  return (
    <div style={{ padding: "32px", width: "500px" }}>
      <Card background="#f0c243" borderBackground="#b88700">
        <CardBody style={{ height: "150px" }}>Custom background</CardBody>
      </Card>
    </div>
  );
};

export const Ribbon: React.FC<React.PropsWithChildren> = () => {
  return (
    <div style={{ padding: "32px", width: "500px" }}>
      <Row>
        <Card ribbon={<CardRibbon text="Ribbon" />}>
          <div style={{ height: "112px", backgroundColor: "#191326" }} />
          <CardBody style={{ height: "150px" }}>Body</CardBody>
        </Card>
      </Row>
      <Row>
        <Card ribbon={<CardRibbon variantColor="textDisabled" text="Ribbon with Long Text" />}>
          <CardBody style={{ height: "150px" }}>Ribbons will truncate when text is too long</CardBody>
        </Card>
      </Row>
      <Row>
        <Card ribbon={<CardRibbon variantColor="success" text="Success" />}>
          <CardBody style={{ height: "150px" }}>Card</CardBody>
        </Card>
      </Row>
      <Row>
        <Card ribbon={<CardRibbon variantColor="failure" text="Failure" />}>
          <CardBody style={{ height: "150px" }}>Any Color in the theme</CardBody>
        </Card>
      </Row>
      <Row>
        <Card ribbon={<CardRibbon variantColor="failure" text="Failure" ribbonPosition="left" />}>
          <CardBody style={{ height: "150px" }}>Any Color in the theme</CardBody>
        </Card>
      </Row>
    </div>
  );
};
